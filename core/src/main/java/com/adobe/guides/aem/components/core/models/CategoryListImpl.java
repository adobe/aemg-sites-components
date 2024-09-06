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
import com.day.cq.wcm.api.Page;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.query.Query;
import javax.jcr.query.QueryManager;
import javax.jcr.query.QueryResult;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, adapters = {CategoryList.class, ComponentExporter.class}, resourceType = {CategoryListImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CategoryListImpl extends AbstractComponentImpl implements CategoryList {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/categorylist";
    private static final String SLASH = "/";
    private static final String QUERY_PATH_TOKEN = "{PATH}";
    private static final String QUERY_TEMPLATE_TOKEN = "{TEMPLATE}";
    private static final String PAGES_BY_TEMPLATE_QUERY = "SELECT * FROM [cq:Page] AS s WHERE ISDESCENDANTNODE([" + QUERY_PATH_TOKEN + "]) AND s.[jcr:content/cq:template]='" + QUERY_TEMPLATE_TOKEN + "'";
    private static final String CONF_PATH_TOKEN = "conf";
    private static final String CONTENT_PATH_TOKEN = "content";
    private static final String TEMPLATE_PATH_TOKEN = "settings/wcm/templates/kb-content";
    private static final Logger logger = LoggerFactory.getLogger(CategoryListImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private Page currentPage;

    @Nullable
    private String templateName;

    private List<String> categoryList;

    @PostConstruct
    private void initModel() {
        String cqTemplate = currentPage.getContentResource().getValueMap().get("cq:template", String.class);
        if (StringUtils.isEmpty(cqTemplate)) {
            logger.error("Unable to retrieve template name.");
            return;
        }

        try {
            templateName = getTemplateName(cqTemplate);
            categoryList = findPagesByTemplate(request.getResourceResolver(), FilenameUtils.concat(SLASH, FilenameUtils.concat(CONF_PATH_TOKEN,FilenameUtils.concat(templateName , TEMPLATE_PATH_TOKEN))), currentPage.getPath());
        } catch (RepositoryException e) {
            logger.error("Unable to retrieve category list for current template.", e);
        } catch (GuidesRuntimeException e) {
            logger.error(e.getMessage(), e);
        }
    }

    public static String getTemplateName(final String cqTemplateString) throws GuidesRuntimeException {
        String[] cqTemplateStringArray = cqTemplateString.split("/");
        int indexOfTemplate = -1;
        for (int i = 0; i < cqTemplateStringArray.length; i++) {
            if (cqTemplateStringArray[i].equals(CONF_PATH_TOKEN)) {
                indexOfTemplate = i;
                break;
            }
        }
        if (indexOfTemplate == -1) {
            throw new GuidesRuntimeException("Unable to retrieve template name for" + cqTemplateString);
        }
        int indexOfTemplateName = indexOfTemplate + 1;
        return cqTemplateStringArray[indexOfTemplateName];
    }

    public static List<String> findPagesByTemplate(final ResourceResolver resourceResolver, final String template, final String path) throws RepositoryException {
        Session session = resourceResolver.adaptTo(Session.class);
        QueryManager queryManager = session.getWorkspace().getQueryManager();
        final String userQuery = PAGES_BY_TEMPLATE_QUERY.replace(QUERY_PATH_TOKEN, FilenameUtils.separatorsToUnix(path)).replace(QUERY_TEMPLATE_TOKEN, FilenameUtils.separatorsToUnix(template));
        logger.info("QUERY for category list: {}", userQuery);
        Query query = queryManager.createQuery(userQuery, Query.JCR_SQL2);
        QueryResult res = query.execute();
        NodeIterator nodes = res.getNodes();
        List<String> newCategoryList = new ArrayList<>(Collections.emptyList());

        while (nodes.hasNext()) {
            Node node = nodes.nextNode();
            Page aemPage = resourceResolver.getResource(node.getPath()).adaptTo(Page.class);
            newCategoryList.add(aemPage.getPath());
            newCategoryList.add(aemPage.getTitle());
            newCategoryList.add(aemPage.getPath()+".thumb.480.300.png");
        }
        return newCategoryList;
    }

    @Override
    public List<String> getCategoryList() {
        return categoryList;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

}