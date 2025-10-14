package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.beans.ImagePlaceholder;
import com.adobe.guides.aem.components.core.utils.ComponentsResourceWrapper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.safety.Safelist;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Sling Model for the Table Component
 * 
 * This model processes HTML table input, extracts images, and creates
 * delegating resources for rendering via the Core Image Component.
 * 
 * Pattern based on Adobe's Teaser component implementation.
 */
@Model(
    adaptables = {Resource.class, SlingHttpServletRequest.class},
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TableModel {

    private static final Logger LOG = LoggerFactory.getLogger(TableModel.class);
    private static final String PLACEHOLDER_PREFIX = "gu-table-img-";
    private static final String IMAGE_RESOURCE_TYPE = "core/wcm/components/image/v2/image";

    @SlingObject
    private Resource resource;

    @ValueMapValue
    private String tableHtml;

    @ValueMapValue
    private boolean enableResponsive;

    @ValueMapValue
    private String tableStyle;

    private String processedTableHtml;
    private List<ImagePlaceholder> imagePlaceholders;
    private Map<String, Resource> imageResourceMap;
    private String componentId;

    @PostConstruct
    protected void init() {
        imagePlaceholders = new ArrayList<>();
        imageResourceMap = new HashMap<>();
        componentId = "table-" + UUID.randomUUID().toString().substring(0, 8);

        if (tableHtml != null && !tableHtml.trim().isEmpty()) {
            try {
                processTableHtml();
            } catch (Exception e) {
                LOG.error("Error processing table HTML for component at path: {}", 
                         resource.getPath(), e);
                processedTableHtml = "";
            }
        } else {
            processedTableHtml = "";
        }
    }

    /**
     * Process the table HTML: extract images, create placeholders, and sanitize
     */
    private void processTableHtml() {
        Document doc = Jsoup.parse(tableHtml);
        Elements imgTags = doc.select("img");

        for (Element img : imgTags) {
            String src = img.attr("src");
            if (src == null || src.trim().isEmpty()) {
                continue; // Skip images without src
            }

            String alt = img.attr("alt");
            String title = img.attr("title");
            String cssClass = img.attr("class");
            String width = img.attr("width");
            String height = img.attr("height");

            // Generate unique placeholder ID
            String placeholderId = PLACEHOLDER_PREFIX + UUID.randomUUID().toString().substring(0, 8);

            // Create ImagePlaceholder bean
            ImagePlaceholder placeholder = new ImagePlaceholder(
                placeholderId, src, alt, title, cssClass, width, height
            );
            imagePlaceholders.add(placeholder);

            // Create a delegating resource for this image (Adobe's pattern)
            Resource imageResource = createImageResource(placeholder);
            imageResourceMap.put(placeholderId, imageResource);

            // Replace img tag with placeholder div
            Element placeholderDiv = new Element("div");
            placeholderDiv.addClass("gu-table-image-placeholder");
            placeholderDiv.attr("data-placeholder-id", placeholderId);
            if (cssClass != null && !cssClass.isEmpty()) {
                placeholderDiv.addClass(cssClass);
            }

            img.replaceWith(placeholderDiv);
            LOG.debug("Created placeholder {} for image: {}", placeholderId, src);
        }

        // Sanitize the HTML
        processedTableHtml = sanitizeHtml(doc);
    }

    /**
     * Create a delegating resource for the Image component
     * This follows Adobe's Teaser pattern using ComponentsResourceWrapper
     * 
     * @param placeholder the image placeholder with properties
     * @return a wrapped resource that can be rendered by the Image component
     */
    private Resource createImageResource(ImagePlaceholder placeholder) {
        // Prepare properties for the Image component
        Map<String, Object> imageProperties = new HashMap<>();
        imageProperties.put("fileReference", placeholder.getImagePath());
        
        if (placeholder.getAltText() != null && !placeholder.getAltText().isEmpty()) {
            imageProperties.put("alt", placeholder.getAltText());
        }
        
        if (placeholder.getTitle() != null && !placeholder.getTitle().isEmpty()) {
            imageProperties.put("jcr:title", placeholder.getTitle());
        }
        
        // Add decorative flag if no alt text (accessibility best practice)
        if (placeholder.getAltText() == null || placeholder.getAltText().isEmpty()) {
            imageProperties.put("isDecorative", true);
        }

        // Create a wrapped resource that delegates to the Image component
        // This is the Adobe pattern - wrap the current resource with image properties
        ComponentsResourceWrapper imageResource = new ComponentsResourceWrapper(
            resource,
            IMAGE_RESOURCE_TYPE,
            imageProperties
        );

        return imageResource;
    }

    /**
     * Sanitize HTML to prevent XSS attacks
     */
    private String sanitizeHtml(Document doc) {
        Safelist safelist = Safelist.relaxed()
            .addTags("table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption", 
                     "div", "span", "p", "br", "strong", "em", "a", "ul", "ol", "li")
            .addAttributes("table", "class", "id", "border", "cellspacing", "cellpadding", "style")
            .addAttributes("td", "colspan", "rowspan", "class", "style")
            .addAttributes("th", "colspan", "rowspan", "class", "style", "scope")
            .addAttributes("div", "class", "id", "data-placeholder-id")
            .addAttributes("a", "href", "target", "rel")
            .addAttributes("span", "class", "style");

        String cleanHtml = Jsoup.clean(doc.body().html(), "", safelist, 
                                        new Document.OutputSettings().prettyPrint(false));
        return cleanHtml;
    }

    // ==================== Getters for HTL ====================

    public String getProcessedTableHtml() {
        return processedTableHtml;
    }

    public List<ImagePlaceholder> getImagePlaceholders() {
        return imagePlaceholders;
    }

    /**
     * Get the wrapped image resource for a given placeholder ID
     * This resource can be rendered using data-sly-resource
     * 
     * @param placeholderId the placeholder ID
     * @return the wrapped image resource, or null if not found
     */
    public Resource getImageResource(String placeholderId) {
        return imageResourceMap.get(placeholderId);
    }

    /**
     * Get all image resources as a map (for HTL access)
     */
    public Map<String, Resource> getImageResources() {
        return imageResourceMap;
    }

    public boolean isEnableResponsive() {
        return enableResponsive;
    }

    public String getTableStyle() {
        return tableStyle != null ? tableStyle : "default";
    }

    public String getComponentId() {
        return componentId;
    }

    public boolean hasContent() {
        return processedTableHtml != null && !processedTableHtml.trim().isEmpty();
    }

    public boolean hasImages() {
        return !imagePlaceholders.isEmpty();
    }
}
