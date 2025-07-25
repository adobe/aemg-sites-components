package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.export.json.ComponentExporter;
// import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.wcm.api.Page;
import com.drew.lang.annotations.NotNull;
import com.drew.lang.annotations.Nullable;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.commons.codec.CharEncoding;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.jcr.*;
import java.util.*;

/**
 * @author Dimple.Baroliya on 30-09-2024.
 * @project aem-guides-project
 */

@Model(
        adaptables = {SlingHttpServletRequest.class, Resource.class},
        adapters = {GuidesTOC.class, ComponentExporter.class},
        resourceType = {"aemguidesDALP/components/sites-components/guides-toc",}
)
@Exporter(
        name = "jackson",
        extensions = {"json"}
)
public class GuidesTOCImpl extends AbstractComponentImpl implements GuidesTOC {

    protected static final String RESOURCE_TYPE_V1 = "aemguidesDALP/components/sites-components/guides-toc";
    private static final Logger logger = LoggerFactory.getLogger(GuidesTOCImpl.class);

    @Self
    private SlingHttpServletRequest request;

    @ScriptVariable
    private Resource resource;

    @ScriptVariable
    private Page currentPage;

    @Nullable
    private String templateName;

    private List<String> guidesNavigation;

    private List<Map<String,String>> topiclist;

    private String currentPageIndexInToc;

    @PostConstruct
    private void initModel() {
        try {
            Session session = request.getResourceResolver().adaptTo(Session.class);
            String sitePath = currentPage.getContentResource().getValueMap().get("sitePath", String.class);
            logger.info("AEMSITE: sitePath: {}", sitePath);
            Node node = session.getNode( sitePath + "/jcr:content");
            System.out.println(node.getPath());
            logger.info("AEMSITE: nodePath: {}", node.getPath());

            Binary tocBinary = node.getProperty("guides-navigation").getBinary();
            Binary tocIndexBinary = node.getProperty("guides-navigation-index").getBinary();
            String tocBinaryString = IOUtils.toString(tocBinary.getStream(), CharEncoding.UTF_8);
            String tocIndexBinaryString = IOUtils.toString(tocIndexBinary.getStream(), CharEncoding.UTF_8);

            logger.info("AEMSITE: tocBinaryString: {}", tocBinaryString);
            logger.info("AEMSITE: tocIndexBinaryString: {}", tocIndexBinaryString);
            // convert tocIndexBinaryString to JSON
            JSONObject tocIndexJson = new JSONObject(tocIndexBinaryString);
            try {
                currentPageIndexInToc = tocIndexJson.getString(currentPage.getPath());
            } catch (Exception e) {
                logger.warn("AEMSITE: warning: didnt find {} in tocIndexJson", currentPage.getPath());
                currentPageIndexInToc = "0";
            }
            guidesNavigation = new ArrayList<>();
            topiclist=new ArrayList<>();

            Map<String,String> map=new HashMap<>();


            Resource resource1=resource.getResourceResolver().getResource(sitePath);
            if(Objects.nonNull(resource1))
            {
                Node sitePathNode= resource1.adaptTo(Node.class);
                NodeIterator nodeIterator= sitePathNode.getNodes();
                while(nodeIterator.hasNext())
                {
                   // Node node1=nodeIterator.nextNode();

                    topiclist.add(processNode(nodeIterator.nextNode(),resource1, map));
                }

            }

            guidesNavigation.add(tocBinaryString);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            logger.error("AEMSITE: Error: {}", e.getMessage());
        }
    }

    @Override
    public List<String> getGuidesNavigation() {
        return guidesNavigation;
    }

    @Override
    public List<Map<String, String>> getTopicList() {
        return topiclist;
    }

    @Override
    public List<String> getTopicListJson() {
        List<String> list = new ArrayList<>();
        Gson gson = new Gson();
        String json = gson.toJson(this.topiclist);
        list.add(json);

        return list;
    }

    @Override
    public String getCurrentPageTocIndex() {
        return currentPageIndexInToc;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }

    public Map<String, String> processNode(Node childNode,Resource resourceResolver,Map<String,String> map) throws RepositoryException, PersistenceException {
        List<String> list=new ArrayList<>();

       map=new HashMap<>();

        list.add("navtitle");
        list.add("dc:contributor");
        list.add("dc:creator");
        list.add("dc:description");
        list.add("dc:contributor");
        list.add("dc:rights");
        list.add("dc:format");
        
        if(childNode.getName().equals("jcr:content"))
        {
            if(childNode.getParent().getProperty("jcr:primaryType").getString().equals("cq:Page"))
            {
                for(String key :list){
                    addNodeValue(childNode.getParent(),key,map);
                }

            }
        }
        else {
            if(childNode.getProperty("jcr:primaryType").getString().equals("cq:Page"))
            {
                for(String key :list){
                    addNodeValue(childNode,key,map);
                }

            }
        }

        return map;


//        if (childNode.hasNodes()) {
//            NodeIterator childNodes = childNode.getNodes();
//            while (childNodes.hasNext()) {
//                Node subchildNode = childNodes.nextNode();
//                processNode(subchildNode,resourceResolver,map);
//            }
//        }

    }

    private void addNodeValue(Node childNode, String key, Map<String,String> map) throws RepositoryException {

        String value = childNode.getNode("jcr:content").hasProperty(key) ? childNode.getNode("jcr:content").getProperty(key).getString() : "";
        map.put(key,value);
    }

}
