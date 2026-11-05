package com.adobe.guides.aem.components.core.linklocalization;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.rewriter.DefaultTransformer;
import org.apache.sling.rewriter.ProcessingComponentConfiguration;
import org.apache.sling.rewriter.ProcessingContext;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.util.Collection;

final class LinkLocalizationTransformer extends DefaultTransformer {

    private static final String ANCHOR = "a";
    private static final String HREF = "href";

    private LinkLocalizer localizer = LinkLocalizer.empty();
    private String[] excludedLinkAttributes = new String[0];

    @Override
    public void init(ProcessingContext context, ProcessingComponentConfiguration config) {
        Resource resource = context.getRequest().getResource();
        PageManager pageManager = resource.getResourceResolver().adaptTo(PageManager.class);
        Page page = pageManager == null ? null : pageManager.getContainingPage(resource);
        ConfigurationBuilder configurationBuilder = resource.adaptTo(ConfigurationBuilder.class);
        if (page == null || configurationBuilder == null) {
            return;
        }
        LinkLocalizationConfig linkLocalizationConfig = configurationBuilder.as(LinkLocalizationConfig.class);
        Collection<LinkLocalizationRule> rules = configurationBuilder.asCollection(LinkLocalizationRule.class);
        localizer = LinkLocalizer.create(linkLocalizationConfig, rules, page.getLanguage(false).toString());
        excludedLinkAttributes = linkLocalizationConfig.excludedLinkAttributes();
    }

    @Override
    public void startElement(String uri, String localName, String qName, Attributes atts) throws SAXException {
        Attributes attributes = atts;
        if (!localizer.isEmpty() && ANCHOR.equalsIgnoreCase(localName) && !hasExcludedAttribute(atts)) {
            attributes = localizeHref(atts);
        }
        super.startElement(uri, localName, qName, attributes);
    }

    private boolean hasExcludedAttribute(Attributes atts) {
        for (String attribute : excludedLinkAttributes) {
            if (atts.getIndex(attribute) >= 0) {
                return true;
            }
        }
        return false;
    }

    private Attributes localizeHref(Attributes atts) {
        int index = atts.getIndex(HREF);
        if (index < 0) {
            return atts;
        }
        String href = atts.getValue(index);
        String localized = localizer.localize(href);
        if (href.equals(localized)) {
            return atts;
        }
        AttributesImpl attributes = new AttributesImpl(atts);
        attributes.setValue(index, localized);
        return attributes;
    }
}
