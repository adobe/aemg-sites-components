/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.adobe.guides.aem.components.core.models;

import com.day.cq.commons.inherit.HierarchyNodeInheritanceValueMap;
import com.day.cq.commons.inherit.InheritanceValueMap;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.NameConstants;
import org.apache.commons.text.WordUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.settings.SlingSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.inject.Named;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.api.resource.ResourceResolver;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MetaDataModel {

    private static final Logger logger = LoggerFactory.getLogger(MetaDataModel.class);

    private static final String DITAMETA_NODE_NAME = "ditameta";
    private static final String DITAMETA_AUTHOR_NODE_NAME = "author";

    private static final String BASELINE_ATTRIBUTE_NAME = "baseline";
    private static final String LAST_MODIFIED_ATTRIBUTE_NAME = "cq:lastModified";
    private static final String LAST_REPLICATED_ATTRIBUTE_NAME = "cq:lastReplicated";
    private static final String LAST_REPLICATION_ACTION_ATTRIBUTE_NAME = "cq:lastReplicationAction";
    private static final String PDFPATH_ATTRIBUTE_NAME = "pdfPath";


    private String title;

    private String description;

    private String pdfPath;

    private Map<String, String> creators = new HashMap<>();

    private Map<String, String> contributors = new HashMap<>();

    private String copyRights;

    private String documentState;

    @Inject
    private String reviewStatus;

    @Inject
    private String baseline;

    @Inject
    @Named(LAST_MODIFIED_ATTRIBUTE_NAME)
    private Calendar lastModified;

    @Inject
    @Named(LAST_REPLICATED_ATTRIBUTE_NAME)
    private Calendar lastReplicated;

    @Inject
    @Named(LAST_REPLICATION_ACTION_ATTRIBUTE_NAME)
    private String lastReplicationAction;

    private String lastUpdated;

    private String lastPublished;

    @Inject
    @ScriptVariable
    private Page currentPage;

    @Inject
    private InheritanceValueMap inheritedPageProperties;


    private String datetimePattern;
    private String locale;
    private DateTimeFormatter formatter;

    @Inject
    private ResourceResolver resolver;

    @OSGiService
    private SlingSettingsService slingSettingsService;

    private String pageTitle;

    @PostConstruct
    public void init() {
        //logger.debug(" currentPage -> {}", currentPage);
        if (currentPage == null) {
            return;
        }
        Resource pageContent = currentPage.getContentResource();
        //logger.debug("pageContent -> {}", pageContent);
        if (pageContent == null) {
            return;
        }
        if(resolver == null) {resolver = pageContent.getResourceResolver();}
        ValueMap attributes = pageContent.getValueMap();
        if(inheritedPageProperties == null) {
            inheritedPageProperties = new HierarchyNodeInheritanceValueMap(pageContent);
        }
        if(inheritedPageProperties != null) {
            this.pdfPath = inheritedPageProperties.getInherited(PDFPATH_ATTRIBUTE_NAME, String.class);
            this.baseline = inheritedPageProperties.getInherited(BASELINE_ATTRIBUTE_NAME, String.class);
        }
        Resource ditametares = pageContent.getChild(DITAMETA_NODE_NAME);
        ValueMap ditameta = null;
        if (ditametares != null) {
            ditameta = ditametares.getValueMap();
        }
        if(datetimePattern == null) {
            datetimePattern = "MMM dd, yyyy";
            if(locale == null) {
                locale = Locale.ENGLISH.toLanguageTag();
            }
            formatter = DateTimeFormatter.ofPattern(datetimePattern).withLocale(Locale.forLanguageTag(locale));
        } else {
            formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
        }
        //logger.debug("attributes -> {}" , attributes);
        this.title = attributes.get("dc:title", String.class);
        this.description = attributes.get("dc:description", String.class);
        this.documentState = attributes.get("docstate", String.class);
        this.pageTitle = attributes.get("jcr:title", String.class);

        String creatorsText = attributes.get("dc:creator", String.class);
        List<String> contributorList = new ArrayList<>();
        if (creatorsText != null) {
            contributorList.addAll(List.of(creatorsText.split(",")));
        }
        String contributorsText = attributes.get("dc:contributor", String.class);
        if (contributorsText != null) {
            contributorList.addAll(List.of(contributorsText.split(",")));
        }
        if (ditameta != null) {
            if (creatorsText == null && contributorsText == null) {
                String[] creatorsTextArray = ditameta.get(DITAMETA_AUTHOR_NODE_NAME + "/" + "text", String[].class);
                logger.debug("creatorsTextArray -> {}", creatorsTextArray != null ? List.of(creatorsTextArray) : "");
                List<String> creatorsTextList;
                if (creatorsTextArray != null && creatorsTextArray.length > 0) {
                    creatorsTextList = List.of(creatorsTextArray);
                    creatorsTextList = creatorsTextList.stream().map(c -> {
                        c = WordUtils.capitalize(c);
                        return c;
                    }).collect(Collectors.toList());
                    contributorList.addAll(creatorsTextList);
                }
            }
        }
        for (String contributor : contributorList) {
            String C;
            String[] parts = contributor.split(" ");
            if (parts.length > 1) {
                C = String.valueOf(parts[0].charAt(0) + "" + parts[1].charAt(0));
            } else {
                C = String.valueOf(parts[0].charAt(0));
            }
            if (this.contributors.size() <= 5) {
                this.contributors.put(C, contributor);
            }
        }
        this.copyRights = attributes.get("dc:rights", String.class);

        if (this.lastModified == null) {
            this.lastModified = attributes.get(NameConstants.PN_PAGE_LAST_MOD, Calendar.class);
        }
        if (this.lastReplicated == null) {
            this.lastReplicated = attributes.get(NameConstants.PN_PAGE_LAST_REPLICATED, Calendar.class);
        }

        if (slingSettingsService.getRunModes().contains("author")) {
            if (this.lastReplicationAction == null) {
                this.lastReplicationAction = attributes.get(NameConstants.PN_PAGE_LAST_REPLICATION_ACTION, String.class);
            }

            if (lastReplicationAction == null || !lastReplicationAction.equals("Activated")) {
                lastReplicated = null;
            }
        } else {
            if(lastModified == null) {
                lastModified = attributes.get(JcrConstants.JCR_CREATED, Calendar.class);
            }
            if(lastReplicated == null) {
                this.lastReplicated = currentPage.getProperties().get(JcrConstants.JCR_CREATED, Calendar.class);
            }
        }

        if (lastModified != null) {
            //lastUpdated = DateTimeFormatter.ofPattern(pattern).format(lastModified.toInstant());
            lastUpdated = Instant.ofEpochMilli(lastModified.getTimeInMillis())
                    .atZone(ZoneId.of("UTC"))
                    .format(formatter);
        }
        if (lastReplicated != null) {
            lastPublished = formatter.format(Instant.ofEpochMilli(lastReplicated.getTimeInMillis()).atZone(ZoneId.of("UTC")));
        }


    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Map<String, String> getCreators() {
        return creators;
    }

    public Map<String, String> getContributors() {
        return contributors;
    }

    public String getCopyRights() {
        return copyRights;
    }

    public String getDocumentState() {
        return documentState;
    }

    public String getReviewStatus() {
        return reviewStatus;
    }

    public String getBaseline() {
        return baseline;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public String getLastPublished() {
        return lastPublished;
    }

    public Page getCurrentPage() {
        return currentPage;
    }

    public String getPdfPath() {
        return pdfPath;
    }

    public String getPageTitle() {
        return pageTitle;
    }
}
