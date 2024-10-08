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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;
import java.util.TimeZone;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.wcm.core.components.models.ListItem;
import com.day.cq.tagging.Tag;
import com.adobe.cq.wcm.core.components.models.datalayer.PageData;
import com.adobe.cq.wcm.core.components.models.datalayer.builder.DataLayerBuilder;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.components.Component;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class PageListItemImpl extends AbstractListItemImpl implements ListItem {

    private static final Logger LOGGER = LoggerFactory.getLogger(PageListItemImpl.class);

    public static final String DATE_FORMAT = "MMMM dd, yyyy";

    /**
     * Name of the resource property that for redirecting pages will indicate if original page or redirect target page should be returned.
     * Dafault is `false`. If `true` - original page is returned. If `false` or not configured - redirect target page.
     */
    static final String PN_DISABLE_SHADOWING = "disableShadowing";
    public static final boolean PROP_DISABLE_SHADOWING_DEFAULT = false;

    protected SlingHttpServletRequest request;
    protected Page page;
    private String excerpt;

    public PageListItemImpl(@NotNull SlingHttpServletRequest request, @NotNull Page page, String parentId, boolean isShadowingDisabled,
                            Component component) {
        super(parentId, page.getContentResource(), component);
        this.request = request;
        this.page = page;
        this.parentId = parentId;

        if (!isShadowingDisabled) {
            this.page = getRedirectTarget(page)
                .filter(redirectTarget -> !redirectTarget.equals(page))
                .orElse(page);
        }
    }

    public PageListItemImpl withExcerpt(final String excerpt) {
       this.excerpt = excerpt;
       return this;
    }

    public String getExcerpt() {
        return excerpt;
    }

    @Override
    public String getURL() {
        return Utils.getURL(request, page);
    }

    @Override
    public String getTitle() {
        String title = page.getNavigationTitle();
        if (title == null) {
            title = page.getPageTitle();
        }
        if (title == null) {
            title = page.getTitle();
        }
        if (title == null) {
            title = page.getName();
        }
        return title;
    }

    @Override
    public String getDescription() {
        return StringUtils.isNotBlank(page.getDescription()) ? page.getDescription() : "";
    }

    @Override
    public Calendar getLastModified() {
        return page.getLastModified();
    }

    @Override
    public String getPath() {
        return page.getPath();
    }

    public String getTags() {
    	String tags = StringUtils.EMPTY;
    	Tag[] tagsArray = page.getTags();
    	if(tagsArray.length>0){
	    	ArrayList<String> tagList = new ArrayList<String>();
	    	for(Tag tagItem : tagsArray){
	    		tagList.add(tagItem.getTitle());
	    	}
	        tags = tagList.toString();
        }
    	return tags;
    }

    @Override
    @JsonIgnore
    public String getName() {
        return page.getName();
    }

    public String getFormattedLastModifiedDate() {
        return getFormattedDate(page.getLastModified(), DATE_FORMAT);
    }

    private String getFormattedDate(Calendar date, String format) {
        if (null == date) {
          return StringUtils.EMPTY;
        }
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        formatter.setTimeZone(TimeZone.getTimeZone("GMT"));
        return formatter.format(date.getTime());
    }

    /**
     * Get the redirect target for the specified page.
     * This method will follow a chain or redirects to the final target.
     *
     * @param page The page for which to get the redirect target.
     * @return The redirect target if found, empty if not.
     */
    @NotNull
    static Optional<Page> getRedirectTarget(@NotNull final Page page) {
        Page result = page;
        String redirectTarget;
        PageManager pageManager = page.getPageManager();
        Set<String> redirectCandidates = new LinkedHashSet<>();
        redirectCandidates.add(page.getPath());
        while (result != null && StringUtils
                .isNotEmpty((redirectTarget = result.getProperties().get("cq:redirectTarget", String.class)))) {
            result = pageManager.getPage(redirectTarget);
            if (result != null) {
                if (!redirectCandidates.add(result.getPath())) {
                    LOGGER.warn("Detected redirect loop for the following pages: {}.", redirectCandidates.toString());
                    break;
                }
            }
        }
        return Optional.ofNullable(result);
    }

    @Override
    @NotNull
    protected PageData getComponentData() {
        return DataLayerBuilder.extending(super.getComponentData()).asPage()
            .withTitle(this::getTitle)
            .withLinkUrl(this::getURL)
            .build();
    }
}
