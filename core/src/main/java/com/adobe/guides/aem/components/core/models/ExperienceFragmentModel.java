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
package com.adobe.guides.aem.components.core.models;

import static org.apache.sling.api.resource.ResourceResolver.PROPERTY_RESOURCE_TYPE;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

import java.util.Optional;
import javax.inject.Inject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ExperienceFragmentModel {

    @ValueMapValue(name=PROPERTY_RESOURCE_TYPE, injectionStrategy=InjectionStrategy.OPTIONAL)
    @Default(values="No resourceType")
    @Via("resource")
    protected String resourceType;

    @SlingObject
    private Resource currentResource;
    
    @Inject @ScriptVariable
    private Page currentPage;
    
    private Page containingPage;
    
    @SlingObject
    private ResourceResolver resourceResolver;
    
    private boolean embedded;

    @PostConstruct
    protected void init() {
        PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        Optional.ofNullable(pageManager)
                .map(pm -> {
                    containingPage = pm.getContainingPage(currentResource); 
                    return containingPage;
                });//.map(Page::getPath).orElse("");

        if(currentPage != null && containingPage != null && currentResource != null) {
            //if(currentResource.getPath().contains(currentPage.getPath())) {
            if(currentPage.getPath().equals(containingPage.getPath())) {
                embedded = true;
            }
        }

    }

    public boolean isEmbedded() {
        return embedded;
    }

    public Resource getCurrentResource() {
        return currentResource;
    }

    public Page getCurrentPage() {
        return currentPage;
    }

    

}
