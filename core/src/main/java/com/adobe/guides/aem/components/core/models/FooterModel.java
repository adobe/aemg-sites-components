package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.utils.LinkUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.List;
import java.util.Objects;

@Model(
        adaptables = { Resource.class, SlingHttpServletRequest.class },
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class FooterModel {

    private static final Logger logger = LoggerFactory.getLogger(FooterModel.class);

    @ValueMapValue
    private String lightLogo;

    @ValueMapValue
    private String darkLogo;

    @ValueMapValue
    private String logoLink;

    @ValueMapValue
    private String socialLinksTitle;

    @ValueMapValue
    private String contactLinksTitle;

    @ValueMapValue
    private String companyLinksTitle;

    @ValueMapValue
    private String pageLinksTitle;

    @ChildResource
    @Named("socialList")
    private List<CTAModel> socialList;

    @ChildResource
    @Named("contactList")
    private List<CTAModel> contactList;

    @ChildResource
    @Named("legalList")
    private List<CTAModel> legalList;

    @ChildResource
    @Named("companyList")
    private List<CTAModel> companyList;

    @ChildResource
    @Named("pagesList")
    private List<PageModel> pagesList;

    @PostConstruct
    protected void init() {
        logoLink = LinkUtils.getVaildLink(logoLink);
        validLink(socialList);
        validLink(contactList);
        validLink(legalList);
        validLink(companyList);
    }

    private void validLink(List<CTAModel> ctas) {
        if (!Objects.isNull(ctas)) {
            for (CTAModel item : ctas) {
                item.setCtaLink(LinkUtils.getVaildLink(item.getCtaLink()));
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

    public String getSocialLinksTitle() {
        return socialLinksTitle;
    }

    public String getContactLinksTitle() {
        return contactLinksTitle;
    }

    public String getCompanyLinksTitle() {
        return companyLinksTitle;
    }

    public String getPageLinksTitle() {
        return pageLinksTitle;
    }

    public List<CTAModel> getSocialList() {
        return socialList;
    }

    public List<CTAModel> getContactList() {
        return contactList;
    }

    public List<CTAModel> getLegalList() {
        return legalList;
    }

    public List<CTAModel> getCompanyList() {
        return companyList;
    }

    public List<PageModel> getPagesList() {
        return pagesList;
    }
}
