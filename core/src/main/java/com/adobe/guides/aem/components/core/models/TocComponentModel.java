package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.Iterator;

@Model(
        adaptables = {Resource.class, SlingHttpServletRequest.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TocComponentModel {
    private static final Logger logger = LoggerFactory.getLogger(TocComponentModel.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Page currentPage;

    private Resource tocResource;

    @PostConstruct
    protected void init() {
        Resource contentResource = currentPage.getContentResource();
        tocResource = contentResource.getChild("toc");

        if (tocResource == null) {
            tocResource = findLatestTocFromChildPages(currentPage);
        }
    }

    public String renderTOCContent() {
        if (tocResource != null) {
            return renderTOC(tocResource.getChildren(), "");
        }
        return StringUtils.EMPTY;
    }

    private Resource findLatestTocFromChildPages(Page parentPage) {
        Page latestPage = null;
        Date latestDate = null;

        Iterator<Page> childPages = parentPage.listChildren();
        while (childPages.hasNext()) {
            Page child = childPages.next();
            Resource childContentResource = child.getContentResource();
            Resource childToc = childContentResource.getChild("toc");

            if (childToc != null) {
                ValueMap properties = childContentResource.getValueMap();
                Date createdDate = properties.get("jcr:created", Date.class);

                if (createdDate != null && (latestDate == null || createdDate.after(latestDate))) {
                    latestPage = child;
                    latestDate = createdDate;
                }
            }
        }

        return latestPage != null ? latestPage.getContentResource().getChild("toc") : null;
    }

    private String renderTOC(Iterable<Resource> topChildren, String parentKey) {
        StringBuilder html = new StringBuilder();
        int childCount = 0;
        for (Resource topChild : topChildren) {
            ValueMap props = topChild.getValueMap();
            String topLink = props.get("link", "");
            String topTitle = props.get("title", topLink);
            final String childKey = String.format("%s%d", parentKey.isEmpty() ? "" : parentKey + ".", childCount++);

            if (StringUtils.isBlank(topLink)) continue;

            topLink = topLink + "?toc=" + childKey;
            if ("no".equalsIgnoreCase(props.get("toc", ""))) {
                renderTOC(topChild.getChildren(), childKey);
                continue;
            }

            html.append("<div class='tocitem'>");
            html.append("<div class='mainentry'>");
            html.append("<a href='" + topLink + "'>" + topTitle + "</a></div>");

            for (Resource subChild : topChild.getChildren()) {
                String subLink = subChild.getValueMap().get("link", "");
                String subTitle = subChild.getValueMap().get("title", subLink);
                final String subchildKey = String.format("%s.%d", childKey, childCount++);

                if (StringUtils.isBlank(subLink)) continue;
                subLink = subLink + "?toc=" + subchildKey;
                html.append("<div class='subentry'><a href='" + subLink + "'>" + subTitle + "</a></div>");
            }
            html.append("</div>");
        }
        return html.toString();
    }
}
