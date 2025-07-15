/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.adobe.guides.aem.components.core.listeners;

import com.adobe.guides.aem.components.core.utils.CommonUtils;
import com.day.cq.wcm.api.Page;
import com.adobe.guides.aem.components.core.constants.CommonConstants;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ModifiableValueMap;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;

import org.apache.sling.api.resource.observation.ResourceChange;
import org.apache.sling.api.resource.observation.ResourceChange.ChangeType;
import org.apache.sling.api.resource.observation.ResourceChangeListener;
import org.apache.sling.event.jobs.Job;
import org.apache.sling.event.jobs.JobManager;
import org.apache.sling.event.jobs.consumer.JobConsumer;
import org.apache.sling.settings.SlingSettingsService;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.propertytypes.ServiceDescription;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A service to sync metadata from DITA source files to generated Site pages 
 * on creation or modification 
 * Please note, that apart from EventHandler services,
 * the immediate flag should not be set on a service.
 */
@Component(service = {/*EventHandler.class,*/ ResourceChangeListener.class, JobConsumer.class},
        immediate = true,
        enabled = true,
        property = {
            //EventConstants.EVENT_TOPIC + "=" + "[org/apache/sling/api/resource/Resource/*]",
            ResourceChangeListener.PATHS + "=" + "/content/",
            ResourceChangeListener.CHANGES + "=" + "ADDED",
            ResourceChangeListener.CHANGES + "=" + "CHANGED",
            JobConsumer.PROPERTY_TOPICS + "=" + MetadataSyncHandler.GUIDES_METADATA_SYNC_TOPIC   
        }
)
@ServiceDescription("syncs metadata from source ditamaps or ditatopics to generated Site pages")
@Designate(ocd = MetadataSyncHandler.Configuration.class)
public class MetadataSyncHandler /*implements EventHandler, JobConsumer*/ implements ResourceChangeListener, JobConsumer {

    private final Logger logger = LoggerFactory.getLogger(getClass());
    
    public static final String GUIDES_METADATA_SYNC_TOPIC = "guides/metadata/sync";
    
    private static final String AEM_DOCX_PAGE_ATTRIBUTE_NAME="aemdocxpage";
    private static final String EFFECTIVE_SOURCE_PATH_ATTRIBUTE_NAME = "effectiveSourcePath";
    private static final String DITAMETA_NODE_NAME = "ditameta";
    private static final String MAPID_ATTRIBUTE_NAME = "mapID";
    private static final String MAPPARENT_ATTRIBUTE_NAME = "mapParent";
    private static final String PRESET_ATTRIBUTE_NAME = "preset";
    private static final String METADATA_NODE_NAME = "metadata";
    private static final String NAMEDOUTPUTS_NODE_NAME = "namedoutputs";
    private static final String BASELINE_ATTRIBUTE_NAME = "baseline";
    private static final String HIDE_IN_NAV_ATTRIBUTE_NAME="hideInNav";
    private static final String ACTIVE_BASELINE_ATTRIBUTE_NAME = "fmdita-baselineName"; 
    private static final String PDFPATH_ATTRIBUTE_NAME = "pdfPath";
    
    private boolean enabled = false;
    //private String rootPath;
    
    @Reference 
    private JobManager jm;

    @ObjectClassDefinition(name = "Guides Metadata Sync Handler")
    public @interface Configuration {

        @AttributeDefinition(
                name = "Enabled",
                description = "Guides Metadata Sync Handler is enabled",
                type = AttributeType.BOOLEAN
        )
        boolean enabled() default true;
        
        //@AttributeDefinition(name = "Root Path", description = "Guides Metadata Sync Handler is enabled",type = AttributeType.STRING)
        //String rootPath();

    }

