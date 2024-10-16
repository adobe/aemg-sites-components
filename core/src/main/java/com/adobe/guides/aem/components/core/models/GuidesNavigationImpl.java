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
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.Session;

import org.apache.commons.codec.CharEncoding;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.day.cq.wcm.api.Page;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {GuidesNavigation.class, ComponentExporter.class}, resourceType = {GuidesNavigationImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class GuidesNavigationImpl extends AbstractComponentImpl implements GuidesNavigation {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/guidessidenavigation";
    private static final Logger logger = LoggerFactory.getLogger(GuidesNavigationImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private Page currentPage;

    @Nullable
    private String templateName;

    private List<String> guidesNavigation;

    private String currentPageIndexInToc;

    @PostConstruct
    private void initModel() {
        try {
            Session session = request.getResourceResolver().adaptTo(Session.class);
            String sitePath = currentPage.getContentResource().getValueMap().get("sitePath", String.class);
            logger.info("AEMSITE: sitePath: {}", sitePath);
            Node node = session.getNode( sitePath + "/jcr:content");
            System.out.println(node.getPath());
            logger.info("AEMSITE: nodePath: {}", node.getPath());

            Binary tocBinary = node.getProperty("guides-navigation").getBinary();
            Binary tocIndexBinary = node.getProperty("guides-navigation-index").getBinary();
            String tocBinaryString = IOUtils.toString(tocBinary.getStream(), CharEncoding.UTF_8);
            String tocIndexBinaryString = IOUtils.toString(tocIndexBinary.getStream(), CharEncoding.UTF_8);

            logger.info("AEMSITE: tocBinaryString: {}", tocBinaryString);
            logger.info("AEMSITE: tocIndexBinaryString: {}", tocIndexBinaryString);
            // convert tocIndexBinaryString to JSON
            JSONObject tocIndexJson = new JSONObject(tocIndexBinaryString);
            try {
                currentPageIndexInToc = tocIndexJson.getString(currentPage.getPath());
            } catch (Exception e) {
                logger.warn("AEMSITE: warning: didnt find {} in tocIndexJson", currentPage.getPath());
                currentPageIndexInToc = "0";
            }
            guidesNavigation = new ArrayList<>();
            guidesNavigation.add(tocBinaryString);
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
    public String getCurrentPageTocIndex() {
        return currentPageIndexInToc;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

}