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
        adapters = { AccessibilityModel.class, ComponentExporter.class },
        resourceType = AccessibilityModel.RESOURCE_TYPE,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class AccessibilityModel implements ComponentExporter {

    public static final String RESOURCE_TYPE = "guides-components/components/accessibility";

    @ValueMapValue
    private String accessibilityIcon;

    @ValueMapValue
    private String textSizeIcon;

    @ValueMapValue
    private String textSpaceIcon;

    @ValueMapValue
    private String highContrastIcon;

    @ValueMapValue
    private String lowContrastIcon;

    @ValueMapValue
    private String resetIcon;

    public String getAccessibilityIcon() {
        return accessibilityIcon;
    }

    public String getTextSizeIcon() {
        return textSizeIcon;
    }

    public String getTextSpaceIcon() {
        return textSpaceIcon;
    }

    public String getHighContrastIcon() {
        return highContrastIcon;
    }

    public String getLowContrastIcon() {
        return lowContrastIcon;
    }

    public String getResetIcon() {
        return resetIcon;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
} 