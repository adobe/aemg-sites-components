package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.LanguageManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CustomLanguageNavModel {

    @SlingObject
    ResourceResolver resourceResolver;
    Map<String, String> languages = new HashMap<>();

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @PostConstruct
    void init() {
        Resource langRes = resourceResolver.getResource("wcm/core/resources/languages");

        if (Objects.isNull(langRes) || ResourceUtil.isNonExistingResource(langRes)) {
            logger.warn("Language resource should not be null");
            return;
        }

        for (Resource lang : langRes.getChildren()) {
            ValueMap vm = lang.getValueMap();
            String locale = lang.getName();
            String country = vm.get("country", locale);
            String language = vm.get("language", locale);

            if (!"*".equals(country)) {
                String[] localeParts = locale.split("_");
                String countryDisplay = (localeParts.length > 1)
                        ? localeParts[1].toUpperCase()
                        : country;

                language += " (" + countryDisplay + ")";
            }

            languages.put(locale, language);
        }
        logger.info("Total locales found: {}", languages.size());
    }

    public Map<String, String> getLanguages() {
        return languages;
    }

}
