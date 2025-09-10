package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
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

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PrevNextTopicModel {

    private static final Logger logger = LoggerFactory.getLogger(PrevNextTopicModel.class);

    @SlingObject
    private ResourceResolver resourceResolver;

    @SlingObject
    private Resource resource;

    @ScriptVariable
    private Page currentPage;

    @ValueMapValue
    private String previousIcon;

    @ValueMapValue
    private String previousLabel;

    @ValueMapValue
    private String nextIcon;

    @ValueMapValue
    private String nextLabel;

    private List<Page> topicPages = new ArrayList<>();

    private String pageTemplate;

    private String previousTopicTitle;

    private String nextTopicTitle;

    private String previousTopicLink;

    private String nextTopicLink;

    @PostConstruct
    protected void init() {
        if (currentPage == null) {
            return;
        }

        ValueMap valueMap = currentPage.getProperties();
        String basePath = valueMap.get("sitePath", String.class);
        if (StringUtils.isBlank(basePath)) {
            return;
        }

        pageTemplate = valueMap.get("cq:template", String.class);
        Page basePage = getBasePage(basePath);
        if (basePage != null) {
            filterTopicPages(basePage);
            findPreviousAndNextTopicPages();
        }
    }

    private Page getBasePage(String basePath) {
        PageManager pageManager = currentPage.getPageManager();
        return pageManager != null ? pageManager.getContainingPage(basePath) : null;
    }

    private void filterTopicPages(Page parentPage) {
        Iterator<Page> childPages = parentPage.listChildren();
        while (childPages.hasNext()) {
            Page childPage = childPages.next();
            String templatePath = childPage.getProperties().get("cq:template", String.class);
            boolean excludeFlag = Boolean.TRUE.equals(childPage.getProperties().get("hideInNav", Boolean.class));
            if (pageTemplate.equals(templatePath) && !excludeFlag) {
                topicPages.add(childPage);
            }
            filterTopicPages(childPage);
        }
    }

    private void findPreviousAndNextTopicPages() {
        Page previousTopicPage;
        Page nextTopicPage;
        for (int i = 0; i < topicPages.size(); i++) {
            Page page = topicPages.get(i);
            if (page.getPath().equals(currentPage.getPath())) {
                if (i > 0) {
                    previousTopicPage = topicPages.get(i - 1);
                    previousTopicTitle = previousTopicPage.getProperties().get("jcr:title", String.class);
                    previousTopicLink = previousTopicPage.getPath() + ".html";
                }
                if (i < topicPages.size() - 1) {
                    nextTopicPage = topicPages.get(i + 1);
                    nextTopicTitle = nextTopicPage.getProperties().get("jcr:title", String.class);
                    nextTopicLink = nextTopicPage.getPath() + ".html";
                }
                break;
            }
        }
    }

    public String getPreviousIcon() {
        return previousIcon;
    }

    public String getPreviousLabel() {
        return previousLabel;
    }

    public String getNextIcon() {
        return nextIcon;
    }

    public String getNextLabel() {
        return nextLabel;
    }

    public String getPreviousTopicTitle() {
        return previousTopicTitle;
    }

    public String getNextTopicTitle() {
        return nextTopicTitle;
    }

    public String getPreviousTopicLink() {
        return previousTopicLink;
    }

    public String getNextTopicLink() {
        return nextTopicLink;
    }
}
