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
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = {CategoryList.class, ComponentExporter.class},
        resourceType = CategoryListImpl.RESOURCE_TYPE_V1,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CategoryListImpl extends AbstractComponentImpl implements CategoryList {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/categorylist";
    protected static final String PN_PAGE_PATH = "pagePath";
    protected static final String PN_REDIRECT_PATH = "redirectPath";

    private static final Logger logger = LoggerFactory.getLogger(CategoryListImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ChildResource
    @Named("categoryPages")
    private List<Resource> categoryPages;

    private String categoryList = "[]";

    @PostConstruct
    private void initModel() {
        if (categoryPages == null || categoryPages.isEmpty()) {
            return;
        }
        categoryList = buildCategoryListJson(categoryPages, request.getResourceResolver());
    }

    static String buildCategoryListJson(List<Resource> items, ResourceResolver resolver) {
        List<String> entries = new ArrayList<>();

        for (Resource item : items) {
            ValueMap props = item.getValueMap();
            String pagePath = props.get(PN_PAGE_PATH, String.class);
            if (pagePath == null || pagePath.isEmpty()) {
                continue;
            }

            Resource pageResource = resolver.getResource(pagePath);
            if (pageResource == null) {
                logger.warn("Configured page path not found: {}", pagePath);
                continue;
            }

            Page page = pageResource.adaptTo(Page.class);
            if (page == null) {
                logger.warn("Resource is not a page: {}", pagePath);
                continue;
            }

            String title = page.getTitle() != null ? page.getTitle() : page.getName();
            String description = page.getDescription() != null ? page.getDescription() : "";
            String redirectPath = props.get(PN_REDIRECT_PATH, "");

            StringBuilder obj = new StringBuilder("{");
            obj.append("\"path\":\"").append(escapeJson(page.getPath())).append("\",");
            obj.append("\"title\":\"").append(escapeJson(title)).append("\",");
            obj.append("\"description\":\"").append(escapeJson(description)).append("\",");
            obj.append("\"thumbnail\":\"").append(escapeJson(page.getPath() + ".thumb.480.300.png")).append("\",");
            obj.append("\"redirectPath\":\"").append(escapeJson(redirectPath)).append("\"");
            obj.append("}");
            entries.add(obj.toString());
        }

        return "[" + String.join(",", entries) + "]";
    }

    static String escapeJson(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }

    @Override
    public String getCategoryList() {
        return categoryList;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }
}
