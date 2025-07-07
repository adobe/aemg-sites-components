package com.adobe.guides.aem.components.core.models;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;

import java.util.ArrayList;
import java.util.List;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class RelatedTags {

    @ScriptVariable
    Page currentPage;

    public List<String> relatedTags() {
        List<String> relatedTagsString = new ArrayList<>();
        Tag[] relatedTags = currentPage.getTags();
        for (Tag tag : relatedTags) {
            relatedTagsString.add(tag.getTitle());
        }
        return relatedTagsString;
    }
}
