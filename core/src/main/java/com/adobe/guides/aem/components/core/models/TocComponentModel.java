package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import javax.annotation.PostConstruct;
import java.util.Iterator;

@Model(
        adaptables = { SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TocComponentModel {
    private static final String TOPIC_TEMPLATE_FRAGMENT = "guides-topic-page";

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Page currentPage;

    private String tocHtml;

    @PostConstruct
    protected void init() {
        StringBuilder html = new StringBuilder();
        PageManager pm = request.getResourceResolver().adaptTo(PageManager.class);

        // 1) iterate your topic pages (same filter you had)
        Iterator<Page> topics = currentPage.listChildren();
        while (topics.hasNext()) {
            Page topic = topics.next();
            if (topic.getTemplate() != null
                    && topic.getTemplate().getPath().contains(TOPIC_TEMPLATE_FRAGMENT)) {
                // 2) render each topic + its sub-pages
                renderTopic(topic, html);
            }
        }

        tocHtml = html.toString();
    }

    /**
     * Renders one topic and its immediate sub-pages into the given StringBuilder.
     */
    private void renderTopic(Page topic, StringBuilder html) {
        String topicPath = topic.getPath() + ".html";
        String title     = StringUtils.defaultIfBlank(topic.getTitle(), topic.getName());

        html.append("<div class='tocitem'>")
                .append("<div class='mainentry'>")
                .append("<a href='").append(topicPath).append("'>")
                .append(title)
                .append("</a>")
                .append("</div>");

        // now render any child pages as subentries
        Iterator<Page> subs = topic.listChildren();
        while (subs.hasNext()) {
            Page sub = subs.next();
            String subPath = sub.getPath() + ".html";
            String subTitle = StringUtils.defaultIfBlank(sub.getTitle(), sub.getName());

            html.append("<div class='subentry'>")
                    .append("<a href='").append(subPath).append("'>")
                    .append(subTitle)
                    .append("</a>")
                    .append("</div>");
        }

        html.append("</div>"); // close tocitem
    }

    /**
     * Call this from HTL to inject the fully-rendered TOC
     */
    public String getTocHtml() {
        return tocHtml;
    }
}
