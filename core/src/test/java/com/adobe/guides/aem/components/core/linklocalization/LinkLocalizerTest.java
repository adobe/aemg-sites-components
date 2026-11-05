package com.adobe.guides.aem.components.core.linklocalization;

import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class LinkLocalizerTest {

    private static final String JA = "ja";
    private static final String EN = "en";
    private static final String PATH_PREFIX = "PATH_PREFIX";
    private static final String QUERY_PARAMETER = "QUERY_PARAMETER";
    private static final String LANG = "lang";
    private static final String[] PATH_CODES = {"ja=jp", "de=de", "fr=fr"};
    private static final String[] QUERY_CODES = {"ja=ja", "de=de", "fr=fr"};
    private static final String[] NO_EXCLUSIONS = {};

    private static final LinkLocalizationRule ADOBE_PATH_RULE =
            rule(new String[] {"www.adobe.com", "helpx.adobe.com"}, PATH_PREFIX, "", PATH_CODES);
    private static final LinkLocalizationRule ACCOUNT_QUERY_RULE =
            rule(new String[] {"account.adobe.com"}, QUERY_PARAMETER, LANG, QUERY_CODES);

    @Test
    public void shouldInsertMappedCodeAsFirstPathSegmentWhenHostUsesPathPrefix() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("https://helpx.adobe.com/jp/support.html", localizer.localize("https://helpx.adobe.com/support.html"));
    }

    @Test
    public void shouldKeepExistingPathSegmentsAndFragmentWhenUrlAlreadyHasCountryFolder() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("https://www.adobe.com/jp/in/privacy/opt-out.html#interest-based-ads",
                localizer.localize("https://www.adobe.com/in/privacy/opt-out.html#interest-based-ads"));
    }

    @Test
    public void shouldAddCodeAsPathWhenUrlHasNoPath() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("https://www.adobe.com/jp/", localizer.localize("https://www.adobe.com"));
    }

    @Test
    public void shouldAddCodeBeforeQueryWhenUrlHasQueryButNoPath() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("https://www.adobe.com/jp/?x=1", localizer.localize("https://www.adobe.com?x=1"));
    }

    @Test
    public void shouldMatchHostIgnoringCaseAndPort() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("HTTPS://WWW.Adobe.com:443/jp/legal/terms.html",
                localizer.localize("HTTPS://WWW.Adobe.com:443/legal/terms.html"));
    }

    @Test
    public void shouldAppendQueryParameterWhenUrlHasNoQuery() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ACCOUNT_QUERY_RULE);

        assertEquals("https://account.adobe.com/?lang=ja", localizer.localize("https://account.adobe.com/"));
    }

    @Test
    public void shouldAppendQueryParameterAfterExistingParametersWhenNotPresent() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ACCOUNT_QUERY_RULE);

        assertEquals("https://account.adobe.com/security?cfredirect&amp;lang=ja",
                localizer.localize("https://account.adobe.com/security?cfredirect"));
    }

    @Test
    public void shouldReplaceExistingQueryParameterAndKeepOthersAndFragmentWhenPresent() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ACCOUNT_QUERY_RULE);

        assertEquals("https://account.adobe.com/security?cfredirect&amp;lang=ja#top",
                localizer.localize("https://account.adobe.com/security?cfredirect&amp;lang=en#top"));
    }

    @Test
    public void shouldLeaveUrlUnchangedWhenItIsExcluded() {
        String excluded = "https://www.adobe.com/products/technical-content-solutions/events.html";
        LinkLocalizer localizer = localizer(JA, new String[] {excluded}, ADOBE_PATH_RULE);

        assertEquals(excluded, localizer.localize(excluded));
    }

    @Test
    public void shouldLeaveEncodedUrlUnchangedWhenItsDecodedFormIsExcluded() {
        String encoded = "https://account.adobe.com/security?cfredirect&amp;lang=en";
        LinkLocalizer localizer = localizer(JA, new String[] {"https://account.adobe.com/security?cfredirect&lang=en"},
                ACCOUNT_QUERY_RULE);

        assertEquals(encoded, localizer.localize(encoded));
    }

    @Test
    public void shouldLeaveUrlUnchangedWhenHostHasNoRule() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("https://partners.adobetechcomm.com/", localizer.localize("https://partners.adobetechcomm.com/"));
    }

    @Test
    public void shouldLeaveRelativeUrlUnchanged() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS, ADOBE_PATH_RULE);

        assertEquals("/content/rh/ja/docs.html", localizer.localize("/content/rh/ja/docs.html"));
    }

    @Test
    public void shouldBeEmptyWhenNoRuleMapsThePageLocale() {
        LinkLocalizer localizer = localizer(EN, NO_EXCLUSIONS, ADOBE_PATH_RULE, ACCOUNT_QUERY_RULE);

        assertTrue(localizer.isEmpty());
    }

    @Test
    public void shouldIgnoreRuleWhenPatternIsUnknown() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS,
                rule(new String[] {"www.adobe.com"}, "SUBDOMAIN", "", PATH_CODES));

        assertTrue(localizer.isEmpty());
    }

    @Test
    public void shouldIgnoreQueryParameterRuleWhenParameterNameIsMissing() {
        LinkLocalizer localizer = localizer(JA, NO_EXCLUSIONS,
                rule(new String[] {"account.adobe.com"}, QUERY_PARAMETER, " ", QUERY_CODES));

        assertTrue(localizer.isEmpty());
    }

    private static LinkLocalizer localizer(String locale, String[] excludedUrls, LinkLocalizationRule... rules) {
        LinkLocalizationConfig config = mock(LinkLocalizationConfig.class);
        when(config.excludedUrls()).thenReturn(excludedUrls);
        return LinkLocalizer.create(config, Arrays.asList(rules), locale);
    }

    private static LinkLocalizationRule rule(String[] hosts, String pattern, String queryParameter, String[] codes) {
        LinkLocalizationRule rule = mock(LinkLocalizationRule.class);
        when(rule.hosts()).thenReturn(hosts);
        when(rule.pattern()).thenReturn(pattern);
        when(rule.queryParameter()).thenReturn(queryParameter);
        when(rule.localeCodes()).thenReturn(codes);
        return rule;
    }
}
