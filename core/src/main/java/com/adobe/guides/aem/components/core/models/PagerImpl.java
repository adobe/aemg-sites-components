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
import com.adobe.cq.export.json.SlingModelFilter;
import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.wcm.api.Page;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.factory.ModelFactory;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.Node;
import javax.jcr.RepositoryException;
import java.util.Iterator;

@Model(adaptables = SlingHttpServletRequest.class,
       adapters = { Pager.class, ComponentExporter.class },
       resourceType = PagerImpl.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PagerImpl extends AbstractComponentImpl implements Pager {

    private static final Logger LOGGER = LoggerFactory.getLogger(PagerImpl.class);

    protected static final String RESOURCE_TYPE = "guides-components/components/pager";

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    protected com.day.cq.wcm.api.Page currentPage;

    @ScriptVariable
    @JsonIgnore
    protected ResourceResolver resolver;

    @Inject
    private ModelFactory modelFactory;

    @Inject
    private SlingModelFilter slingModelFilter;

    @Self
    private SlingHttpServletRequest request;

    private ListItem prev;
    private ListItem next;

    @PostConstruct
    protected void initModel() {
        prev = findPrev();
        next = findNext(currentPage);
    }

    private boolean shouldSkipPage(Page page) {
        Resource contentResource = page.getContentResource();
        if (contentResource != null) {
            Node contentNode = contentResource.adaptTo(Node.class);
            try {
                return contentNode != null && !contentNode.hasProperty("sourcePath");
            } catch (RepositoryException e) {
                LOGGER.error("Error in Pager components {}", e);
            }
        }
        return false;
    }

    protected ListItem findNext(Page currentPage) {
        Page parent = currentPage.getParent();
        if (currentPage.getDepth() <= 5) {
            // Prevent pager from leaving the book
            // TODO: Push depth into edit dialog
            return null;
        }

        if (parent != null) {
            Iterator<Page> siblings = parent.listChildren();
            while (siblings.hasNext()) {
                Page sibling = siblings.next();
                if (currentPage.getName().equals(sibling.getName())) {
                    boolean hasNext = siblings.hasNext();
                    Page nextPage = null;
                    if(hasNext) {
                        while (siblings.hasNext()) {
                            Page tempNext = siblings.next();
                            if (!shouldSkipPage(tempNext)) {
                                nextPage = tempNext;
                                break;
                            }
                        }
                    }
                    return hasNext && nextPage != null
                        ? new PageListItemImpl(request, nextPage, "", false, null)
                        : findNext(currentPage.getParent());
                }
            }
        }
        return null;
    }

    protected ListItem findPrev() {
        Page parent = currentPage.getParent();
        if (parent != null) {
            Page prevSibling = null;
            Iterator<Page> siblings = parent.listChildren();
            while (siblings.hasNext()) {
                Page sibling = siblings.next();
                if (prevSibling != null && currentPage.getName().equals(sibling.getName())) {
                    return new PageListItemImpl(request, prevSibling, "", false, null);
                }
                if(!shouldSkipPage(sibling))
                    prevSibling = sibling;
            }
        }
        return null;
    }

    @Override
    public ListItem getPrev() {
        return prev;
    }

    @Override
    public ListItem getNext() {
        return next;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }
}
