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

@Model(adaptables = SlingHttpServletRequest.class, adapters = {Minitoc.class, ComponentExporter.class}, resourceType = {MinitocImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class MinitocImpl extends AbstractComponentImpl implements Minitoc {

    private static final Logger logger = LoggerFactory.getLogger(MinitocImpl.class);
    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/minitoc";
    private static final String RANGE_START = "start";
    private static final String RANGE_END = "end";
    private static final String TITLE = "title";

    @Self
    private SlingHttpServletRequest request;
    @ScriptVariable
    private ValueMap properties;

    @ScriptVariable
    private Resource resource;

    private int start;
    private String title;
    private int end;
    private I18n i18n;

    @PostConstruct
    private void initModel() {
        try {
            if (request != null) {
                i18n = new I18n(request);
            }
            start = getStart();
            end = getEnd();
        } catch (GuidesRuntimeException e) {
            logger.error(e.getMessage(), e);
        }
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    public int getStart() {
        return properties.get(RANGE_START, 1);
    }

    @Override
    public int getEnd() {
        return properties.get(RANGE_END, 6);
    }

    @Override
    public String getTitle() {
        String title = (String) properties.get(TITLE);
        if(StringUtils.isEmpty(title)) {
            title = "On this page";
        }
        return (i18n != null ? i18n.getVar(title) : title);
    }

}