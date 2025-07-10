package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;

@Model(
        adaptables = { Resource.class, SlingHttpServletRequest.class },
        adapters = { FeedbackModel.class, ComponentExporter.class },
        resourceType = FeedbackModel.RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class FeedbackModel implements ComponentExporter {

    public static final String RESOURCE_TYPE = "aemguides/components/guides-components/feedback";

    @ValueMapValue
    private String likeIcon;

    @ValueMapValue
    private String dislikeIcon;

    @ValueMapValue
    private String title;

    public String getLikeIcon() {
        return likeIcon;
    }

    public String getDislikeIcon() {
        return dislikeIcon;
    }

    public String getTitle() {
        return title;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
} 