package com.adobe.guides.aem.components.core.models;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Template;
import com.day.cq.wcm.api.TemplateManager;
import com.day.cq.wcm.api.components.ComponentContext;
import com.day.cq.wcm.commons.WCMUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.List;
@Model(
    adaptables = { Resource.class, SlingHttpServletRequest.class },
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TemplatedContainer {

    private static final Logger log = LoggerFactory.getLogger(TemplatedContainer.class);



    @Self
    private SlingHttpServletRequest request;

    private ComponentContext componentContext;

    @ScriptVariable
    private Page currentPage;

    private ResourceResolver resourceResolver;

    private Template template;

    private TemplateManager templateManager;

    @PostConstruct
    protected void init() {
        componentContext = WCMUtils.getComponentContext(request);
        resourceResolver=request.getResourceResolver();
        if (componentContext == null) {
            log.error("ComponentContext is null. Ensure the model is adapted in a component context.");
            throw new IllegalArgumentException("ComponentContext is null");
        }

        if (currentPage == null) {
            throw new IllegalArgumentException("Component's page is null");
        }

        // Adapt to TemplateManager and initialize template
        this.templateManager = resourceResolver.adaptTo(TemplateManager.class);
        if (templateManager == null) {
            throw new IllegalArgumentException("TemplateManager is null");
        }

        this.initTemplate();
    }

    public List<Resource> getStructureResources() {
        if (!this.hasStructureSupport()) {
            log.warn("Template has no structure support: {}", componentContext);
            return null;
        }

        return templateManager.getStructureResources(componentContext);
    }

    public String getNewResourceType() {
        return "wcm/foundation/components/templatedcontainer/newcontainer";
    }

    public boolean hasStructureSupport() {
        return template != null && template.hasStructureSupport();
    }

    private void initTemplate() {
        template = currentPage.getTemplate();

        if (template == null) {
            PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
            Page containingPage = pageManager.getContainingPage(componentContext.getResource());
            if (containingPage != null) {
                template = containingPage.getTemplate();
            } else {
                log.info("Page has no template assigned: {}", componentContext);
            }
        }
    }
}