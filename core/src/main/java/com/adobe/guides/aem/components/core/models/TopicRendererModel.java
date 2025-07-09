package com.adobe.guides.aem.components.core.models;

import javax.annotation.PostConstruct;
import javax.jcr.Node;
import javax.jcr.NodeIterator;

import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(
    adaptables = { Resource.class, SlingHttpServletRequest.class },
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TopicRendererModel {

    private static final Logger logger = LoggerFactory.getLogger(TopicRendererModel.class);
    @Self
    private SlingHttpServletRequest request;
    @ScriptVariable
    private Page currentPage;

    private String topicnodepath;

    @PostConstruct
    protected void init() {
        try {
            logger.error("Inside TopicRendererModel");

            Node rootNode = currentPage.adaptTo(Node.class).getNode("jcr:content/root");

            if (rootNode != null && rootNode.hasNodes()) {
                NodeIterator nodeIterator = rootNode.getNodes();

                while (nodeIterator.hasNext()) {
                    Node containerNode = nodeIterator.nextNode();

                    // Check if node has the correct resourceType
                    if (containerNode.hasProperty("sling:resourceType") &&
                            "guides-components/components/container".equals(containerNode.getProperty("sling:resourceType").getString())) {

                        // Check if "injected-container" exists inside this container
                        if (containerNode.hasNode("injected-container")) {
                            topicnodepath = containerNode.getNode("injected-container").getPath();
                            break; // Stop once we find the first matching container
                        }
                    }
                }
            }

        } catch (Exception e) {
            logger.error("Error in TopicRendererModel: {}", e.getMessage(), e);
        }

        logger.debug("topicnodepath is set as {}", topicnodepath);
    }


    public String getTopicnodepath() {
        return topicnodepath;
    }
}
