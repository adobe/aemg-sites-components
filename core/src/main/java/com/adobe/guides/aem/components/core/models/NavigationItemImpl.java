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

import java.util.Collections;
import java.util.List;

import org.apache.sling.api.SlingHttpServletRequest;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.components.Component;
import com.fasterxml.jackson.annotation.JsonIgnore;

public class NavigationItemImpl extends PageListItemImpl implements NavigationItem {

    protected List<NavigationItem> children = Collections.emptyList();
    protected int level;
    protected boolean active;
    public boolean selected;

    public NavigationItemImpl(Page page, boolean active, SlingHttpServletRequest request, int level, List<NavigationItem> children,
                              String parentId, Component component, boolean isSelected, String curPagePath) {
        this(page, active, request, level, children, parentId, PROP_DISABLE_SHADOWING_DEFAULT, component, isSelected);
    }

    public NavigationItemImpl(Page page, boolean active, SlingHttpServletRequest request, int level, List<NavigationItem> children,
                              String parentId, boolean isShadowingDisabled, Component component, boolean isSelected) {
        super(request, page, parentId, isShadowingDisabled, component);
        this.active = active;
        this.level = level;
        this.children = children;
        this.selected = isSelected;
    }

    @Override
    @JsonIgnore
    @Deprecated
    public Page getPage() {
        return page;
    }

    @Override
    public boolean isActive() {
        return active;
    }

    @Override
    public List<NavigationItem> getChildren() {
        return children;
    }

    @Override
    public int getLevel() {
        return level;
    }
}
