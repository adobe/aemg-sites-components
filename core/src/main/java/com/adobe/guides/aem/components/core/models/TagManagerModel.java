package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.services.TagMangerService;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;

import javax.annotation.PostConstruct;

@Model(adaptables = Resource.class,
       adapters = {TagManagerModel.class, ComponentExporter.class},
       resourceType = TagManagerModel.RESOURCE_TYPE,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TagManagerModel implements ComponentExporter {

    public static final String RESOURCE_TYPE = "aemguides/components/guides-components/tagmanager";

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

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}
