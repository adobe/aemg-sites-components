package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.beans.CardBean;
import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class},
       adapters = {CardModel.class, ComponentExporter.class},
       resourceType = CardModel.RESOURCE_TYPE,
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME, extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CardModel implements ComponentExporter {

    public static final String RESOURCE_TYPE = "guides-components/components/card";

    private static final Logger logger = LoggerFactory.getLogger(CardModel.class);

    @ValueMapValue
    private String heading;

    @ChildResource
    private List<Resource> cardList;

    private List<CardBean> cardBeanList = new ArrayList<>();

    @PostConstruct
    public void init() {
        if (cardList != null) {
            for (Resource itemResource : cardList) {
                ValueMap valueMap = itemResource.getValueMap();
                String cardImage = valueMap.get("cardImage", String.class);
                String title = valueMap.get("title", String.class);
                String description = valueMap.get("description", String.class);
                String ctaLabel = valueMap.get("ctaLabel", String.class);
                String ctaLink = valueMap.get("ctaLink", String.class);
                CardBean cardBean = new CardBean(cardImage, title, description, ctaLabel, ctaLink);
                cardBeanList.add(cardBean);
            }
        }
    }

    public String getHeading() {
        return heading;
    }

    public List<CardBean> getCardBeanList() {
        return cardBeanList;
    }

    @Override
    public String getExportedType() {
        return RESOURCE_TYPE;
    }
}
