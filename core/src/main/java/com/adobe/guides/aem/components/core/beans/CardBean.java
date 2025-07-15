package com.adobe.guides.aem.components.core.beans;

public class CardBean {

    private String cardImage;

    private String title;

    private String description;

    private String ctaLabel;

    private String ctaLink;

    public CardBean(String cardImage, String title, String description, String ctaLabel, String ctaLink) {
        super();
        this.cardImage = cardImage;
        this.title = title;
        this.description = description;
        this.ctaLabel = ctaLabel;
        this.ctaLink = ctaLink;
    }

    public String getCardImage() {
        return cardImage;
    }

    public void setCardImage(String cardImage) {
        this.cardImage = cardImage;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
