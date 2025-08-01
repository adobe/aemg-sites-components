/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2017 Adobe
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
import com.adobe.cq.wcm.core.components.models.Search;
import com.adobe.cq.wcm.core.components.util.AbstractComponentImpl;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.designer.Style;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.via.ResourceSuperType;

import javax.annotation.PostConstruct;
import java.util.Optional;

/**
 * Search model implementation.
 */
@Model(adaptables = SlingHttpServletRequest.class,
        adapters = {Search.class, ComponentExporter.class},
        resourceType = SearchModel.RESOURCE_TYPE)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class SearchModel extends AbstractComponentImpl implements Search {

    /**
     * The resource type.
     */
    public static final int PROP_RESULTS_SIZE_DEFAULT = 10;
    public static final int PROP_SEARCH_TERM_MINIMUM_LENGTH_DEFAULT = 3;
    protected static final String RESOURCE_TYPE = "guides-components/components/search2";

    @Self
    @Via(type = ResourceSuperType.class)
    private Search search;
    @Self
    private SlingHttpServletRequest request;
    @ScriptVariable
    private Page currentPage;
    @ScriptVariable
    private Style currentStyle;
    private String relativePath;
    private int resultsSize;
    private int searchTermMinimumLength;
    private String searchRootPagePath;

    @PostConstruct
    private void initModel() {
        this.resultsSize = this.currentStyle.get("resultsSize", 10);
        this.searchTermMinimumLength = this.currentStyle.get("searchTermMinimumLength", 3);
        Resource currentResource = this.request.getResource();
        this.relativePath = Optional.ofNullable(this.currentPage.getPageManager().getContainingPage(currentResource)).map(Page::getPath).map((path) -> {
            return StringUtils.substringAfter(currentResource.getPath(), path);
        }).orElse(null);
    }

    @Override
    public String getSearchRootPagePath() {
        if (this.searchRootPagePath == null) {
            if (currentPage != null && currentPage.getContentResource() != null) {
                Page searchPage = null;
                java.util.Iterator<Page> matcher;
                ValueMap valueMap = currentPage.getContentResource().getValueMap();
                this.searchRootPagePath = valueMap.get("sitePath", String.class);               
                Resource siteRootResource = this.request.getResource().getResourceResolver().getResource(searchRootPagePath);
                if(siteRootResource != null){
                    Page siteRootPage = siteRootResource.adaptTo(Page.class);   //the root page of current version of a product documentation
                    if(siteRootPage != null) {
                        matcher = siteRootPage.listChildren(new SearchPageFilter());
                        if(matcher.hasNext()) {
                            searchPage = matcher.next();
                        } else {
                            matcher = siteRootPage.getParent().listChildren(new SearchPageFilter());    //find if the search page is at parent level (usually language or locale) folder
                            if(matcher.hasNext()) {
                                searchPage = matcher.next();
                            } else {
                                matcher = siteRootPage.getParent().getParent().listChildren(new SearchPageFilter());    //find if the search page is at parent level (usually language or locale) folder
                                if(matcher.hasNext()) {
                                    searchPage = matcher.next();
                                }
                            }
                        }                        
                    }                  
                } else {
                    String pageTemplate = valueMap.get("cq:template", String.class); 
                    if(pageTemplate != null && pageTemplate.contains("-search-")) {
                        searchPage = currentPage;
                    }
                }
                if(searchPage != null) {
                    this.searchRootPagePath = searchPage.getPath();
                }
            }
        }
        return this.searchRootPagePath;

    }

    public String getSearchRootPageLink() {
        this.searchRootPagePath = getSearchRootPagePath();
        if(this.searchRootPagePath != null) {
            return this.searchRootPagePath + ".html";
        }
        return null;
    }

    public int getResultsSize() {
        return this.resultsSize;
    }

    public int getSearchTermMinimumLength() {
        return this.searchTermMinimumLength;
    }

    public String getRelativePath() {
        return this.relativePath;
    }

    public String getExportedType() {
        return this.request.getResource().getResourceType();
    }

    private static class SearchPageFilter implements com.day.cq.commons.Filter<Page> {
        public boolean includes(Page page) {
            String pageTemplate = page.getProperties().get("cq:template", String.class);
            if(pageTemplate == null) {return false;}
            if(!pageTemplate.contains("-search-")) {return false;}
            return true;
        }
    }

}
