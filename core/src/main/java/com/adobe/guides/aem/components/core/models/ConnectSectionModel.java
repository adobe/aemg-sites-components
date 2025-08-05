package com.adobe.guides.aem.components.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ConnectSectionModel {
    private static final Logger log = LoggerFactory.getLogger(ConnectSectionModel.class);

    @ValueMapValue
    private String title;
    @ValueMapValue
    private String cardIcon;
    @ValueMapValue
    private String arrowIcon;

    @ChildResource
    private List<Resource> sectionCardList;

    private List<Card> cards = new ArrayList<>();

    @PostConstruct
    public void init() {
        log.info("-------------> reached here 1");
        if (sectionCardList != null) {
        log.info("-------------> reached here 2");

            for (Resource cardResource : sectionCardList) {
        log.info("-------------> reached here 3");

                ValueMap properties = cardResource.getValueMap();
        log.info("-------------> reached here 4");

                String cardTitle = properties.get("cardTitle", String.class);
        log.info("-------------> reached here 5");

                String description = properties.get("description", String.class);
                String ctaLabel = properties.get("ctaLabel", String.class);
                String ctaLink = properties.get("ctaLink", String.class);
                cards.add(new Card(cardTitle, description, ctaLabel, ctaLink));
            }
        }
        log.info("-------------> reached here 6");

    }


    public List<Card> getCards() {
        for (Card card : cards) {
            log.info("Card title: {}", card.getCardTitle());
        }
        return cards;
    }

    public String getTitle() {
        return title;
    }

    public String getCardIcon() {
        return cardIcon;
    }

    public String getArrowIcon() {
        return arrowIcon;
    }

    public static class Card {
        private String cardTitle;
        private String description;
        private String ctaLabel;
        private String ctaLink;


        public Card(String cardTitle, String description, String ctaLabel, String ctaLink) {

            this.cardTitle = cardTitle;
            this.description = description;
            this.ctaLabel = ctaLabel;
            this.ctaLink = ctaLink;

        }


        public String getCardTitle() { return cardTitle; }
        public String getDescription() { return description; }
        public String getCtaLabel() { return ctaLabel; }
        public String getCtaLink() { return ctaLink; }
    }
} 
