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
        adapters = { CopyLinkComponentModel.class, ComponentExporter.class },
        resourceType = CopyLinkComponentModel.RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CopyLinkComponentModel implements ComponentExporter {

    public static final String RESOURCE_TYPE = "guides-components/components/copy-link";

    @ValueMapValue
    private String copyLinkIcon;

    public String getCopyLinkIcon() {
        return copyLinkIcon;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
} 