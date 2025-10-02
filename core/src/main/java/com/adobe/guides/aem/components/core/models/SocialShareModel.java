package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.constants.CommonConstants;
import com.adobe.guides.aem.components.core.utils.CommonUtils;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SocialShareModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(SocialShareModel.class);

    // CHANGED: use a service resolver via ResourceResolverFactory
    @OSGiService
    private ResourceResolverFactory resourceResolverFactory;

    @Inject
    String[] social;

    public List<Map<String, String>> getSocialShareMap() {
        List<Map<String, String>> jsonObjectList = new ArrayList<>();
        ResourceResolver resolver = null;

        try {
            resolver = CommonUtils.getResourceResolver(resourceResolverFactory);

            Resource resource = resolver.getResource(CommonConstants.SOCIAL_JSON_PATH);
            if (resource == null) {
                LOGGER.warn("Resource not found at path: {}", CommonConstants.SOCIAL_JSON_PATH);
                return jsonObjectList; // Return empty list if resource not found
            }

            try (InputStream inputStream = resource.adaptTo(InputStream.class)) {
                if (inputStream != null) {
                    String jsonString = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
                    JsonObject jsonObject = new JsonParser().parse(jsonString).getAsJsonObject();

                    for (String key : social) { // Ensure 'social' list is available in the context
                        if (jsonObject.has(key)) { // Check if the key exists
                            JsonObject socialObj = jsonObject.get(key).getAsJsonObject();
                            Map<String, String> stringMap = Map.of(
                                    "title", socialObj.get("title").getAsString(),
                                    "icon", socialObj.get("icon").getAsString(),
                                    "url", socialObj.get("url").getAsString()
                            );
                            jsonObjectList.add(stringMap);
                        } else {
                            LOGGER.warn("Key '{}' not found in JSON object at path: {}", key, CommonConstants.SOCIAL_JSON_PATH);
                        }
                    }
                } else {
                    LOGGER.error("Failed to adapt resource to InputStream at path: {}", CommonConstants.SOCIAL_JSON_PATH);
                }
            } catch (IOException e) {
                LOGGER.error("IO error while reading JSON file at path: {}", CommonConstants.SOCIAL_JSON_PATH, e);
            } catch (JsonSyntaxException e) {
                LOGGER.error("Malformed JSON content at path: {}", CommonConstants.SOCIAL_JSON_PATH, e);
            }

        } catch (LoginException e) {
            LOGGER.error("Unable to obtain service ResourceResolver for SocialShareModel", e);
        } finally {
            if (resolver != null && resolver.isLive()) {
                resolver.close();
            }
        }

        return jsonObjectList;
    }
}
