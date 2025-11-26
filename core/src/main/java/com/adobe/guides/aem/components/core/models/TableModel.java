package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.services.ImageComponentRenderer;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Sling Model for the Table Component
 * 
 * This model processes HTML table input and renders images using the Core Image Component.
 * 
 * Server-Side Rendering Approach:
 * 1. Parse the input table HTML
 * 2. Find all <img> tags
 * 3. For each image, use ImageComponentRenderer to render the Core Image Component
 * 4. Capture the rendered HTML from the Image component
 * 5. Replace the <img> tag with the captured HTML
 * 6. Return complete table HTML with images already rendered
 * 
 * This approach provides all benefits of the Core Image Component (responsive images,
 * lazy loading, renditions) while allowing dynamic image injection into arbitrary HTML.
 */
@Model(
    adaptables = {Resource.class, SlingHttpServletRequest.class},
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class TableModel {

    private static final Logger LOG = LoggerFactory.getLogger(TableModel.class);

    @SlingObject
    private Resource resource;
    
    @SlingObject
    private SlingHttpServletRequest request;
    
    @SlingObject
    private SlingHttpServletResponse response;
    
    @OSGiService
    private ImageComponentRenderer imageRenderer;

    @ValueMapValue
    private String tableHtml;

    @ValueMapValue
    private boolean enableResponsive;

    @ValueMapValue
    private String tableStyle;

    private String processedTableHtml;
    private String componentId;

    @PostConstruct
    protected void init() {
        componentId = "table-" + UUID.randomUUID().toString().substring(0, 8);

        // Only process if we have content, request context, and service
        if (tableHtml != null && !tableHtml.trim().isEmpty() 
            && request != null && response != null && imageRenderer != null) {
            try {
                processTableHtmlWithServerSideRendering();
            } catch (Exception e) {
                LOG.error("Error processing table HTML", e);
                processedTableHtml = tableHtml; // Fallback to original HTML
            }
        } else {
            processedTableHtml = tableHtml != null ? tableHtml : "";
        }
    }


    /**
     * Process table HTML - replace <img> tags with Core Image Component rendered HTML
     */
    private void processTableHtmlWithServerSideRendering() {
        Document doc = Jsoup.parse(tableHtml);
        Elements imgTags = doc.select("img");

        // Process each image
        for (Element img : imgTags) {
            String src = img.attr("src");
            if (src == null || src.trim().isEmpty()) {
                continue;
            }

            // Normalize DAM path (remove /jcr:content/renditions/*)
            String normalizedSrc = normalizeDamAssetPath(src);

            // Build properties for Image component
            Map<String, Object> imageProps = new HashMap<>();
            imageProps.put("fileReference", normalizedSrc);
            
            String alt = img.attr("alt");
            if (alt != null && !alt.isEmpty()) {
                imageProps.put("alt", alt);
            } else {
                imageProps.put("isDecorative", true);
            }
            
            String title = img.attr("title");
            if (title != null && !title.isEmpty()) {
                imageProps.put("jcr:title", title);
            }

            // Render the Image component
            String imageHtml = imageRenderer.renderImageComponent(resource, imageProps, request, response);

            // Replace <img> with rendered HTML
            if (imageHtml != null && !imageHtml.trim().isEmpty()) {
                Document imageDoc = Jsoup.parseBodyFragment(imageHtml);
                Element renderedElement = imageDoc.body().children().first();
                
                if (renderedElement != null) {
                    // Fix the src attribute - Core Image Component generates servlet URLs
                    // which don't work for synthetic resources. Replace with actual DAM path.
                    Element imgElement = renderedElement.selectFirst("img");
                    if (imgElement != null && imgElement.hasAttr("src")) {
                        String generatedSrc = imgElement.attr("src");
                        // If src contains servlet path (.coreimg.), replace with direct DAM path
                        if (generatedSrc.contains(".coreimg.")) {
                            imgElement.attr("src", normalizedSrc);
                            // Also remove srcset if present (as it would also have servlet URLs)
                            imgElement.removeAttr("srcset");
                        }
                    }
                    
                    // Preserve original class attribute
                    String cssClass = img.attr("class");
                    if (cssClass != null && !cssClass.isEmpty()) {
                        renderedElement.addClass(cssClass);
                    }
                    
                    // Preserve original style attribute
                    String style = img.attr("style");
                    if (style != null && !style.isEmpty()) {
                        renderedElement.attr("style", style);
                    }
                    
                    img.replaceWith(renderedElement);   
                }
            }
        }

        // Return the processed HTML
        processedTableHtml = doc.body().html();
    }


    /**
     * Normalize DAM asset path - remove /jcr:content/renditions/* suffix
     */
    private String normalizeDamAssetPath(String assetPath) {
        if (assetPath == null || assetPath.trim().isEmpty()) {
            return assetPath;
        }
        
        int jcrContentIndex = assetPath.indexOf("/jcr:content");
        return (jcrContentIndex > 0) ? assetPath.substring(0, jcrContentIndex) : assetPath;
    }

    // ==================== Getters for HTL ====================

    /**
     * Gets the processed table HTML with images already rendered server-side
     * 
     * @return the complete table HTML with Image components rendered
     */
    public String getProcessedTableHtml() {
        return processedTableHtml;
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

    /**
     * Checks if the component has content to display
     * 
     * @return true if there is processed HTML to render
     */
    public boolean hasContent() {
        return processedTableHtml != null && !processedTableHtml.trim().isEmpty();
    }
}
