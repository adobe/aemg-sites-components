package com.adobe.guides.aem.components.core.servlets;

import com.adobe.guides.aem.components.core.utils.CommonUtils;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.adobe.guides.aem.components.core.constants.CommonConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.*;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.api.wrappers.ValueMapDecorator;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component(service = {Servlet.class},
        property = {
                "sling.servlet.paths=/bin/socialDataDropdown",
                "sling.servlet.methods = GET"
        })
public class SocialShareServlet extends SlingSafeMethodsServlet {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocialShareServlet.class);

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        try {
            populateDropdown(request);
        } catch (LoginException e) {
            throw new RuntimeException(e);
        }
    }

    public void populateDropdown(SlingHttpServletRequest request) throws LoginException {
        ResourceResolver resourceResolver = CommonUtils.getResourceResolver(resourceResolverFactory);
        List<Resource> resourceList = new ArrayList<>();
        Resource jsonResource = resourceResolver.getResource(CommonConstants.SOCIAL_JSON_PATH);

        if (jsonResource == null) {
            LOGGER.warn("Resource not found at path: {}", CommonConstants.SOCIAL_JSON_PATH);
            return;
        }

        try (InputStream inputStream = jsonResource.adaptTo(InputStream.class)) {
            if (inputStream != null) {
                String jsonString = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();

                jsonObject.keySet().forEach(key -> {
                    JsonObject socialNetwork = jsonObject.getAsJsonObject(key);

                    Map<String, Object> valueMap = new HashMap<>();
                    valueMap.put("value", key);
                    valueMap.put("text", socialNetwork.get("title").getAsString());

                    Resource resource = new ValueMapResource(
                            resourceResolver,
                            new ResourceMetadata(),
                            "nt:unstructured",
                            new ValueMapDecorator(valueMap)
                    );
                    resourceList.add(resource);
                });

                // Create a DataSource to populate the drop-down control
                request.setAttribute(DataSource.class.getName(), new SimpleDataSource(resourceList.iterator()));
            } else {
                LOGGER.error("Failed to adapt resource to InputStream at path: {}", CommonConstants.SOCIAL_JSON_PATH);
            }
        } catch (IOException e) {
            LOGGER.error("Error reading JSON data from path: {}", CommonConstants.SOCIAL_JSON_PATH, e);
        }
    }
}
