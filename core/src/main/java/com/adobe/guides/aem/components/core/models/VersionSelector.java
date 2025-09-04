package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.adobe.guides.aem.components.core.beans.VersionSelectorBean;
import com.day.cq.wcm.api.PageFilter;
import com.drew.lang.annotations.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class VersionSelector {

    @ScriptVariable
    Page currentPage;

    @SlingObject
    ResourceResolver resourceResolver;

    List<VersionSelectorBean> versionSelectorBeans = new ArrayList<>();
    String currentVersion;

    @ValueMapValue
    String rootPagePath;
    
    @ValueMapValue
    Integer skipLevels = 0;

    private static final Logger LOGGER = LoggerFactory.getLogger(VersionSelector.class);

    @PostConstruct
    public void init() {
        try {
            LOGGER.debug("Root Page Path : {}, Skip Levels : {}", rootPagePath, skipLevels);
            
            PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
            if (pageManager == null) {
                LOGGER.error("Failed to adapt ResourceResolver to PageManager.");
                return;
            }
            Locale locale = currentPage.getLanguage();
            String currentPagePath = currentPage.getPath();
            Page rootPage = pageManager.getContainingPage(rootPagePath);
            
            if (rootPage == null) {
                LOGGER.warn("Root page could not be resolved.");
                return;
            }
            
            List<Page> versionPages = getRootItems(rootPage, skipLevels).collect(Collectors.toList());
            versionPages = versionPages.stream().filter(p -> {
                return locale.equals(p.getLanguage());
            }).collect(Collectors.toList()); 
            //Page versionPage = pageManager.getContainingPage(getCurrentVersionPath(rootPage.listChildren(), currentPagePath));
            LOGGER.trace("versionPages -> {}", versionPages.stream().map( p -> p.getPath()).collect(Collectors.toList()));   
            //Page versionPage = pageManager.getContainingPage(getCurrentVersionPath(versionPages.iterator(), currentPagePath));
            String currentVersionPagePath = getCurrentVersionPath(versionPages.iterator(), currentPagePath);
            LOGGER.debug("currentVersionPagePath -> {}", currentVersionPagePath);
            Page versionPage = pageManager.getPage(currentVersionPagePath);

            if (versionPage == null) {
                LOGGER.warn("Version page could not be resolved.");
                return;
            }

            this.currentVersion = versionPage.getTitle();                        
            String topicRelativePath = currentPagePath.replace(versionPage.getPath(), "");
            LOGGER.trace("currentVersion -> {}, topicRelativePath -> {}", currentVersion, topicRelativePath);

            //Iterator<Page> childPages = rootPage.listChildren();
            Iterator<Page> childPages  = versionPages.iterator();
            while (childPages.hasNext()) {
                Page childPage = childPages.next();
                String topicPagePath = childPage.getPath() + topicRelativePath;

                try {
                    Page topicPage = pageManager.getContainingPage(topicPagePath);
                    if (topicPage != null && !topicPagePath.equalsIgnoreCase(currentPagePath)) {
                        versionSelectorBeans.add(new VersionSelectorBean(
                                childPage.getTitle(),
                                topicPage.getPath() + ".html"
                        ));
                    } else {
                        LOGGER.warn("Topic page not found for path: {}", topicPagePath);
                    }
                } catch (Exception e) {
                    LOGGER.error("Error while processing topic page path: {}", topicPagePath, e);
                }
            }
        } catch (Exception e) {
            LOGGER.error("An unexpected error occurred while processing pages.", e);
        }
    }

    String getCurrentVersionPath(Iterator<Page> versionPages, String currentPagePath) {
        while (versionPages.hasNext()) {
            Page versionPage = versionPages.next();
            String versionPagePath = versionPage.getPath();
            if (currentPagePath.contains(versionPagePath)) {
                return versionPagePath;
            }
        }
        return StringUtils.EMPTY;
    }

    private Stream<Page> getRootItems(@NotNull final Page navigationRoot, final int structureStart) {
        if (structureStart < 1) {
            return Stream.of(navigationRoot);
        }
        Iterator<Page> childIterator = navigationRoot.listChildren(new PageFilter());
        return StreamSupport.stream(((Iterable<Page>) () -> childIterator).spliterator(), false)
            .flatMap(child -> getRootItems(child, structureStart - 1));
    }

    public List<VersionSelectorBean> getVersionSelectorBeans() {
        return versionSelectorBeans;
    }

    public String getCurrentVersion() {
        return currentVersion;
    }
    
    
}
