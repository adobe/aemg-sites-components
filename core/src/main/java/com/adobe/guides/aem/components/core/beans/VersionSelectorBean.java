package com.adobe.guides.aem.components.core.beans;

public class VersionSelectorBean {
    private String name;
    private String title;
    private String pagePath;

    public VersionSelectorBean(String name, String title, String pagePath) {
        this.name = name;
        this.title = title;
        this.pagePath = pagePath;
    }

    public String getName() {
        return this.name;
    }
    
    public String getTitle() {
        return title;
    }

    public String getPagePath() {
        return pagePath;
    }
    
    
}
