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
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.commons.codec.CharEncoding;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

@Model(adaptables = SlingHttpServletRequest.class,
       adapters = { ChildRedirect.class, ComponentExporter.class },
       resourceType = ChildRedirectImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)

public class ChildRedirectImpl extends AbstractComponentImpl implements ChildRedirect {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChildRedirectImpl.class);

    protected static final String RESOURCE_TYPE = "guides-components/components/childredirect";
    protected static final String JCR_CONTENT = "jcr:content";
    protected static final String SLASH_SEPARATOR = "/";

    @SlingObject
    private SlingHttpServletResponse response;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    protected com.day.cq.wcm.api.Page currentPage;

    @Self
    private SlingHttpServletRequest request;

    private String redirectUrl;

    @PostConstruct
    protected void initModel() throws RepositoryException, JSONException, IOException {
        String sitePath = currentPage.getContentResource().getValueMap().get("sitePath", String.class);
        Session session = request.getResourceResolver().adaptTo(Session.class);
        String categoryPath = Utils.getCategoryPathFromPage(currentPage);
        Node node = session.getNode(sitePath + SLASH_SEPARATOR + JCR_CONTENT);
        Binary tocBinary = node.getProperty("guides-navigation").getBinary();
        String tocBinaryString = IOUtils.toString(tocBinary.getStream(), CharEncoding.UTF_8);
        String allowedPagesStr = Utils.getPagesAsJson(session, categoryPath);
        JSONObject toc = new JSONObject(tocBinaryString);
        Utils.updateVisibility(toc, new JSONObject(allowedPagesStr), categoryPath);
        toc.put("visible", true);
        ArrayList<PagerItem> flat = new ArrayList<>();
        flattenToc(toc, categoryPath, flat);
        LOGGER.info("Pager: flatten toc {}", flat);
        redirectUrl = flat.get(0).getUrl();
    }

    @PostConstruct
    private void activate() throws RepositoryException, JSONException, IOException {
        String sitePath = currentPage.getContentResource().getValueMap().get("sitePath", String.class);
        Session session = request.getResourceResolver().adaptTo(Session.class);
        String categoryPath = Utils.getCategoryPathFromPage(currentPage);
        Node node = session.getNode(sitePath + SLASH_SEPARATOR + JCR_CONTENT);
        Binary tocBinary = node.getProperty("guides-navigation").getBinary();
        String tocBinaryString = IOUtils.toString(tocBinary.getStream(), CharEncoding.UTF_8);
        String allowedPagesStr = Utils.getPagesAsJson(session, categoryPath);
        JSONObject toc = new JSONObject(tocBinaryString);
        Utils.updateVisibility(toc, new JSONObject(allowedPagesStr), categoryPath);
        toc.put("visible", true);
        ArrayList<PagerItem> flat = new ArrayList<>();
        flattenToc(toc, categoryPath, flat);
        LOGGER.info("Pager: flatten toc {}", flat);
        redirectUrl = flat.get(0).getUrl();
        if (redirectUrl != null) {
            LOGGER.info("Redirecting ({}) to {}", 301, redirectUrl);
            response.sendRedirect(categoryPath + redirectUrl);
        }
    }

    public void flattenToc(JSONObject toc, String categoryPath, ArrayList<PagerItem> collector) throws JSONException {
        boolean isVisible =  (toc.has("visible") && toc.get("visible").equals(true));
        boolean hasDisplayName =  toc.has("displayName");
        if (toc.has("outputPath") && isVisible && hasDisplayName) {
            String outputPath = toc.getString("outputPath");
            String fullPath = Paths.get(categoryPath, outputPath).normalize().toString();
            PagerItem item = new PagerItem()
                    .setTitle(toc.get("displayName").toString())
                    .setUrl(outputPath);
            collector.add(item);
        }
        if (toc.has("children") && isVisible) {
            JSONArray children = toc.getJSONArray("children");
            for (int i = 0; i < children.length(); i++) {
                flattenToc(children.getJSONObject(i), categoryPath, collector);
            }
        }
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    public String getRedirectUrl() {
        return redirectUrl;
    }
}
