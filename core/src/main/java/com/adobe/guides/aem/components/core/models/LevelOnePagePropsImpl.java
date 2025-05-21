package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import com.day.cq.wcm.api.Page;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import com.google.gson.Gson;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.*;
import java.util.*;

@Model(
        adaptables = {SlingHttpServletRequest.class, Resource.class},
        adapters = {LevelOnePageProps.class, ComponentExporter.class},
        resourceType = {LevelOnePagePropsImpl.RESOURCE_V1}
)
@Exporter(
        name = "jackson",
        extensions = {"json"}
)
public class LevelOnePagePropsImpl extends AbstractComponentImpl implements LevelOnePageProps {
    protected static final String RESOURCE_V1 = "guides-components/components/sites-components/leveloneprops";
    private static final Logger logger = LoggerFactory.getLogger(LevelOnePagePropsImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private Page currentPage;

    @Nullable
    private String templateName;

    @ValueMapValue
    @Default(values = "")
    String propscsv;

    @Override
    public List<String> getLevelPageProperties() {
        List<String> levelOnePagePropsList = new ArrayList<>();

        String requiredProps[] = this.propscsv.split("\\s*,\\s*");

        if(Objects.isNull(siteNode)) {
            return  null;
        }

        try {
            NodeIterator childNodes = siteNode.getNodes();
            List<Map<String, String>> propsList = new ArrayList<>();

            while (childNodes.hasNext()) {
                Node childNode = childNodes.nextNode();
                if(childNode.getProperty("jcr:primaryType").getString().equals("cq:Page")) {

                    Map<String, String> propMap = new HashMap<>();
                    for(String prop: requiredProps) {
                        String propValue = childNode.getNode("jcr:content").hasProperty(prop) ? childNode.getNode("jcr:content").getProperty(prop).getString() : "";
                        propMap.put(prop, propValue);
                    }
                    propMap.put("pagePath", childNode.getPath());
                    propsList.add(propMap);
                }
            }

            Gson gson = new Gson();
            String propsJson = gson.toJson(propsList);

            levelOnePagePropsList.add(propsJson);

            return  levelOnePagePropsList;
        } catch (RepositoryException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<String> getUniquePropList() {

        List<String> uniquePropList = new ArrayList<>();

        if(Objects.isNull(siteNode) || Objects.isNull(propscsv)) {
            return  null;
        }

        Map<String, Set<String>> uniquePropMap = new HashMap<>();

        String requiredProps[] = this.propscsv.split("\\s*,\\s*");

        try {
            NodeIterator childNodes = siteNode.getNodes();

            while (childNodes.hasNext()) {
                Node childNode = childNodes.nextNode();
                if(childNode.getProperty("jcr:primaryType").getString().equals("cq:Page")) {
                    for(String prop: requiredProps) {
                        String propValue = getPropertyValue(childNode, prop);
                        uniquePropMap.computeIfAbsent(prop, k -> new HashSet<>()).add(propValue);
                    }
                }
            }

            String uniquePropMapJson = toJson(uniquePropMap);
            uniquePropList.add(uniquePropMapJson);

            return uniquePropList;

        } catch (ValueFormatException e) {
            throw new RuntimeException(e);
        } catch (PathNotFoundException e) {
            throw new RuntimeException(e);
        } catch (RepositoryException e) {
            throw new RuntimeException(e);
        }
    }

    @Nullable
    private Node siteNode;

    @PostConstruct
    private void initModel() {
        try {
            Session session = request.getResourceResolver().adaptTo(Session.class);
            String sitePath = currentPage.getContentResource().getValueMap().get("sitePath", String.class);
            logger.info("AEMSITE: sitePath: {}", sitePath);

            Node node = session.getNode(sitePath);
            this.siteNode = node;

            System.out.println(node.getPath());
            logger.info("AEMSITE: nodePath: {}", node.getPath());

        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            logger.error("AEMSITE: Error: {}", e.getMessage());
        }
    }

    public List<String> getUniqueList(Map<String, Set<String>> uniqueMap, Node childNode, String[] requiredProps) throws RepositoryException {
            for(String prop: requiredProps) {
                String propValue = getPropertyValue(childNode, prop);
                uniqueMap.computeIfAbsent(prop, k -> new HashSet<>()).add(propValue);
            }
        return null;
    }

    private String getPropertyValue(Node childNode, String prop) throws RepositoryException {
        if (childNode.getNode("jcr:content").hasProperty(prop)) {
            return childNode.getNode("jcr:content").getProperty(prop).getString();
        }
        return "";  // Default to empty string if property is not present
    }

    public String toJson(Object input) {
        Gson gson = new Gson();
        return gson.toJson(input);
    }
}
