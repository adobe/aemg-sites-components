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
import com.adobe.cq.wcm.core.components.models.datalayer.ComponentData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.day.cq.wcm.api.LanguageManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.designer.Style;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import javax.annotation.PostConstruct;

@Model(adaptables = SlingHttpServletRequest.class,
       adapters = {PageProperty.class, ComponentExporter.class},
       resourceType = {PagePropertyImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PagePropertyImpl extends AbstractComponentImpl implements PageProperty {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/pageproperty";
    private static final Logger logger = LoggerFactory.getLogger(PagePropertyImpl.class);
    private static final String DATE_FORMAT = "dateFormat";
    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private PageManager pageManager;

    @ScriptVariable
    private Page currentPage;
    @OSGiService
    private LanguageManager languageManager;

    @ScriptVariable(injectionStrategy = InjectionStrategy.OPTIONAL)
    @JsonIgnore
    @Nullable
    private Style currentStyle;

    @ValueMapValue(injectionStrategy = InjectionStrategy.OPTIONAL, name = "property")
    @Nullable
    private String property;

    @PostConstruct
    private void initModel() {
        Resource resource = currentPage.adaptTo(Resource.class);
        ValueMap properties = resource.getValueMap();
        Locale locale = null;
        try {
            locale = languageManager.getLanguage(currentPage.getContentResource());
        } catch (Exception e) {
            logger.error("Error: {}", e);
        }
        logger.info("locale for date format: {}", locale);
        if (StringUtils.isNotBlank(property) && properties.containsKey(property)) {
            Object val = properties.get(property);
            if (val instanceof String) {
                property = (String) val;
            } else if (val instanceof Calendar) {
                property = formatDate((Calendar)val, getDateFormat(), locale);
            } else {
                property = "";
            }
        } else {
            property = "";
        }
    }

    private String getDateFormat() {
        ValueMap properties = this.resource.getValueMap();
        return properties.get(DATE_FORMAT, "MMM d, yyyy");
    }

    private String formatDate(final Calendar calendar, String dateFormat, Locale locale) {
        SimpleDateFormat format;
        if(locale == null) {
            format = new SimpleDateFormat(dateFormat);
        } else {
            format = new SimpleDateFormat(dateFormat, locale);
        }
        format.setTimeZone(calendar.getTimeZone());
        return format.format(calendar.getTime());
    }

    @Override
    public String getProperty() {
        return property;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    @Override
    @NotNull
    protected ComponentData getComponentData() {
        return DataLayerBuilder.extending(super.getComponentData()).asComponent()
            .withTitle(this::getProperty)
            .build();
    }

}
