package com.adobe.guides.aem.components.core.linklocalization;

import org.apache.commons.lang3.EnumUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

final class LinkLocalizer {

    private static final Logger LOG = LoggerFactory.getLogger(LinkLocalizer.class);

    private static final String[] SCHEMES = {"http://", "https://"};
    private static final String AUTHORITY_TERMINATORS = "/?#";
    private static final String QUERY_SEPARATOR_PATTERN = "&amp;|&";
    private static final String ENCODED_QUERY_SEPARATOR = "&amp;";
    private static final String MAPPING_SEPARATOR = "=";

    private enum Pattern { PATH_PREFIX, QUERY_PARAMETER }

    private final Map<String, HostRule> rulesByHost;
    private final Set<String> excludedUrls;

    private LinkLocalizer(Map<String, HostRule> rulesByHost, Set<String> excludedUrls) {
        this.rulesByHost = rulesByHost;
        this.excludedUrls = excludedUrls;
    }

    static LinkLocalizer create(LinkLocalizationConfig config, Collection<LinkLocalizationRule> rules, String locale) {
        Map<String, HostRule> rulesByHost = new HashMap<>();
        for (LinkLocalizationRule rule : rules) {
            HostRule hostRule = HostRule.of(rule, locale);
            if (hostRule == null) {
                continue;
            }
            for (String host : rule.hosts()) {
                if (StringUtils.isNotBlank(host)) {
                    rulesByHost.put(host.trim().toLowerCase(Locale.ROOT), hostRule);
                }
            }
        }
        return new LinkLocalizer(rulesByHost, new HashSet<>(Arrays.asList(config.excludedUrls())));
    }

    static LinkLocalizer empty() {
        return new LinkLocalizer(Collections.emptyMap(), Collections.emptySet());
    }

    boolean isEmpty() {
        return rulesByHost.isEmpty();
    }

    String localize(String href) {
        if (href == null || excludedUrls.contains(href.replace(ENCODED_QUERY_SEPARATOR, "&"))) {
            return href;
        }
        int authorityStart = authorityStart(href);
        if (authorityStart < 0) {
            return href;
        }
        int authorityEnd = authorityEnd(href, authorityStart);
        HostRule rule = rulesByHost.get(host(href.substring(authorityStart, authorityEnd)));
        if (rule == null) {
            return href;
        }
        return rule.pattern == Pattern.PATH_PREFIX
                ? withPathPrefix(href, authorityEnd, rule.code)
                : withQueryParameter(href, authorityEnd, rule.queryParameter, rule.code);
    }

    private static int authorityStart(String href) {
        for (String scheme : SCHEMES) {
            if (href.regionMatches(true, 0, scheme, 0, scheme.length())) {
                return scheme.length();
            }
        }
        return -1;
    }

    private static int authorityEnd(String href, int authorityStart) {
        for (int i = authorityStart; i < href.length(); i++) {
            if (AUTHORITY_TERMINATORS.indexOf(href.charAt(i)) >= 0) {
                return i;
            }
        }
        return href.length();
    }

    private static String host(String authority) {
        String host = StringUtils.substringAfterLast(authority, "@");
        if (host.isEmpty()) {
            host = authority;
        }
        return StringUtils.substringBefore(host, ":").toLowerCase(Locale.ROOT);
    }

    private static String withPathPrefix(String href, int authorityEnd, String code) {
        String rest = href.substring(authorityEnd);
        String separator = rest.startsWith("/") ? "" : "/";
        return href.substring(0, authorityEnd) + "/" + code + separator + rest;
    }

    private static String withQueryParameter(String href, int authorityEnd, String name, String code) {
        int fragmentStart = href.indexOf('#', authorityEnd);
        String beforeFragment = fragmentStart < 0 ? href : href.substring(0, fragmentStart);
        String fragment = fragmentStart < 0 ? "" : href.substring(fragmentStart);
        String parameter = name + MAPPING_SEPARATOR + code;
        int queryStart = beforeFragment.indexOf('?', authorityEnd);
        if (queryStart < 0) {
            return beforeFragment + "?" + parameter + fragment;
        }
        List<String> parameters = new ArrayList<>();
        boolean replaced = false;
        for (String part : beforeFragment.substring(queryStart + 1).split(QUERY_SEPARATOR_PATTERN)) {
            if (part.isEmpty()) {
                continue;
            }
            if (name.equals(StringUtils.substringBefore(part, MAPPING_SEPARATOR))) {
                parameters.add(parameter);
                replaced = true;
            } else {
                parameters.add(part);
            }
        }
        if (!replaced) {
            parameters.add(parameter);
        }
        return beforeFragment.substring(0, queryStart + 1)
                + String.join(ENCODED_QUERY_SEPARATOR, parameters) + fragment;
    }

    private static final class HostRule {

        private final Pattern pattern;
        private final String queryParameter;
        private final String code;

        private HostRule(Pattern pattern, String queryParameter, String code) {
            this.pattern = pattern;
            this.queryParameter = queryParameter;
            this.code = code;
        }

        private static HostRule of(LinkLocalizationRule rule, String locale) {
            String code = codeFor(rule.localeCodes(), locale);
            if (code == null) {
                return null;
            }
            Pattern pattern = EnumUtils.getEnum(Pattern.class, StringUtils.trim(rule.pattern()));
            if (pattern == null) {
                LOG.debug("Ignoring link localization rule for hosts {} with unknown pattern '{}'",
                        Arrays.toString(rule.hosts()), rule.pattern());
                return null;
            }
            String queryParameter = StringUtils.trimToEmpty(rule.queryParameter());
            if (pattern == Pattern.QUERY_PARAMETER && queryParameter.isEmpty()) {
                LOG.debug("Ignoring QUERY_PARAMETER link localization rule for hosts {} without a query parameter",
                        Arrays.toString(rule.hosts()));
                return null;
            }
            return new HostRule(pattern, queryParameter, code);
        }

        private static String codeFor(String[] localeCodes, String locale) {
            for (String mapping : localeCodes) {
                String key = StringUtils.trim(StringUtils.substringBefore(mapping, MAPPING_SEPARATOR));
                String code = StringUtils.trim(StringUtils.substringAfter(mapping, MAPPING_SEPARATOR));
                if (locale.equals(key) && StringUtils.isNotEmpty(code)) {
                    return code;
                }
            }
            return null;
        }
    }
}
