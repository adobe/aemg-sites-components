package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.wcm.core.components.models.Component;
import org.osgi.annotation.versioning.ConsumerType;

import java.util.List;
import java.util.Map;

@ConsumerType
public interface GuidesTOC extends Component {
    /**
     * Returns the list of categories present in a template.
     *
     * @return categories list if it exists and empty list otherwise
     * @since com.adobe.cq.wcm.core.components.models 11.0.0; marked <code>default</code> in 12.1.0
     */
    List<String> getGuidesNavigation();

    List<Map<String,String>> getTopicList();

    List<String> getTopicListJson();

    String getCurrentPageTocIndex();
}
