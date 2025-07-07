package com.adobe.guides.aem.components.core.models;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.HashMap;
import java.util.Map;

@Model(adaptables = { Resource.class, SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TopicModel {

    private static final Logger logger = LoggerFactory.getLogger(TopicModel.class);

    @Inject
    private ValueMap properties;

    private String cssClass;

    private String id;

    private Map<String, String> localizationAttributes = new HashMap<>();


    @PostConstruct
    protected void init() {
        this.cssClass = properties.get("class", "");
        this.id = properties.get("id", null);
        this.localizationAttributes = initializeLocalizationAttributes(properties);
    }

    public String getCssClass() {
        return cssClass;
    }

    public String getId() {
        return id;
    }

    public Map<String, String> getLocalizationAttributes() {
        return localizationAttributes;
    }

    private Map<String, String> initializeLocalizationAttributes(ValueMap properties) {
        Map<String, String> attributes = new HashMap<>();
        String xmlLang = properties.get("xml:lang", String.class);
        String dir = properties.get("dir", String.class);

        if (xmlLang != null) {
            attributes.put("lang", xmlLang);
        }
        if (dir != null) {
            attributes.put("dir", dir);
        }

        return attributes;
    }
}
