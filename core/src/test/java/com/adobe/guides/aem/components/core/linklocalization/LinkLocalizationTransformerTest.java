package com.adobe.guides.aem.components.core.linklocalization;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.caconfig.ConfigurationBuilder;
import org.apache.sling.rewriter.ProcessingContext;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.AttributesImpl;

import java.util.Collections;
import java.util.Locale;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class LinkLocalizationTransformerTest {

    private static final String A = "a";
    private static final String HREF = "href";
    private static final String DITA_HREF = "data-attr-href";
    private static final String ENGLISH_URL = "https://www.adobe.com/legal/terms.html";
    private static final String JAPANESE_URL = "https://www.adobe.com/jp/legal/terms.html";

    private final ContentHandler contentHandler = mock(ContentHandler.class);
    private final Resource resource = mock(Resource.class);
    private final ProcessingContext processingContext = mock(ProcessingContext.class);
    private final Page page = mock(Page.class);
    private final ConfigurationBuilder configurationBuilder = mock(ConfigurationBuilder.class);
    private final LinkLocalizationTransformer transformer = new LinkLocalizationTransformer();

    @BeforeEach
    public void setUp() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        ResourceResolver resourceResolver = mock(ResourceResolver.class);
        PageManager pageManager = mock(PageManager.class);
        when(processingContext.getRequest()).thenReturn(request);
        when(request.getResource()).thenReturn(resource);
        when(resource.getResourceResolver()).thenReturn(resourceResolver);
        when(resourceResolver.adaptTo(PageManager.class)).thenReturn(pageManager);
        when(pageManager.getContainingPage(resource)).thenReturn(page);
        when(page.getLanguage(false)).thenReturn(Locale.JAPANESE);
        when(resource.adaptTo(ConfigurationBuilder.class)).thenReturn(configurationBuilder);
        LinkLocalizationConfig config = config();
        LinkLocalizationRule rule = rule();
        when(configurationBuilder.as(LinkLocalizationConfig.class)).thenReturn(config);
        when(configurationBuilder.asCollection(LinkLocalizationRule.class)).thenReturn(Collections.singletonList(rule));
        transformer.setContentHandler(contentHandler);
    }

    @Test
    public void shouldLocalizeAnchorHrefWhenHostHasRule() throws SAXException {
        transformer.init(processingContext, null);

        transformer.startElement("", A, A, attributes(HREF, ENGLISH_URL));

        assertEquals(JAPANESE_URL, forwardedHref());
    }

    @Test
    public void shouldNotLocalizeAnchorHrefWhenAnchorHasExcludedAttribute() throws SAXException {
        transformer.init(processingContext, null);
        AttributesImpl attributes = attributes(HREF, ENGLISH_URL);
        attributes.addAttribute("", DITA_HREF, DITA_HREF, "CDATA", ENGLISH_URL);

        transformer.startElement("", A, A, attributes);

        assertEquals(ENGLISH_URL, forwardedHref());
    }

    @Test
    public void shouldNotLocalizeHrefWhenElementIsNotAnAnchor() throws SAXException {
        transformer.init(processingContext, null);

        transformer.startElement("", "link", "link", attributes(HREF, ENGLISH_URL));

        assertEquals(ENGLISH_URL, forwardedHref());
    }

    @Test
    public void shouldNotLocalizeWhenResourceHasNoConfiguration() throws SAXException {
        when(resource.adaptTo(ConfigurationBuilder.class)).thenReturn(null);
        transformer.init(processingContext, null);

        transformer.startElement("", A, A, attributes(HREF, ENGLISH_URL));

        assertEquals(ENGLISH_URL, forwardedHref());
    }

    @Test
    public void shouldNotLocalizeWhenPageLocaleHasNoMapping() throws SAXException {
        when(page.getLanguage(false)).thenReturn(Locale.ENGLISH);
        transformer.init(processingContext, null);

        transformer.startElement("", A, A, attributes(HREF, ENGLISH_URL));

        assertEquals(ENGLISH_URL, forwardedHref());
    }

    private String forwardedHref() throws SAXException {
        ArgumentCaptor<Attributes> captor = ArgumentCaptor.forClass(Attributes.class);
        verify(contentHandler, atLeastOnce()).startElement(any(), any(), any(), captor.capture());
        return captor.getAllValues().get(captor.getAllValues().size() - 1).getValue(HREF);
    }

    private static AttributesImpl attributes(String name, String value) {
        AttributesImpl attributes = new AttributesImpl();
        attributes.addAttribute("", name, name, "CDATA", value);
        return attributes;
    }

    private static LinkLocalizationRule rule() {
        LinkLocalizationRule rule = mock(LinkLocalizationRule.class);
        when(rule.hosts()).thenReturn(new String[] {"www.adobe.com"});
        when(rule.pattern()).thenReturn("PATH_PREFIX");
        when(rule.queryParameter()).thenReturn("");
        when(rule.localeCodes()).thenReturn(new String[] {"ja=jp"});
        return rule;
    }

    private static LinkLocalizationConfig config() {
        LinkLocalizationConfig config = mock(LinkLocalizationConfig.class);
        when(config.excludedUrls()).thenReturn(new String[] {});
        when(config.excludedLinkAttributes()).thenReturn(new String[] {DITA_HREF});
        return config;
    }
}
