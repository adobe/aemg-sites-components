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
 import com.adobe.cq.wcm.core.components.models.Component;
 import org.osgi.annotation.versioning.ConsumerType;
 
 @ConsumerType
 public interface UserRating extends Component {
    /**
     * Returns the uuid of the file which was used for publishing the topic.
     * 
     * @return Returns the uuid of the file which was used for publishing the topic,
     *         empty otherwise.
     * @since com.adobe.cq.wcm.core.components.models 11.0.0; marked <code>default</code> in 12.1.0
     */
    String getTopicUuid();

    /**
     * Returns the UUID of the map which was used for publishing the topic.
     * 
     * @return UUID of the map which was used for publishing the topic, empty
     *         otherwise
     * @since com.adobe.cq.wcm.core.components.models 11.0.0; marked <code>default</code> in 12.1.0
     */
    String getRootMapUuid();

    /**
     * Returns the current path of the page.
     * 
     * @return Current Path of the page
     * @since com.adobe.cq.wcm.core.components.models 11.0.0; marked <code>default</code> in 12.1.0
     */
    String getSitePublishPath();

 }
 