package com.adobe.guides.aem.components.core.services;

import com.adobe.guides.aem.components.core.utils.ComponentsResourceWrapper;
import com.adobe.guides.aem.components.core.utils.ResponseCaptureWrapper;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestDispatcherOptions;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.RequestDispatcher;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to render the Core Image Component and capture its HTML output.
 * 
 * This service enables server-side rendering of images by:
 * 1. Creating a wrapped resource with image properties
 * 2. Using RequestDispatcher to include/render the Core Image Component
 * 3. Capturing the rendered HTML output
 * 4. Returning the HTML as a String for injection into other components
 * 
 * This approach provides all benefits of the Core Image Component
 * (responsive images, lazy loading, renditions, etc.) while allowing
 * the HTML to be injected into arbitrary content.
 * 
 * IMPORTANT: This service is designed to be used ONLY by the Table Component.
 * It has no side effects and only operates when explicitly called.
 */
@Component(
    service = ImageComponentRenderer.class,
    immediate = false  // Changed to false - only activate when needed
)
public class ImageComponentRenderer {
    
    private static final Logger LOG = LoggerFactory.getLogger(ImageComponentRenderer.class);
    
    private volatile boolean active = false;
    
    /**
     * Service activation method
     */
    @org.osgi.service.component.annotations.Activate
    protected void activate() {
        active = true;
        LOG.info("ImageComponentRenderer service activated");
    }
    
    /**
     * Service deactivation method
     */
    @org.osgi.service.component.annotations.Deactivate
    protected void deactivate() {
        active = false;
        LOG.info("ImageComponentRenderer service deactivated");
    }
    
    /**
     * Resource type for AEM Core WCM Image Component v2
     */
    private static final String IMAGE_RESOURCE_TYPE = "core/wcm/components/image/v2/image";
    
    /**
     * Renders the Core Image Component with specified properties and returns the HTML.
     * 
     * This method:
     * 1. Validates inputs
     * 2. Creates a ComponentsResourceWrapper with image properties
     * 3. Uses RequestDispatcher to render the Image component
     * 4. Captures and returns the generated HTML
     * 
     * @param baseResource the base resource (typically the parent component's resource)
     * @param imageProperties properties for the image component (fileReference, alt, title, etc.)
     * @param request the current Sling HTTP request
     * @param response the current Sling HTTP response
     * @return the rendered HTML from the Image component, or empty string if rendering fails
     */
    public String renderImageComponent(Resource baseResource,
                                           Map<String, Object> imageProperties,
                                           SlingHttpServletRequest request,
                                           SlingHttpServletResponse response) {
            
            // Quick validation
            if (!active || baseResource == null || imageProperties == null || request == null || response == null) {
                return "";
            }
            
            return renderImageComponentInternal(baseResource, imageProperties, request, response);
        }
    
    /**
     * Internal method that performs the actual rendering
     * 
     * IMPORTANT: This method uses RequestDispatcher which can potentially trigger
     * recursive rendering. We protect against this by:
     * 1. Only being called when service is active
     * 2. Only being called from TableModel with explicit checks
     * 3. Catching and logging all exceptions
     */
    private String renderImageComponentInternal(Resource baseResource,
                                                Map<String, Object> imageProperties,
                                                SlingHttpServletRequest request,
                                                SlingHttpServletResponse response) {
        
            try {
                // Create a wrapped resource that delegates to the Image component
                ComponentsResourceWrapper imageResource = new ComponentsResourceWrapper(
                    baseResource,
                    IMAGE_RESOURCE_TYPE,
                    new HashMap<>(imageProperties)
                );
            
            // Create options to force Image component resource type
            RequestDispatcherOptions options = new RequestDispatcherOptions();
            options.setForceResourceType(IMAGE_RESOURCE_TYPE);
            
            // Get dispatcher and wrap response to capture output
            RequestDispatcher dispatcher = request.getRequestDispatcher(imageResource, options);
            if (dispatcher == null) {
                return "";
            }
            
            ResponseCaptureWrapper captureWrapper = new ResponseCaptureWrapper(response);
            
            // Render the Image component
            dispatcher.include(request, captureWrapper);
            
            // Return captured HTML
            return captureWrapper.getCapturedOutput();
            
        } catch (Exception e) {
            LOG.error("Error rendering image component", e);
            return "";
        }
    }
    
    /**
     * Convenience method to render an image with just the file reference.
     * Uses minimal properties - just the image path.
     * 
     * @param baseResource the base resource
     * @param imagePath the path to the image in DAM
     * @param request the current request
     * @param response the current response
     * @return the rendered HTML
     */
    public String renderImageComponent(Resource baseResource,
                                       String imagePath,
                                       SlingHttpServletRequest request,
                                       SlingHttpServletResponse response) {
        Map<String, Object> props = new HashMap<>();
        props.put("fileReference", imagePath);
        return renderImageComponent(baseResource, props, request, response);
    }
    
    /**
     * Convenience method to render an image with file reference and alt text.
     * 
     * @param baseResource the base resource
     * @param imagePath the path to the image in DAM
     * @param altText alternative text for the image
     * @param request the current request
     * @param response the current response
     * @return the rendered HTML
     */
    public String renderImageComponent(Resource baseResource,
                                       String imagePath,
                                       String altText,
                                       SlingHttpServletRequest request,
                                       SlingHttpServletResponse response) {
        Map<String, Object> props = new HashMap<>();
        props.put("fileReference", imagePath);
        if (altText != null && !altText.isEmpty()) {
            props.put("alt", altText);
        }
        return renderImageComponent(baseResource, props, request, response);
    }
}

