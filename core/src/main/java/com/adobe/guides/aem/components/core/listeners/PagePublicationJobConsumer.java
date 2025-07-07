package com.adobe.guides.aem.components.core.listeners;

import com.adobe.guides.aem.components.core.constants.CommonConstants;
import com.adobe.guides.aem.components.core.utils.CommonUtils;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.Replicator;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.*;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;

@Component(
        service = JobConsumer.class,
        immediate = true,
        property = {
                JobConsumer.PROPERTY_TOPICS + "=aem/page/publication/job"
        }
)
public class PagePublicationJobConsumer implements JobConsumer {
    private static final Logger LOGGER = LoggerFactory.getLogger(PagePublicationJobConsumer.class);
    @Reference
    private ResourceResolverFactory resolverFactory;
    @Reference
    private Replicator replicator;

    @Override
    public JobResult process(Job job) {
        String pagePath = (String) job.getProperty("pagePath");
        try (ResourceResolver resourceResolver = CommonUtils.getResourceResolver(resolverFactory)) {
            PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
            if (pageManager == null) {
                LOGGER.error("Failed to adapt resource resolver to PageManager");
                return JobResult.FAILED;
            }

            Page page = pageManager.getContainingPage(pagePath);
            if (page == null) {
                LOGGER.warn("No containing page found for path: {}", pagePath);
                return JobResult.FAILED;
            }

            Resource parentResource = resourceResolver.getResource(CommonConstants.GUIDE_DATA_PATH);
            if (parentResource == null) {
                LOGGER.error("Parent resource not found at path: {}", CommonConstants.GUIDE_DATA_PATH);
                return JobResult.FAILED;
            }

            String pageName = CommonUtils.getPageName(pagePath);
            Resource pageResource = parentResource.getChild(pageName);
            if (pageResource == null) {
                LOGGER.error("Page resource not found for page name: {}", pageName);
                return JobResult.FAILED;
            }

            ValueMap valueMap = page.getProperties();
            String baseline = valueMap.get("baseline", String.class);
            Session session = resourceResolver.adaptTo(Session.class);
            if (session == null) {
                LOGGER.error("Failed to adapt resource resolver to JCR session");
                return JobResult.FAILED;
            }

            if (StringUtils.isNotBlank(baseline)) {
                Resource baselineResource = pageResource.getChild(baseline);
                if (baselineResource != null) {
                    replicator.replicate(session, ReplicationActionType.ACTIVATE, baselineResource.getPath());
                    LOGGER.info("Successfully replicated baseline resource: {}", baselineResource.getPath());
                    return JobResult.OK;
                } else {
                    LOGGER.warn("Baseline resource not found: {}", baseline);
                }
            }

            replicator.replicate(session, ReplicationActionType.ACTIVATE, pageResource.getPath());
            LOGGER.info("Successfully replicated page resource: {}", pageResource.getPath());
            if (session != null && session.isLive()) {
                session.logout();
            }
            if (resourceResolver != null && resourceResolver.isLive()) {
                resourceResolver.close();
            }
            return JobResult.OK;

        } catch (LoginException e) {
            LOGGER.error("Failed to obtain a resource resolver", e);
        } catch (ReplicationException e) {
            LOGGER.error("Replication failed", e);
        }
        return JobResult.FAILED;
    }
}
