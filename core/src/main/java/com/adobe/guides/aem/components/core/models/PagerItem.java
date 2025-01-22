package com.adobe.guides.aem.components.core.models;

class PagerItem {
    private String url;
    private String title;
    public String getUrl() {
        return url;
    }
    public String getTitle() {
        return title;
    }
    public PagerItem setUrl(String url) {
        this.url = url;
        return this;
    }
    public PagerItem setTitle(String title) {
        this.title = title;
        return this;
    }
}