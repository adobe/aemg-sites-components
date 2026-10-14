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

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import javax.annotation.PostConstruct;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {TocList.class, ComponentExporter.class}, resourceType = {TocListImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TocListImpl extends AbstractComponentImpl implements TocList {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/toclist";
    static final String SITE_PATH_PROPERTY = "sitePath";
    static final String GUIDES_NAVIGATION_PROPERTY = "guides-navigation";
    static final String THUMBNAIL_SUFFIX = ".thumb.480.300.png";
    private static final String EMPTY_JSON_ARRAY = "[]";
    private static final Logger logger = LoggerFactory.getLogger(TocListImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private Page currentPage;

    private String tocList = EMPTY_JSON_ARRAY;

    @PostConstruct
    private void initModel() {
        String tocJson = readGuidesNavigation();
        if (tocJson != null) {
            tocList = buildTopLevelTocList(tocJson);
        }
    }

    private String readGuidesNavigation() {
        if (currentPage == null || currentPage.getContentResource() == null) {
            logger.warn("TOC List: current page or its content resource is not available.");
            return null;
        }
        String sitePath = currentPage.getContentResource().getValueMap().get(SITE_PATH_PROPERTY, String.class);
        if (StringUtils.isBlank(sitePath)) {
            logger.warn("TOC List: no '{}' property found on {}", SITE_PATH_PROPERTY, currentPage.getPath());
            return null;
        }
        Session session = request.getResourceResolver().adaptTo(Session.class);
        if (session == null) {
            logger.error("TOC List: unable to obtain JCR session.");
            return null;
        }
        String nodePath = sitePath + "/jcr:content";
        try {
            if (!session.nodeExists(nodePath)) {
                logger.warn("TOC List: node {} does not exist.", nodePath);
                return null;
            }
            Node node = session.getNode(nodePath);
            if (!node.hasProperty(GUIDES_NAVIGATION_PROPERTY)) {
                logger.warn("TOC List: property '{}' not found on {}", GUIDES_NAVIGATION_PROPERTY, nodePath);
                return null;
            }
            Binary tocBinary = node.getProperty(GUIDES_NAVIGATION_PROPERTY).getBinary();
            try (InputStream stream = tocBinary.getStream()) {
                return IOUtils.toString(stream, StandardCharsets.UTF_8);
            } finally {
                tocBinary.dispose();
            }
        } catch (RepositoryException | IOException e) {
            logger.error("TOC List: unable to read '{}' from {}", GUIDES_NAVIGATION_PROPERTY, nodePath, e);
            return null;
        }
    }

    /**
     * Builds a JSON array of the visible root-level TOC entries; nested children are not included.
     */
    static String buildTopLevelTocList(final String tocJson) {
        JSONArray result = new JSONArray();
        try {
            JSONArray children = new JSONObject(tocJson).optJSONArray("children");
            if (children == null) {
                return EMPTY_JSON_ARRAY;
            }
            for (int i = 0; i < children.length(); i++) {
                JSONObject entry = children.optJSONObject(i);
                if (entry == null || !entry.optBoolean("visible", true)) {
                    continue;
                }
                String path = entry.optString("outputPath", "");
                JSONObject item = new JSONObject();
                item.put("title", entry.optString("displayName", ""));
                item.put("path", path);
                item.put("thumbnail", path + THUMBNAIL_SUFFIX);
                item.put("active", entry.optBoolean("active", true));
                result.put(item);
            }
        } catch (JSONException e) {
            logger.error("TOC List: unable to parse '{}' JSON.", GUIDES_NAVIGATION_PROPERTY, e);
            return EMPTY_JSON_ARRAY;
        }
        return result.toString();
    }

    @Override
    public String getTocList() {
        return tocList;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }
}
