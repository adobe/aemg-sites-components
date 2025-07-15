package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.beans.CTABean;
import com.adobe.guides.aem.components.core.utils.LinkUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(
        adaptables = { Resource.class, SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class HeaderModel {

    private static final Logger logger = LoggerFactory.getLogger(HeaderModel.class);

    @ValueMapValue
    private String lightLogo;

    @ValueMapValue
    private String darkLogo;

    @ValueMapValue
    private String logoLink;

    @ValueMapValue
    private String searchIcon;

    @ValueMapValue
    private String placeholderText;

    @ChildResource
    private List<Resource> ctaList;

    private List<CTABean> ctaBeanList = new ArrayList<>();

    @PostConstruct
    protected void init() {
        if (logoLink != null) {
            logoLink = LinkUtils.getVaildLink(logoLink);
        }
        if (ctaList != null) {
            for (Resource itemResource : ctaList) {
                ValueMap valueMap = itemResource.getValueMap();
                String ctaLabel = valueMap.get("ctaLabel", String.class);
                String ctaLink = valueMap.get("ctaLink", String.class);
                ctaLink = LinkUtils.getVaildLink(ctaLink);
                if (ctaLabel != null) {
                    CTABean ctaBean = new CTABean(ctaLabel, ctaLink);
                    ctaBeanList.add(ctaBean);
                }
            }
        }
    }

    public String getLightLogo() {
        return lightLogo;
    }

    public String getDarkLogo() {
        return darkLogo;
    }

    public String getLogoLink() {
        return logoLink;
    }

    public String getSearchIcon() {
        return searchIcon;
    }

    public String getPlaceholderText() {
        return placeholderText;
    }

    public List<CTABean> getCtaBeanList() {
        return ctaBeanList;
    }
}
