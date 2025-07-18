package com.adobe.guides.aem.components.core.models;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.NameConstants;
import java.util.Locale;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

@Model(
        adaptables = { Resource.class, SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class BannerModel {

    private static final Logger logger = LoggerFactory.getLogger(BannerModel.class);
    
    @Inject
    @ScriptVariable
    private Page currentPage;
    
    @Inject
    @Self
    private Resource resource;
    
    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @ValueMapValue
    private String bannerImage;

    @ValueMapValue
    private String ctaLabel;

    @ValueMapValue
    private String ctaLink;    

    @PostConstruct
    protected void init() {
        if(currentPage == null) {return;}
        if(title != null && !title.isEmpty() && description != null && !description.isEmpty()) { return;}
        Resource bannerResource = getBannerResource(currentPage.getParent());
        if(bannerResource == null) {
            bannerResource = getBannerResource(currentPage.getParent().getParent());
        }
        if(bannerResource == null) {return;}
        
        ValueMap attributes = bannerResource.getValueMap();
        if(title == null || title.isEmpty()) {
            title = attributes.get("title", String.class);            
        }
        if(description == null || description.isEmpty()) {
            description = attributes.get("description", String.class);
        }
        if(ctaLabel == null || ctaLabel.isEmpty()) {
            ctaLabel = attributes.get("ctaLabel", String.class);
        }
        if(ctaLink == null || ctaLink.isEmpty()) {
            ctaLink = attributes.get("ctaLink", String.class);
        }
        if(bannerImage == null || bannerImage.isEmpty()) {
            bannerImage = attributes.get("bannerImage", String.class);
        }
    }
    
    private Resource getBannerResource(Page page) {
        Resource parentContentResource = page.getContentResource();
        if(parentContentResource == null) {return null;}
        Resource bannerResource = parentContentResource.getChild("root/container/banner");
        if(bannerResource == null) {return null;}
        return bannerResource;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getBannerImage() {
        return bannerImage;
    }

    public String getCtaLabel() {
        return ctaLabel;
    }

    public String getCtaLink() {
        return ctaLink;
    }
}
