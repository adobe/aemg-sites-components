package com.adobe.guides.aem.components.core.beans;

public class CTABean {

    private String ctaLabel;

    private String ctaLink;

    public CTABean(String ctaLabel, String ctaLink) {
        super();
        this.ctaLabel = ctaLabel;
        this.ctaLink = ctaLink;
    }

    public String getCtaLabel() {
        return ctaLabel;
    }

    public void setCtaLabel(String ctaLabel) {
        this.ctaLabel = ctaLabel;
    }

    public String getCtaLink() {
        return ctaLink;
    }

    public void setCtaLink(String ctaLink) {
        this.ctaLink = ctaLink;
    }
}
