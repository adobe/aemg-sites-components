/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.beans.TopicCardBean;
import com.adobe.cq.wcm.core.components.commons.link.LinkManager;
import com.day.cq.wcm.api.Page;
import static com.day.cq.wcm.api.NameConstants.PN_DESCRIPTION;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class TopicCardModel {
    
    @Inject
    @ScriptVariable
    private Page currentPage;
    
    @Inject
    @Self
    private LinkManager linkManager;
    
    private List<TopicCardBean> topics = new ArrayList<>();
    
    @PostConstruct
    public void init() {
        if(currentPage == null) {
            return;
        }
        Page topicsParentPage = null;
        String currentPageTemplatePath = currentPage.getTemplate().getPath();
        String parentPageTemplatePath = currentPage.getParent().getTemplate().getPath();
        if(currentPageTemplatePath.equals(parentPageTemplatePath)) {    //this is product version page
            topicsParentPage = currentPage;
        } else {    //this is product root page
            Optional<Iterator<Page>> productVersionPages = Stream.of(currentPage.listChildren()).sorted((Object o1, Object o2) -> {
                Page p1 = (Page) o1;
                Page p2 = (Page) o2;
                Calendar cal1 = p1.getLastModified();
                Calendar cal2 = p2.getLastModified();
                if(cal1 != null && cal2 != null) {
                    return cal2.compareTo(cal1);    //descending order
                }
                return 0;
            }).findFirst();
             
            if(productVersionPages.isPresent()) {
                Iterator<Page> pagerator = productVersionPages.get();
                if(pagerator.hasNext()) {
                    topicsParentPage = pagerator.next();
                }
            }
        }
        if(topicsParentPage!= null) {
            Iterator<Page> firstLevelTopicPages = topicsParentPage.listChildren();
            Page topicPage; 
            while(firstLevelTopicPages.hasNext()) {
                topicPage = firstLevelTopicPages.next();
                TopicCardBean topic =  new TopicCardBean();
                
                Iterator<Page> secondLevelTopicPages = topicPage.listChildren();
                if(!secondLevelTopicPages.hasNext()) {
                    continue;   //only show the ones that have subtopics
                }
                while(secondLevelTopicPages.hasNext()) {
                    Page subtopicPage = secondLevelTopicPages.next();
                    topic.addSubTopic(subtopicPage.getTitle(), linkManager.get(subtopicPage).build().getMappedURL());
                }
                
                topic.setTitle(topicPage.getTitle());
                topic.setLink(linkManager.get(topicPage).build().getMappedURL());
                
                topics.add(topic);
            }
        }
        
    }

    public List<TopicCardBean> getTopics() {
        return topics;
    }
    
}
