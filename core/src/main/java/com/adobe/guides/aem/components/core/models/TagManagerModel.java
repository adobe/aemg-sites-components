package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.services.TagMangerService;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TagManagerModel {

    @OSGiService
    TagMangerService tagMangerService;

    String GTMID;
    String abodeLaunchUrl;

    @PostConstruct
    void init() {
        this.GTMID = tagMangerService.getGTMID();
        this.abodeLaunchUrl = tagMangerService.getAdobeLaunchUrl();
    }

    public String getGTMID() {
        return GTMID;
    }

    public String getAbodeLaunchUrl() {
        return abodeLaunchUrl;
    }

    
}
