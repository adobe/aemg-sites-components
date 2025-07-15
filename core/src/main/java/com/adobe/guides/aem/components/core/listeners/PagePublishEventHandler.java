package com.adobe.guides.aem.components.core.listeners;

import com.adobe.guides.aem.components.core.utils.CommonUtils;
import com.day.cq.replication.ReplicationAction;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.event.jobs.JobManager;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.event.Event;
import org.osgi.service.event.EventConstants;
import org.osgi.service.event.EventHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;


@Component(service = EventHandler.class, immediate = true, property = {EventConstants.EVENT_TOPIC + "=" + ReplicationAction.EVENT_TOPIC})
public class PagePublishEventHandler implements EventHandler {

    private static final String JOB_TOPIC = "aem/page/publication/job";
    private static final Logger LOGGER = LoggerFactory.getLogger(PagePublishEventHandler.class);


    @Reference
    ResourceResolverFactory resolverFactory;

    @Reference
    private JobManager jobManager;


    @Override
    public void handleEvent(Event event) {
        ReplicationAction action = ReplicationAction.fromEvent(event);
        if (action.getType().equals(ReplicationActionType.ACTIVATE) && action.getPath() != null) {
            try (ResourceResolver resourceResolver = CommonUtils.getResourceResolver(resolverFactory)) {
                PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
                if (pageManager == null) {
                    LOGGER.error("Failed to adapt resource resolver to PageManager");
                    return;
                }

                Page page = pageManager.getContainingPage(action.getPath());
                if (page == null) {
                    LOGGER.warn("No containing page found for path: {}", action.getPath());
                    return;
                }

                if (CommonUtils.isLandingPage(page)) {
                    Map<String, Object> jobProperties = new HashMap<>();
                    jobProperties.put("pagePath", page.getPath());
                    jobManager.addJob(JOB_TOPIC, jobProperties);
                    LOGGER.info("Job added for landing page: {}", page.getPath());
                }
                if (resourceResolver != null && resourceResolver.isLive()) {
                    resourceResolver.close();
                }
            } catch (LoginException e) {
                LOGGER.error("Failed to obtain a resource resolver", e);
            }
        }
    }
}