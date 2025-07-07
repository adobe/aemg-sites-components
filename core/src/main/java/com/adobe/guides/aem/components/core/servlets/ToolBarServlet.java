package com.adobe.guides.aem.components.core.servlets;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.google.gson.JsonObject;
import com.adobe.guides.aem.components.core.constants.CommonConstants;
import com.adobe.guides.aem.components.core.utils.CommonUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.*;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;

@Component(service = Servlet.class, property = {
        ServletResolverConstants.SLING_SERVLET_PATHS + "=/bin/toolbarconfig",
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST,
        ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_GET,
        ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json"
})
public class ToolBarServlet extends SlingAllMethodsServlet {

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String pagePath = request.getParameter("pagePath");
        String toolbarXFPath = request.getParameter(CommonConstants.TOOLBAR_XF_PATH);
        String headerXFPath = request.getParameter(CommonConstants.HEADER_XF_PATH);
        String footerXFPath = request.getParameter(CommonConstants.FOOTER_XF_PATH);
        ResourceResolver resourceResolver = request.getResourceResolver();
        toolbarXFPath = StringUtils.isBlank(toolbarXFPath) ? fetchComponentXFPath(pagePath, resourceResolver,
                path -> CommonUtils.getToolbarPathFromDataNode(path, resourceResolver)) : toolbarXFPath;
        headerXFPath = StringUtils.isBlank(headerXFPath) ? fetchComponentXFPath(pagePath, resourceResolver,
                path -> CommonUtils.getHeaderPathFromDataNode(path, resourceResolver)) : headerXFPath;
        footerXFPath = StringUtils.isBlank(footerXFPath) ? fetchComponentXFPath(pagePath, resourceResolver,
                path -> CommonUtils.getFooterPathFromDataNode(path, resourceResolver)) : footerXFPath;
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty(CommonConstants.TOOLBAR_XF_PATH, toolbarXFPath);
        jsonResponse.addProperty(CommonConstants.HEADER_XF_PATH, headerXFPath);
        jsonResponse.addProperty(CommonConstants.FOOTER_XF_PATH, footerXFPath);

        response.setContentType("application/json");
        response.getWriter().write(jsonResponse.toString());
    }

    private String fetchComponentXFPath(String pagePath, ResourceResolver resourceResolver,
                                        Function<String, String> dataNodePathFunction) {
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        if (pageManager == null) {
            return StringUtils.EMPTY;
        }

        Page page = pageManager.getContainingPage(pagePath);
        if (page == null) {
            return StringUtils.EMPTY;
        }

        if (CommonUtils.isLandingPage(page)) {
            return dataNodePathFunction.apply(pagePath);
        }

        String landingPagePath = CommonUtils.findLandingPage(page);
        return StringUtils.isNotBlank(landingPagePath)
                ? dataNodePathFunction.apply(landingPagePath)
                : StringUtils.EMPTY;
    }


    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {
        try {
            saveToolbarConfig(request);
        } catch (PersistenceException e) {
            response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void saveToolbarConfig(SlingHttpServletRequest request) throws PersistenceException {
        String pagePath = request.getParameter("pagePath");
        String toolbarXFPath = request.getParameter(CommonConstants.TOOLBAR_XF_PATH);
        String headerXFPath = request.getParameter(CommonConstants.HEADER_XF_PATH);
        String footerXFPath = request.getParameter(CommonConstants.FOOTER_XF_PATH);

        if (StringUtils.isBlank(pagePath) || (StringUtils.isBlank(toolbarXFPath) &&
                StringUtils.isBlank(headerXFPath) && StringUtils.isBlank(footerXFPath))) {
            return;
        }

        ResourceResolver resourceResolver = request.getResourceResolver();
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Resource parentResource = resourceResolver.getResource(CommonConstants.GUIDE_DATA_PATH);

        if (parentResource == null || pageManager == null) {
            return;
        }

        String pageName = CommonUtils.getPageName(pagePath);
        Resource pageResource = parentResource.getChild(pageName);

        if (pageResource == null) {
            pageResource = resourceResolver.create(parentResource, pageName, new HashMap<>());
        }

        updateToolbarConfigurations(resourceResolver, pageManager, pageResource, pagePath, toolbarXFPath,
                headerXFPath, footerXFPath);
        resourceResolver.commit();
    }

    private void updateToolbarConfigurations(ResourceResolver resourceResolver, PageManager pageManager,
                                             Resource pageResource, String pagePath, String toolbarXFPath,
                                             String headerXFPath, String footerXFPath) throws PersistenceException {
        Map<String, String> componentMappings = new LinkedHashMap<>();
        componentMappings.put(CommonConstants.TOOLBAR_XF_PATH, toolbarXFPath);
        componentMappings.put(CommonConstants.HEADER_XF_PATH, headerXFPath);
        componentMappings.put(CommonConstants.FOOTER_XF_PATH, footerXFPath);

        for (Map.Entry<String, String> entry : componentMappings.entrySet()) {
            if (StringUtils.isNotBlank(entry.getValue())) {
                updateToolbarConfig(resourceResolver, pageManager, pageResource, pagePath, entry);
            }
        }
    }

    private void updateToolbarConfig(ResourceResolver resourceResolver, PageManager pageManager,
                                     Resource pageResource, String pagePath, Map.Entry<String, String> entry)
            throws PersistenceException {
        Page page = pageManager.getContainingPage(pagePath);
        if (page == null) {
            return;
        }

        Resource contentResource = page.getContentResource();
        if (contentResource == null) {
            return;
        }

        ValueMap pageValueMap = contentResource.getValueMap();
        String baseline = pageValueMap.get("baseline", String.class);

        if (StringUtils.isNotBlank(baseline)) {
            Resource baselineResource = pageResource.getChild(baseline);
            if (baselineResource != null) {
                ModifiableValueMap baseLineValueMap = baselineResource.adaptTo(ModifiableValueMap.class);
                if (baseLineValueMap != null) {
                    baseLineValueMap.put(entry.getKey(), entry.getValue());
                }
            } else {
                resourceResolver.create(pageResource, baseline, Collections.singletonMap(entry.getKey(),
                        entry.getValue()));
            }
        } else {
            ModifiableValueMap valueMap = pageResource.adaptTo(ModifiableValueMap.class);
            if (valueMap != null) {
                valueMap.put(entry.getKey(), entry.getValue());
            }
        }
    }

}
