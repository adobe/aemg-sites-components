/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

 package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.*;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;
import org.osgi.service.cm.Configuration;
import org.osgi.service.cm.ConfigurationAdmin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import java.io.IOException;
import java.util.Dictionary;

import static org.apache.sling.api.resource.ResourceResolver.PROPERTY_RESOURCE_TYPE;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = {Feedback.class, ComponentExporter.class},
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class FeedbackImpl extends AbstractComponentImpl implements Feedback {

    @ValueMapValue(name=PROPERTY_RESOURCE_TYPE, injectionStrategy= InjectionStrategy.OPTIONAL)
    @Default(values="No resourceType")
    protected String resourceType;

    private final String ANALYTICS_OSGI_CONFIG_PID = "com.adobe.guides.analytics.config.service.AnalyticsConfigImpl";

    private static final Logger LOGGER = LoggerFactory.getLogger(FeedbackImpl.class);

    @Inject
    private ConfigurationAdmin configAdmin;

    @SlingObject
    private Resource currentResource;
    @SlingObject
    private ResourceResolver resourceResolver;

    @Inject
    private String promptText;
    @Inject
    @Default(values="Submit")
    private String submitBtnText;
    private String message;
    String serviceAccountClientId;
    String serviceAccountClientSecret;
    String serviceAccountScope;
    private String imsUrl;

    @PostConstruct
    protected void init() {
        try {
            /*Configuration config = configAdmin.getConfiguration("com.adobe.guides.analytics.config.service.AnalyticsConfigImpl");
            Dictionary<String, Object> properties =  config.getProperties();
            serviceAccountClientId = properties.get("service.account.oauth.client.id").toString();
            serviceAccountClientSecret = properties.get("service.account.oauth.client.secret").toString();
            serviceAccountScope = properties.get("service.account.oauth.scope").toString();
            imsUrl = properties.get("ims.url").toString();*/

        } catch (Exception e) {
            LOGGER.error("Error in Feedback model init => ", e);
        }
    }

    @Override
    public String getPromptText() {
        return promptText;
    }
    @Override
    public String getSubmitBtnText() {
        return submitBtnText;
    }

    public String getAccessToken(String clientId, String clientSecret, String scope) {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(imsUrl+ "/ims/token/v3");
            post.addHeader("Content-Type", "application/x-www-form-urlencoded");

            StringEntity entity = new StringEntity("grant_type=client_credentials" +
                    "&client_id=" + clientId +
                    "&client_secret=" + clientSecret +
                    "&scope=" + scope);
            post.setEntity(entity);

            try (CloseableHttpResponse response = client.execute(post)) {
                String jsonResponse = EntityUtils.toString(response.getEntity());
                JSONObject jsonObject = new JSONObject(jsonResponse);
                return jsonObject.getString("access_token");
            }
            catch (Exception e){
                LOGGER.error("Error in getting access token", e);
            }
        }
        catch (Exception e){
            LOGGER.error("Exception occurred", e);
        }
        return null;
    }
}