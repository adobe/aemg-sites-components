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

import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;

import org.apache.commons.codec.CharEncoding;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.day.cq.wcm.api.Page;
import com.day.cq.i18n.I18n;


@Model(adaptables = SlingHttpServletRequest.class, adapters = {GuidesNavigation.class, ComponentExporter.class}, resourceType = {GuidesNavigationImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class GuidesNavigationImpl extends AbstractComponentImpl implements GuidesNavigation {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/guidessidenavigation";
    protected static final String LIMIT = "limit";
    protected static final String LOAD_MORE_TEXT = "loadMoreText";
    protected static final String LOAD_MORE_TEXT_DEFAULT_VALUE = "load more...";
    protected static final String LIMIT_DEFAULT_VALUE = "1000";
    private static final Logger logger = LoggerFactory.getLogger(GuidesNavigationImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private Page currentPage;
    @ScriptVariable
    private ValueMap properties;

    @Nullable
    private String templateName;

    private List<String> guidesNavigation;
    private String guidesNavigationIndex;
    private String guidesAllowedPages;
    private String currentPageRelativeUrl;

    private String limit;
    private String loadMoreText;
    private I18n i18n;


    @PostConstruct
    private void initModel() {
        try {
            if (request != null) {
                i18n = new I18n(request);
            }
            Session session = request.getResourceResolver().adaptTo(Session.class);
            String sitePath = currentPage.getContentResource().getValueMap().get("sitePath", String.class);
            logger.info("AEMSITE: sitePath: {}", sitePath);
            Node node = session.getNode(sitePath + "/jcr:content");
            System.out.println(node.getPath());
            logger.info("AEMSITE: nodePath: {}", node.getPath());

            Binary tocBinary = node.getProperty("guides-navigation").getBinary();
            Binary tocIndexBinary = node.getProperty("guides-navigation-index").getBinary();
            String tocBinaryString = IOUtils.toString(tocBinary.getStream(), CharEncoding.UTF_8);
            String tocIndexBinaryString = IOUtils.toString(tocIndexBinary.getStream(), CharEncoding.UTF_8);
            limit = properties.get(LIMIT, LIMIT_DEFAULT_VALUE);
            loadMoreText = translate(properties.get(LOAD_MORE_TEXT, LOAD_MORE_TEXT_DEFAULT_VALUE));
            logger.info("AEMSITE: tocBinaryString: {}", tocBinaryString);
            logger.info("AEMSITE: tocIndexBinaryString: {}", tocIndexBinaryString);
            logger.info("AEMSITE: toc rendering limit: {}", limit);
            logger.info("AEMSITE: toc load more text: {}", loadMoreText);

            guidesAllowedPages = Utils.getPagesAsJson(session, this.getCategoryPath());
            logger.info("AEMSITE: guidesAllowedPages: {}", guidesAllowedPages);
            guidesNavigationIndex = tocIndexBinaryString;
            try {
                String relativePath = Paths.get(this.getCategoryPath()).relativize(Paths.get(currentPage.getPath())).toString();
                String relativePathUnixPath = FilenameUtils.separatorsToUnix(relativePath);
                currentPageRelativeUrl = relativePathUnixPath;
            } catch (Exception e) {
                logger.warn("AEMSITE: warning: didnt find {} in tocIndexJson", currentPage.getPath());
            }
            guidesNavigation = new ArrayList<>();
            JSONObject toc = new JSONObject(tocBinaryString);
            Utils.updateVisibility(toc, new JSONObject(guidesAllowedPages), this.getCategoryPath());
            guidesNavigation.add(toc.toString());
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            logger.error("AEMSITE: Error: {}", e.getMessage());
        }
    }

    @Override
    public List<String> getGuidesNavigation() {
        return guidesNavigation;
    }

    @Override
    public String getGuidesNavigationIndex() {
        return guidesNavigationIndex;
    }

    @Override
    public String getGuidesAllowedPages() {
        return guidesAllowedPages;
    }

    @Override
    public String getCurrentPageRelativeUrl() {
        return currentPageRelativeUrl;
    }


    @Override
    public String getLimit() {
        return limit;
    }

    @Override
    public String getLoadMoreText() {
        return loadMoreText;
    }

    @Override
    public String getCategoryPath() {
        Page page = currentPage;
        return Utils.getCategoryPathFromPage(page);
    }

    public String translate(String str) {
        return (i18n != null ? i18n.getVar(str) : str);
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

}