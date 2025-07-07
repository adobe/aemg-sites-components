package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.wcm.core.components.commons.link.Link;
import com.adobe.cq.wcm.core.components.commons.link.LinkManager;
import com.adobe.cq.wcm.core.components.models.Component;
import com.adobe.cq.wcm.core.components.models.NavigationItem;
import com.day.cq.wcm.api.Page;

import java.util.Calendar;
import java.util.List;

public class Navigation2ItemImpl implements NavigationItem {
    Page page;
    boolean active;
    boolean current;
    boolean clickable;
    int level;
    List<NavigationItem> children;
    String parentId;
    Component component;
    LinkManager linkManager;

    public Navigation2ItemImpl(Page page, boolean active, boolean current, boolean clickable, int level, List<NavigationItem> children, LinkManager linkManager) {
        this.page = page;
        this.active = active;
        this.current = current;
        this.clickable = clickable;
        this.level = level;
        this.children = children;
        this.linkManager = linkManager;
    }

    @Override
    public Page getPage() {
        return page;
    }

    @Override
    public boolean isActive() {
        return active;
    }

    @Override
    public boolean isCurrent() {
        return current;
    }

    @Override
    public int getLevel() {
        return level;
    }

    @Override
    public List<NavigationItem> getChildren() {
        return children;
    }

    public String getParentId() {
        return parentId;
    }

    public Component getComponent() {
        return component;
    }

    @Override
    public String getPath() {
        return this.page.getPath();
    }

    @Override
    public String getName() {
        return this.page.getName();
    }

    @Override
    public Calendar getLastModified() {
        return this.page.getLastModified();
    }

    @Override
    public String getDescription() {
        return this.page.getDescription();
    }

    @Override
    public String getTitle() {
        return this.page.getTitle();
    }


    @Override
    public Link getLink() {
        return this.linkManager.get(page).build();
    }

    @Override
    public String getURL() {
        return getLink().getURL();
    }

    public boolean isClickable() {
        return clickable;
    }

}