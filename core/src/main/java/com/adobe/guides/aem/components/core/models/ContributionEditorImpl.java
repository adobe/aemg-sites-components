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
import com.adobe.guides.aem.components.core.exception.GuidesRuntimeException;

import org.apache.commons.codec.CharEncoding;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.day.cq.i18n.I18n;

import javax.annotation.PostConstruct;
import javax.jcr.Binary;
import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.ValueFormatException;
import java.io.IOException;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {ContributionEditor.class, ComponentExporter.class}, resourceType = {ContributionEditorImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class ContributionEditorImpl extends AbstractComponentImpl implements ContributionEditor {

    private static final Logger logger = LoggerFactory.getLogger(ContributionEditor.class);
    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/contributioneditor";

    @Self
    private SlingHttpServletRequest request;
    @ScriptVariable
    private ValueMap properties;

    @ScriptVariable
    private Resource resource;

    private I18n i18n;

    @ScriptVariable
    protected com.day.cq.wcm.api.Page currentPage;

    private String url;

    @PostConstruct
    private void initModel() {
        try {
            if (request != null) {
                i18n = new I18n(request);
            }
            url = buildUrl();

        } catch (GuidesRuntimeException | RepositoryException | IOException e) {
            logger.error(e.getMessage(), e);
        }
    }

    String buildUrl() throws RepositoryException, IOException {
        String topicUuid = currentPage.getContentResource().getValueMap().get("topicUUID", String.class);
        String topicVersion = currentPage.getContentResource().getValueMap().get("topicVersion", String.class);
        return "/bin/guides/contribution/redirect?version=" + topicVersion+ "&topicUuid=" + topicUuid;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    public String getRedirectUrl() {
        return url;
    }

}