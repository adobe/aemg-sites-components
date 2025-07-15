package com.adobe.guides.aem.components.core.services.impl;

import com.adobe.guides.aem.components.core.services.TagMangerService;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@Component(service = TagMangerService.class, immediate = true)
@Designate(ocd = TagManagerServiceImpl.Config.class)
public class TagManagerServiceImpl implements TagMangerService {

    String GTMID;
    String adobeLaunchUrl;

    @Activate
    @Modified
    void init(TagManagerServiceImpl.Config config) {
        this.GTMID = config.GTMID();
        this.adobeLaunchUrl = config.adobeLaunchUrl();
    }

    @Override
    public String getGTMID() {
        return this.GTMID;
    }

    @Override
    public String getAdobeLaunchUrl() {
        return this.adobeLaunchUrl;
    }


    @ObjectClassDefinition(name = "Tag Manager Config")
    @interface Config {
        @AttributeDefinition(name = "GTMID", description = "GTMID for Google Tag Manager integration")
        String GTMID() default StringUtils.EMPTY;

        @AttributeDefinition(name = "Adobe Launch Url", description = "Adobe Launch Url for Adobe launch integration.")
        String adobeLaunchUrl() default StringUtils.EMPTY;
    }
}
