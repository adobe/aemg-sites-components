package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import com.adobe.cq.wcm.core.components.commons.link.LinkManager;
import com.adobe.cq.wcm.core.components.models.Breadcrumb;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.jcr.resource.api.JcrResourceConstants;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.via.ResourceSuperType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Collection;

@Model(adaptables = SlingHttpServletRequest.class,
        adapters = {Breadcrumb.class, ComponentExporter.class},
        resourceType = BreadcrumbModel.RESOURCE_TYPE, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class BreadcrumbModel extends AbstractComponentImpl implements Breadcrumb {

    protected static final String RESOURCE_TYPE = "guides-components/components/breadcrumb2";
    private static final Logger logger = LoggerFactory.getLogger(BreadcrumbModel.class);

    @Self
    @Via(type = ResourceSuperType.class)
    private Breadcrumb breadcrumb;

    @ScriptVariable
    Page currentPage;

    @SlingObject
    ResourceResolver resourceResolver;
    @Self
    private LinkManager linkManager;

    @PostConstruct
    void init() {
        logger.error("Failed to adapt resource resolver to PageManager.");
    }

    @Override
    public Collection<NavigationItem> getItems() {
        Collection<NavigationItem> modifiedItems = new ArrayList<>();
        Collection<NavigationItem> originalItems = breadcrumb.getItems();

        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        if (pageManager == null) {
            logger.error("Failed to adapt resource resolver to PageManager.");
            return modifiedItems;
        }

        for (NavigationItem item : originalItems) {
            String pagePath = item.getPath();
            logger.debug("Processing navigation item with path: {}", pagePath);

            Page page = pageManager.getContainingPage(pagePath);
            boolean clickable = false;

            if (page != null) {
                Resource contentResource = page.getContentResource();
                if (contentResource != null) {
                    ValueMap valueMap = contentResource.getValueMap();
                    if (valueMap.containsKey(JcrResourceConstants.SLING_RESOURCE_TYPE_PROPERTY)) {
                        clickable = true;
                    }
                }
            } else {
                logger.warn("Page not found for path: {}", pagePath);
            }

            modifiedItems.add(new Navigation2ItemImpl(
                    page,
                    item.isActive(),
                    item.isCurrent(),
                    clickable,
                    item.getLevel(),
                    item.getChildren(),
                    this.linkManager
            ));
        }

        logger.info("Processed {} navigation items.", modifiedItems.size());
        return modifiedItems;
    }

}
