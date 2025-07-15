package com.adobe.guides.aem.components.core.models;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;

@Model(
        adaptables = { Resource.class, SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class ShareModel {

    private static final Logger logger = LoggerFactory.getLogger(ShareModel.class);

    @ValueMapValue
    private String notificationIcon;

    @ValueMapValue
    private String versionIcon;

    @ValueMapValue
    private String downloadIcon;

    @ValueMapValue
    private String shareIcon;

    @ValueMapValue
    private String themeIcon;

    @ValueMapValue
    private String languageIcon;

    @ValueMapValue
    private String profileIcon;

    @PostConstruct
    protected void init() {

    }

    public String getNotificationIcon() {
        return notificationIcon;
    }

    public String getVersionIcon() {
        return versionIcon;
    }

    public String getDownloadIcon() {
        return downloadIcon;
    }

    public String getShareIcon() {
        return shareIcon;
    }

    public String getThemeIcon() {
        return themeIcon;
    }

    public String getLanguageIcon() {
        return languageIcon;
    }

    public String getProfileIcon() {
        return profileIcon;
    }
}
