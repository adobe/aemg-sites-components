/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.adobe.guides.aem.components.core.beans;

import java.util.ArrayList;
import java.util.List;

public class TopicCardBean {
    
    private String title;
    
    private String description;
    
    private String link;
    
    private List<TopicCardBean> subTopics;

    public TopicCardBean() {
    }

    private TopicCardBean(String title, String link) {
        this.title = title;
        this.link = link;
    }
    

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<TopicCardBean> getSubTopics() {
        return subTopics;
    }

    public void setSubTopics(List<TopicCardBean> subTopics) {
        this.subTopics = subTopics;
    }
    
    public void addSubTopic(String title, String link) {
        if(this.subTopics == null) {
            subTopics = new ArrayList<>();
        }
        subTopics.add(new TopicCardBean(title, link));
    }
    
}
