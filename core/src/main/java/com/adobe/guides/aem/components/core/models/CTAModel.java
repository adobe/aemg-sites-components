package com.adobe.guides.aem.components.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CTAModel {

    private static final Logger log = LoggerFactory.getLogger(CTAModel.class);

    @ValueMapValue
    private String ctaLabel;

    @ValueMapValue
    private String ctaLink;

    @ValueMapValue
    private String ctaIcon;

    public void setCtaLink(String ctaLink) {
        this.ctaLink = ctaLink;
    }

    public String getCtaLabel() {
        return ctaLabel;
    }

    public String getCtaLink() {
        return ctaLink;
    }

    public String getCtaIcon() {
        return ctaIcon;
    }
}
