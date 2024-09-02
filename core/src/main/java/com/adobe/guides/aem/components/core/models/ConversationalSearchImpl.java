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
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.jetbrains.annotations.NotNull;

import javax.annotation.PostConstruct;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {ConversationalSearch.class, ComponentExporter.class}, resourceType = {ConversationalSearchImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ConversationalSearchImpl extends AbstractComponentImpl implements ConversationalSearch {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/conversationalsearch";

    @ScriptVariable
    private Page currentPage;

    private String siteId;

    private String isEnabled;

    @PostConstruct
    private void initModel() {
        this.siteId = "";
        String publishPath = currentPage.getContentResource().getValueMap().get("targetPath", String.class);
        String specialCharRegex = "[^a-zA-Z0-9]";
        if(publishPath != null) {
            this.siteId = publishPath.replaceAll(specialCharRegex, "_");
        }

        String searchEnabled = currentPage.getContentResource().getValueMap().get("searchEnabled", String.class);
        this.isEnabled = searchEnabled == null ? "true" : searchEnabled;
    }

    @Override
    public String getSiteId() {
        return this.siteId;
    }

    @Override
    public String getIsEnabled() {
        return this.isEnabled;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

}