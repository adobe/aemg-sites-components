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
 import com.day.cq.wcm.api.Page;
 import org.apache.sling.api.SlingHttpServletRequest;
 import org.apache.sling.api.resource.Resource;
 import org.apache.sling.models.annotations.Exporter;
 import org.apache.sling.models.annotations.Model;
 import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
 import org.apache.sling.models.annotations.injectorspecific.Self;
 import org.jetbrains.annotations.NotNull;
 import org.jetbrains.annotations.Nullable;
 
 import javax.annotation.PostConstruct;
 
 @Model(adaptables = SlingHttpServletRequest.class, adapters = {UserRating.class, ComponentExporter.class}, resourceType = {UserRatingImpl.RESOURCE_TYPE_V1})
 @Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
 public class UserRatingImpl extends AbstractComponentImpl implements UserRating {
 
     protected static final String RESOURCE_TYPE_V1 = "guides-components/components/userrating";
 
     @Self
     private SlingHttpServletRequest request;
 
     @ScriptVariable
     private Resource resource;
 
     @ScriptVariable
     private Page currentPage;
 
     @Nullable
     private String templateName;

     private String topicUuid;

     private String rootMapUuid;
     
     private String sitePublishPath; 
 
     @PostConstruct
     private void initModel() {
        topicUuid = Utils.getTopicUuid(currentPage);
        rootMapUuid = Utils.getRootMapUuid(currentPage);
        sitePublishPath = Utils.getSitePublishPath(currentPage);
     }       
  
     @NotNull
     @Override
     public String getExportedType() {
         return resource.getResourceType();
     }

	@Override
	public String getTopicUuid() {
		return topicUuid;
	}

	@Override
	public String getRootMapUuid() {
        return rootMapUuid;
    }

	@Override
	public String getSitePublishPath() {
		return sitePublishPath;
	}
 }