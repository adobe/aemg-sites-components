package com.adobe.guides.aem.components.core.utils;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import java.util.HashMap;
import java.util.Map;

/**
 * Resource wrapper that allows overriding the resource type and properties
 * while delegating to an underlying resource.
 * 
 * This is similar to Adobe's approach in core components for delegating
 * to child components like the Image component.
 */
public class ComponentsResourceWrapper extends ResourceWrapper {

    private final String resourceType;
    private final Map<String, Object> properties;

    /**
     * Create a resource wrapper with overridden resource type and properties
     * 
     * @param resource the underlying resource to wrap
     * @param resourceType the resource type to report
     * @param properties additional properties to overlay
     */
    public ComponentsResourceWrapper(Resource resource, String resourceType, Map<String, Object> properties) {
        super(resource);
        this.resourceType = resourceType;
        this.properties = properties != null ? new HashMap<>(properties) : new HashMap<>();
    }

    /**
     * Create a resource wrapper with just overridden resource type
     */
    public ComponentsResourceWrapper(Resource resource, String resourceType) {
        this(resource, resourceType, null);
    }

    @Override
    public String getResourceType() {
        return resourceType;
    }

    @Override
    public ValueMap getValueMap() {
        // Merge the underlying resource's properties with our overrides
        Map<String, Object> mergedProps = new HashMap<>();
        
        // Start with underlying properties
        ValueMap underlyingProps = super.getValueMap();
        if (underlyingProps != null) {
            mergedProps.putAll(underlyingProps);
        }
        
        // Overlay with our custom properties
        mergedProps.putAll(properties);
        
        // Always set the resource type
        mergedProps.put("sling:resourceType", resourceType);
        
        return new ValueMapDecorator(mergedProps);
    }

    @Override
    @SuppressWarnings("unchecked")
    public <AdapterType> AdapterType adaptTo(Class<AdapterType> type) {
        // Try to adapt from the wrapped resource first
        AdapterType adapted = super.adaptTo(type);
        if (adapted != null) {
            return adapted;
        }
        
        // If ValueMap is requested, return our merged value map
        if (type == ValueMap.class) {
            return (AdapterType) getValueMap();
        }
        
        return null;
    }

    /**
     * Add or update a property on this wrapper
     */
    public void setProperty(String name, Object value) {
        properties.put(name, value);
    }
}

