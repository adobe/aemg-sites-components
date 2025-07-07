package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.xf.ExperienceFragmentsConstants;
import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.jcr.JcrConstants;
import com.day.cq.wcm.api.Page;
import com.adobe.guides.aem.components.core.constants.CommonConstants;
import com.adobe.guides.aem.components.core.utils.CommonUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import java.util.function.Function;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ComponentConfigModel {

    @SlingObject
    ResourceResolver resourceResolver;

    @ScriptVariable
    Page currentPage;

    public ValueMap toolbarConfig() {
        Resource contentResource = currentPage.getContentResource();
        String superType = resourceResolver.getParentResourceType(contentResource);
        if (!ExperienceFragmentsConstants.RT_EXPERIENCE_FRAGMENT_PAGE.equals(superType)) {
            String toolbarResourcePath = toolbarXFPath();
            contentResource = resourceResolver.getResource(toolbarResourcePath + "/" + JcrConstants.JCR_CONTENT);
        }
        Resource toolbarResource = contentResource.getChild("toolbar");
        return toolbarResource.getValueMap();
    }

    public String toolbarXFPath() {
        return getComponentXFPath(CommonConstants.TOOLBAR_XF_PATH, path -> CommonUtils.getToolbarPathFromDataNode(path, resourceResolver));
    }

    public String headerXFPath() {
        return getComponentXFPath(CommonConstants.HEADER_XF_PATH, path -> CommonUtils.getHeaderPathFromDataNode(path, resourceResolver));
    }

    public String footerXFPath() {
        return getComponentXFPath(CommonConstants.FOOTER_XF_PATH, path -> CommonUtils.getFooterPathFromDataNode(path, resourceResolver));
    }

    private String getComponentXFPath(String componentPathKey, Function<String, String> dataNodePathFunction) {
        Resource pageResource = currentPage.getContentResource();
        HierarchyNodeInheritanceValueMap pageProperties = new HierarchyNodeInheritanceValueMap(pageResource);
        String componentXFPath = pageProperties.getInherited(componentPathKey, String.class);
        if (StringUtils.isBlank(componentXFPath)) {
            if (CommonUtils.isLandingPage(currentPage)) {
                return dataNodePathFunction.apply(currentPage.getPath());
            }
            String landingPagePath = CommonUtils.findLandingPage(currentPage);
            componentXFPath = StringUtils.isNotBlank(landingPagePath)
                    ? dataNodePathFunction.apply(landingPagePath)
                    : StringUtils.EMPTY;
        }
        return componentXFPath;
    }

    
}
