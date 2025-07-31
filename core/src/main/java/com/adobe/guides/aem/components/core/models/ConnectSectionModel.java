package com.adobe.guides.aem.components.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ConnectSectionModel {

    @SlingObject
    private Resource resource;

    private List<Card> cards = new ArrayList<>();

    @PostConstruct
    public void init() {
        if (resource != null) {
            loadCards();
        }
    }

    private void loadCards() {
        Resource cardsResource = resource.getChild("cards");
        if (cardsResource != null) {
            for (Resource cardResource : cardsResource.getChildren()) {
                ValueMap properties = cardResource.getValueMap();
                String title = properties.get("title", String.class);
                String cardTitle = properties.get("cardTitle", String.class);
                String description = properties.get("description", String.class);
                String ctaLabel = properties.get("ctaLabel", String.class);
                String ctaLink = properties.get("ctaLink", String.class);
                
                if (title != null || description != null || ctaLabel != null) {
                    cards.add(new Card(cardTitle, description, ctaLabel, ctaLink));
                }
            }
        }
    }

    public List<Card> getCards() {
        return cards;
    }

    public static class Card {
        private String title;
        private String description;
        private String ctaLabel;
        private String ctaLink;

        public Card(String title, String description, String ctaLabel, String ctaLink) {
            this.title = title;
            this.description = description;
            this.ctaLabel = ctaLabel;
            this.ctaLink = ctaLink;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }

        public String getCtaLabel() {
            return ctaLabel;
        }

        public String getCtaLink() {
            return ctaLink;
        }
    }
} 