    @Reference
    private SlingSettingsService slingSettingsService;

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    @Activate
    @Modified
    protected void activate(MetadataSyncHandler.Configuration config) {
        this.enabled = config.enabled();
        //this.rootPath = config.rootPath();
        if(!slingSettingsService.getRunModes().contains("author")) {
            //this.enabled = false;
            //return; //run this metadata sync only on author
        }
        logger.info("Metadata Sync Handler is : " + (enabled ? " enabled " : " not enabled "));
    }
    
    
    @Override
    public void onChange(List<ResourceChange> changes) {
        if(!this.enabled) {
            return;
        }
        changes.forEach(change -> {
            logger.debug("Resource event: {} at: {}", change.getType(), change.getPath());
            String path = change.getPath();
            ChangeType changeType = change.getType();
            switch(changeType) {
                case ADDED:
                    break;
                case CHANGED :
                    break;
                default :
                    return;
            }
            /*
            if(!path.startsWith(this.rootPath)) {
                logger.debug("the resource change event was not for the configured root path : {}", rootPath); 
                return;
            }
            */
            try {
                Map<String, Object> properties = new HashMap<>();
                properties.put("payload", path);
                properties.put("event", changeType.name());
                Job job = jm.addJob(GUIDES_METADATA_SYNC_TOPIC, properties);
                if(job != null) {
                    logger.debug("triggered the Guides Metadata Sync Handler job for the {}ed page {} with Job ID : {}", changeType, path, job.getId());
                } else {
                    logger.debug("failed to trigger Guides Metadata Sync Handler job for the {}ed page {} ", changeType, path);
                }
            } catch(Exception e) {
                logger.error("error adding job for syncing metadata", e);
            }
            
        });        
    }
    
    /*
    @Override
    public void handleEvent(Event event) {
        if(!this.enabled) {
            return;
        }
        String topic = event.getTopic();
        String path = (String) event.getProperty(SlingConstants.PROPERTY_PATH);
        logger.debug("received resource change event: {}, for path : {}", event, path); 
        if(topic == null || topic.endsWith("DELETED")) { 
            return;
        }
        if(path == null ) { 
            return;
        }
        if(!path.startsWith(this.rootPath)) {
            logger.debug("the resource change event was not for the configured root path : {}", rootPath); 
            return;
        }
        try {
            event = event.substring(event.lastIndexOf("/"));
            Map<String, Object> properties = new HashMap<>();
            properties.put("payload", path);
            properties.put("event", event);
            Job job = jm.addJob(GUIDES_METADATA_SYNC_TOPIC, properties);
            if(job != null) {
                logger.debug("triggered the Guides Metadata Sync Handler job for the {}ed image {} with Job ID : {}", event, path, job.getId());
            } else {
                logger.debug("failed to trigger Guides Metadata Sync Handler job for the {}ed image {} ", event, path);
            }
        } catch(Exception e) {
            logger.error("error adding job for syncing metadata", e);
        }
        
    }
    */
    
    @Override
    public JobResult process(Job job) {
        logger.debug("started metadata sync handler job");
        ResourceResolver resolver = null;
        try {
            String payload = job.getProperty("payload", String.class);
            String event = job.getProperty("event", String.class);
            resolver = CommonUtils.getResourceResolver(resourceResolverFactory);
            this.sync(resolver, event, payload);
            logger.debug("completed the guides metadata sync job");
            return JobResult.OK;
        } catch (LoginException le) {
            logger.error("error acquiring service resource resolver while processing job to start guides metadata sync", le);
            return JobResult.FAILED;
        } catch(Throwable t) {
            logger.error("error executing the guides metadata sync", t);
            return JobResult.FAILED;
        } finally {
            if(resolver != null && resolver.isLive()) {
                resolver.close();
            }
            logger.debug("completed metadata sync handler job");
        }
    }
    
