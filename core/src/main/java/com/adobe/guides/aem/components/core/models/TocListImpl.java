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
import java.nio.file.Paths;
import java.util.function.UnaryOperator;

import javax.annotation.PostConstruct;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import javax.jcr.Session;

import org.apache.commons.io.FilenameUtils;
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
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {TocList.class, ComponentExporter.class}, resourceType = {TocListImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class TocListImpl extends AbstractComponentImpl implements TocList {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/toclist";
    static final String SITE_PATH_PROPERTY = "sitePath";
    static final String GUIDES_NAVIGATION_PROPERTY = "guides-navigation";
    static final String THUMBNAIL_SUFFIX = ".thumb.480.300.png";
    private static final String HTML_EXTENSION = ".html";
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
            PageManager pageManager = request.getResourceResolver().adaptTo(PageManager.class);
            tocList = buildTopLevelTocList(tocJson, Utils.getCategoryPathFromPage(currentPage),
                    pagePath -> getPageTitle(pageManager, pagePath));
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
     * Returns the page title (falling back to the page name), as Category List does, or null if no page exists.
     */
    private static String getPageTitle(final PageManager pageManager, final String pagePath) {
        Page page = pageManager != null ? pageManager.getPage(pagePath) : null;
        if (page == null) {
            return null;
        }
        return StringUtils.isNotBlank(page.getTitle()) ? page.getTitle() : page.getName();
    }

    static String buildTopLevelTocList(final String tocJson, final String basePath) {
        return buildTopLevelTocList(tocJson, basePath, pagePath -> null);
    }

    /**
     * Builds a JSON array of the visible root-level TOC entries; nested children are not included.
     * TOC output paths are relative to the category page, so they are resolved against {@code basePath}.
     * The title comes from the resolved page (via {@code pageTitleResolver}) when available, otherwise
     * from the TOC display name.
     */
    static String buildTopLevelTocList(final String tocJson, final String basePath,
                                       final UnaryOperator<String> pageTitleResolver) {
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
                String outputPath = entry.optString("outputPath", "");
                JSONObject item = new JSONObject();
                String title = entry.optString("displayName", "");
                if (StringUtils.isBlank(outputPath)) {
                    item.put("url", "");
                    item.put("thumbnail", "");
                } else if (isExternalUrl(outputPath)) {
                    item.put("url", outputPath);
                    item.put("thumbnail", "");
                } else {
                    String url = resolvePath(outputPath, basePath);
                    String pagePath = removeExtension(Utils.filePath(url));
                    if (pagePath.equals(Utils.filePath(url))) {
                        url = pagePath + HTML_EXTENSION + url.substring(pagePath.length());
                    }
                    item.put("url", url);
                    item.put("thumbnail", pagePath + THUMBNAIL_SUFFIX);
                    String pageTitle = pageTitleResolver.apply(pagePath);
                    if (StringUtils.isNotBlank(pageTitle)) {
                        title = pageTitle;
                    }
                }
                item.put("title", title);
                item.put("active", entry.optBoolean("active", true));
                result.put(item);
            }
        } catch (JSONException e) {
            logger.error("TOC List: unable to parse '{}' JSON.", GUIDES_NAVIGATION_PROPERTY, e);
            return EMPTY_JSON_ARRAY;
        }
        return result.toString();
    }

    private static String resolvePath(final String outputPath, final String basePath) {
        String path = Utils.filePath(outputPath);
        String suffix = outputPath.substring(path.length());
        String resolved = path.startsWith("/") || StringUtils.isBlank(basePath)
                ? Paths.get(path).normalize().toString()
                : Paths.get(basePath, path).normalize().toString();
        return FilenameUtils.separatorsToUnix(resolved) + suffix;
    }

    private static String removeExtension(final String path) {
        int lastSlash = path.lastIndexOf('/');
        int lastDot = path.lastIndexOf('.');
        return lastDot > lastSlash ? path.substring(0, lastDot) : path;
    }

    private static boolean isExternalUrl(final String url) {
        return url.startsWith("//") || url.matches("^[A-Za-z][A-Za-z0-9+.-]*:.*");
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
