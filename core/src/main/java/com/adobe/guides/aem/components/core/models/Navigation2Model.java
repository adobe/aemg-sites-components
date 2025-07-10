/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.wcm.core.components.commons.link.Link;
import com.adobe.cq.wcm.core.components.commons.link.LinkManager;
import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.models.Navigation;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = Navigation.class, resourceType = Navigation2Model.NAVIGATION_COMPONENT_RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class Navigation2Model implements Navigation {

    private static final Logger logger = LoggerFactory.getLogger(Navigation2Model.class);

    public static final String NAVIGATION_COMPONENT_RESOURCE_TYPE = "guides-components/components/navigation2";

    private static final String BASEPATH_ATTRIBUTE_NAME = "sitePath";

    @ScriptVariable
    private Page currentPage;

    @Self @Via(type = ResourceSuperType.class)
    private Navigation navigation;

    private Locale locale;

    @Inject
    private ResourceResolver resolver;

    @Inject
    @Self
    private LinkManager linkManager;

    private PageManager pm;

    @PostConstruct
    public void init() {
        if(resolver == null) {return;}
        this.pm = resolver.adaptTo(PageManager.class);
        if(currentPage == null) {return;}
        this.locale = currentPage.getLanguage();
        if(this.locale == null) {

        }
    }

    @Override
    public List<NavigationItem> getItems() {
        InheritanceValueMap currentHierarchyMap = new HierarchyNodeInheritanceValueMap(currentPage.getContentResource());
        String currentPageBaseline = currentHierarchyMap.getInherited("baseline", String.class);
        String currentPageBasePath = currentPage.getContentResource().getValueMap().get(BASEPATH_ATTRIBUTE_NAME, String.class);

        List<NavigationItem> items;
        List<NavigationItem> original = navigation.getItems();
        logger.trace("navigation.items.original -> {}", original.stream().map(item -> item.getPath()).collect(Collectors.toList()));
        items = original.stream().filter( item -> {
            String itemPagePath = item.getPath();
            if(itemPagePath == null) {return false;}
            Page itemPage = this.pm.getPage(itemPagePath);
            //logger.trace("current_page -> {}, navitem.page -> {}", currentPage.getPath(), page != null ? page.getPath() : "");
            if(itemPage == null) {return false;}

            if(currentPageBasePath != null) {
                if(!itemPagePath.contains(currentPageBasePath)) {
                    return false;   //not this product
                }
            }

            InheritanceValueMap itemPageHierarchyMap = new HierarchyNodeInheritanceValueMap(itemPage.getContentResource());
            String itemPageBaseline = itemPageHierarchyMap.getInherited("baseline", String.class);
            //logger.debug("currentPageBaseline -> {}, itemPageBaseline -> {}", currentPageBaseline, itemPageBaseline);
            if(currentPageBaseline != null && itemPageBaseline != null) {
                if(!currentPageBaseline.equals(itemPageBaseline)) {
                    return false;
                }
            }

            logger.debug("current_page.locale -> {}, navitem.locale -> {}", this.locale, itemPage.getLanguage());
            return this.locale.equals(itemPage.getLanguage());  // to only show topic pages from current language and locale
        }).map(item -> {
            String path = item.getPath();
            Page page = this.pm.getPage(path);
            boolean clickable = true;
            Resource pageContent = page.getContentResource();
            if(pageContent != null) {
                String slingResourceType = pageContent.getValueMap().get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, String.class);
                if(slingResourceType == null) {
                    clickable = false;
                    logger.debug("page.path -> {} is made not-clickable as it does not have sling:resourceType attribute", path);
                }
            }
            return new NavigationItemImpl(page, item.isActive(), item.isCurrent(), clickable, item.getLevel(), item.getChildren()/*, getId(), navigation*/);
        }).collect(Collectors.toList());
        logger.trace("navigation.items.modified -> {}", items.stream().map(item -> item.getPath()).collect(Collectors.toList()));
        return items;
    }

    public class NavigationItemImpl implements NavigationItem {
        Page page;
        boolean active;
        boolean current;
        boolean clickable;
        int level;
        List<NavigationItem> children;

        public NavigationItemImpl(Page page, boolean active, boolean current, boolean clickable, int level, List<NavigationItem> children) {
            this.page = page;
            this.active = active;
            this.current = current;
            this.clickable = clickable;
            this.level = level;
            this.children = children;

            this.sanitize();
        }

        private void sanitize() {
            logger.trace("navigation.child.items.original -> {}", children.stream().map(item -> item.getPath()).collect(Collectors.toList()));
            children = children.stream().map(item -> {
                String path = item.getPath();
                Page p = pm.getPage(path);
                boolean clkble = true;
                Resource pageContent = p.getContentResource();
                if(pageContent != null) {
                    String slingResourceType = pageContent.getValueMap().get(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY, String.class);
                    if(slingResourceType == null) {
                        clkble = false;
                        logger.debug("child.page.path -> {} is made not-clickable as it does not have sling:resourceType attribute", path);
                    }
                }
                return new NavigationItemImpl(p, item.isActive(), item.isCurrent(), clkble, item.getLevel(), item.getChildren());
            }).collect(Collectors.toList());
            logger.trace("navigation.child.items.modified -> {}", children.stream().map(item -> item.getPath()).collect(Collectors.toList()));
        }

        @Override
        public Page getPage() {
            return page;
        }

        @Override
        public boolean isActive() {
            return active;
        }

        @Override
        public boolean isCurrent() {
            return current;
        }

        @Override
        public int getLevel() {
            return level;
        }

        @Override
        public List<NavigationItem> getChildren() {
            return children;
        }

        @Override
        public String getPath() {
            return this.page.getPath();
        }

        @Override
        public String getName() {
            return this.page.getName();
        }

        @Override
        public Calendar getLastModified() {
            return this.page.getLastModified();         }

        @Override
        public String getDescription() {
            return this.page.getDescription();
        }

        @Override
        public String getTitle() {
            return this.page.getTitle();
        }


        @Override
        public Link getLink() {
            return linkManager.get(page).build();
        }

        @Override
        public String getURL() {
            return getLink().getURL();
        }

        public boolean isClickable() {
            return clickable;
        }

    }

}
