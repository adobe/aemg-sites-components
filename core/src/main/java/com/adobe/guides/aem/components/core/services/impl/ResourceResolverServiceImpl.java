package com.adobe.guides.aem.components.core.services.impl;

import com.adobe.guides.aem.components.core.services.ResourceResolverService;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.Session;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = ResourceResolverService.class, immediate = true)
public class ResourceResolverServiceImpl implements ResourceResolverService {

    private static final String SERVICE_USER = "admin-service";
    
    private Logger log = LoggerFactory.getLogger(ResourceResolverServiceImpl.class);

    @Reference
    private ResourceResolverFactory resourceResolverFactory;


    public ResourceResolver getServiceResourceResolver() {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put(ResourceResolverFactory.SUBSERVICE, SERVICE_USER);

        ResourceResolver resourceResolver = null;
        try {
            resourceResolver = resourceResolverFactory.getServiceResourceResolver(paramMap);
        } catch (LoginException e) {
            log.error("Failed to obtain ResourceResolver for service user: {}. Error: {}", SERVICE_USER, e.getMessage(), e);
        }
        return resourceResolver;
    }


    public Session getServiceSession() {
        ResourceResolver resourceResolver = getServiceResourceResolver();
        if (resourceResolver != null) {
            try {
                return resourceResolver.adaptTo(Session.class);
            } catch (Exception e) {
                log.error("Failed to adapt ResourceResolver to Session for service user: {}. Error: {}", SERVICE_USER, e.getMessage(), e);
            }
        } else {
            log.warn("Could not get ResourceResolver, thus session cannot be obtained.");
        }
        return null;
    }


    public void closeResourceResolver(ResourceResolver resourceResolver) {
        if (resourceResolver != null && resourceResolver.isLive()) {
            resourceResolver.close();
            log.info("ResourceResolver closed successfully.");
        } else {
            log.warn("ResourceResolver was null or not live, no need to close.");
        }
    }


    public void closeSession(Session session) {
        if (session != null && session.isLive()) {
            session.logout();
            log.info("JCR Session closed successfully.");
        } else {
            log.warn("Session was null or not live, no need to close.");
        }
    }
}
