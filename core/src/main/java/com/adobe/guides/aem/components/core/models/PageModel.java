package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.utils.LinkUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.List;
import java.util.Objects;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PageModel {

    private static final Logger log = LoggerFactory.getLogger(PageModel.class);

    @ChildResource
    @Named("pageList")
    private List<CTAModel> pageList;

    @PostConstruct
    protected void init() {
        validLink(pageList);
    }

    public List<CTAModel> getPageList() {
        return pageList;
    }

    private void validLink(List<CTAModel> ctas) {
        if (!Objects.isNull(ctas)) {
            for (CTAModel item : ctas) {
                item.setCtaLink(LinkUtils.getVaildLink(item.getCtaLink()));
            }
        }
    }
}