    private void sync(ResourceResolver resolver, String event, String path) {
        logger.debug("starting Guides Metadata Sync for path : {}", path);
        try {
            boolean synced = false;
            Resource resource = resolver.getResource(path);
            logger.trace("changed resource : {}", resource);
            if(resource == null) {return;}
            Page page = null; Resource content = null;
            if(path.endsWith(JcrConstants.JCR_CONTENT)) {
                content = resource;
            } else {
                page = resource.adaptTo(Page.class);
                logger.debug("changed page : {}", page);
                if(page == null) {return;}  //not a page resource
                content = page.getContentResource();
            }
            //logger.trace("changed page content resource : {}", content);
            if(content == null) {return;}
            ModifiableValueMap conmap = content.adaptTo(ModifiableValueMap.class);
            if(conmap == null) {return;}
            String resourcePrimaryType = conmap.get(JcrConstants.JCR_PRIMARYTYPE, String.class);
            if(resourcePrimaryType == null || !resourcePrimaryType.equals("cq:PageContent")) {
                logger.debug("not a page content resource ");
                return;
            }
            if(!conmap.containsKey(AEM_DOCX_PAGE_ATTRIBUTE_NAME) && !conmap.containsKey(MAPPARENT_ATTRIBUTE_NAME)) {
                logger.debug("page not corresponding to DITA map/topic; skipping...");
                return;
            }
            String effectiveSourcePath = conmap.get(EFFECTIVE_SOURCE_PATH_ATTRIBUTE_NAME, String.class);
            //logger.trace("effectiveSourcePath -> {}", effectiveSourcePath);
            if(effectiveSourcePath == null || effectiveSourcePath.isBlank()) {return;}
            Resource source = resolver.getResource(effectiveSourcePath);
            if(source == null) {return;}
            Resource sourceContent = source.getChild(JcrConstants.JCR_CONTENT);
            if(sourceContent == null) {return;}           
            Resource metadata = sourceContent.getChild(METADATA_NODE_NAME);
            if(metadata == null) {return;}            
            ValueMap metamap = metadata.getValueMap();
            Iterator<String> iterator = metamap.keySet().iterator();
            //metamap.forEach( (key, value) -> {
            String key; Object value;
            while(iterator.hasNext()) {
                key = iterator.next();
                value = metamap.get(key);
                //logger.trace("metadata key : {}, value : {}", key, value);
                if(!key.startsWith("dc:")) {
                    continue;
                }
                if(conmap.containsKey(key)) {
                    Object exval = conmap.get(key);
                    if(exval == null) {
                        if(value!= null) {
                            conmap.put(key, value);
                            synced = true;
                        }
                    } else {
                        if(value != null) {
                            if(!exval.equals(value)){
                                conmap.put(key, value);
                                synced = true;
                            }
                        } else {
                            conmap.put(key, value);
                            synced = true;
                        }
                    }
                } else {
                    conmap.put(key, value);
                    synced = true;
                }
            }// );
            //logger.trace("conmap contains mapid -> {} ", conmap.containsKey(MAPID_ATTRIBUTE_NAME));
            if(!conmap.containsKey(MAPID_ATTRIBUTE_NAME)) {     //mapID is null for the page corresponding to the ditamap
                String mapParent = conmap.get(MAPPARENT_ATTRIBUTE_NAME, String.class);
                //logger.trace("mapParent : {}", mapParent);
                if(mapParent!=null) {
                    //logger.trace("effectiveSourcePath equals mapParent -> {}", effectiveSourcePath.equals(mapParent));
                    if(effectiveSourcePath.equals(mapParent)) {
                        if(conmap.containsKey(HIDE_IN_NAV_ATTRIBUTE_NAME)) {
                            conmap.remove(HIDE_IN_NAV_ATTRIBUTE_NAME);
                            synced=true;
                        }
                        String preset = conmap.get(PRESET_ATTRIBUTE_NAME, String.class);
                        //logger.trace("conmap.preset -> {}", preset);
                        if(preset != null) {
                            String baseline = metamap.get(NAMEDOUTPUTS_NODE_NAME + "/" + preset + "/" + ACTIVE_BASELINE_ATTRIBUTE_NAME, String.class);
                            logger.debug("DITAMAP baseline -> {}", baseline);
                            if(!conmap.containsKey(BASELINE_ATTRIBUTE_NAME)) {
                                conmap.put(BASELINE_ATTRIBUTE_NAME, baseline);
                                synced = true;
                            }
                        }
                        String pdfPath = sourceContent.getValueMap().get(PDFPATH_ATTRIBUTE_NAME, String.class);
                        if(!conmap.containsKey(PDFPATH_ATTRIBUTE_NAME)) {
                            conmap.put(PDFPATH_ATTRIBUTE_NAME, pdfPath);
                            synced = true;
                        }
                    }                    
                }
            }
            
            Resource ditameta = sourceContent.getChild(DITAMETA_NODE_NAME);
            Resource destdita = content.getChild(DITAMETA_NODE_NAME);
            if(ditameta != null) {
                if(destdita != null) {
                    //TODO - compare each property and update if changed
                } else {
                    resolver.copy(ditameta.getPath(), content.getPath());
                    synced = true;
                }                
            }
            
            switch(event) {
                case "ADDED" : 
                    break;
                case "CHANGED" : 
                    break;  
                default :
                    return;
            }
            if(synced) {
                resolver.commit();
            }
        } catch (PersistenceException pe) {
            logger.error("error syncing Metadata for path : {}", path, pe);
        } finally {
            logger.debug("completed metadata sync handler process");
        }
    }

}

