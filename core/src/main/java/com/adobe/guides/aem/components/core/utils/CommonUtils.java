package com.adobe.guides.aem.components.core.utils;

import com.adobe.guides.aem.components.core.constants.CommonConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.*;

import java.util.HashMap;
import java.util.Map;

public class CommonUtils {
    public static String getPageName(String pagePath) {
        return pagePath.substring(pagePath.lastIndexOf("/") + 1);
    }

    public static String findLandingPage(Page page) {
        String basePath = page.getProperties().get("basePath", String.class);
        return StringUtils.isNotBlank(basePath) ? basePath : StringUtils.EMPTY;
    }

    public static String getComponentPathFromDataNode(String pagePath, ResourceResolver resourceResolver, String componentPathKey) {
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        if (pageManager == null) {
            return StringUtils.EMPTY;
        }

        Page page = pageManager.getContainingPage(pagePath);
        if (page == null) {
            return StringUtils.EMPTY;
        }

        Resource contentResource = page.getContentResource();
        if (contentResource == null) {
            return StringUtils.EMPTY;
        }

        ValueMap valueMap = contentResource.getValueMap();
        String baseline = valueMap.get(CommonConstants.BASELINE, String.class);
        Resource parentResource = resourceResolver.getResource(CommonConstants.GUIDE_DATA_PATH);

        if (parentResource == null) {
            return StringUtils.EMPTY;
        }

        Resource pageResource = parentResource.getChild(getPageName(pagePath));
        if (pageResource == null) {
            return StringUtils.EMPTY;
        }

        if (StringUtils.isNotBlank(baseline)) {
            Resource baselineResource = pageResource.getChild(baseline);
            if (baselineResource != null) {
                return baselineResource.getValueMap().get(componentPathKey, String.class);
            }
        }

        return pageResource.getValueMap().get(componentPathKey, String.class);
    }

    public static String getToolbarPathFromDataNode(String pagePath, ResourceResolver resourceResolver) {
        return getComponentPathFromDataNode(pagePath, resourceResolver, CommonConstants.TOOLBAR_XF_PATH);
    }

    public static String getHeaderPathFromDataNode(String pagePath, ResourceResolver resourceResolver) {
        return getComponentPathFromDataNode(pagePath, resourceResolver, CommonConstants.HEADER_XF_PATH);
    }

    public static String getFooterPathFromDataNode(String pagePath, ResourceResolver resourceResolver) {
        return getComponentPathFromDataNode(pagePath, resourceResolver, CommonConstants.FOOTER_XF_PATH);
    }


    public static boolean isLandingPage(Page page) {
        String basePath = page.getProperties().get("basePath", String.class);
        return StringUtils.isNotBlank(basePath) && basePath.equals(page.getPath());
    }

    public static ResourceResolver getResourceResolver(ResourceResolverFactory resourceResolverFactory) throws LoginException {
        final Map<String, Object> serviceParams = new HashMap<>();
        serviceParams.put(ResourceResolverFactory.SUBSERVICE, CommonConstants.WRITABLE_SUB_SERVICE_NAME);
        return resourceResolverFactory.getServiceResourceResolver(serviceParams);

    }
}
