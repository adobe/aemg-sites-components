package com.adobe.guides.aem.components.core.beans;

public class VersionSelectorBean {
    private String title;
    private String pagePath;

    public VersionSelectorBean(String title, String pagePath) {
        this.title = title;
        this.pagePath = pagePath;
    }

    public String getTitle() {
        return title;
    }

    public String getPagePath() {
        return pagePath;
    }
    
    
}
