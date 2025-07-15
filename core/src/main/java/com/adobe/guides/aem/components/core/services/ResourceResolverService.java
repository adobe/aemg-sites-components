package com.adobe.guides.aem.components.core.services;


import org.apache.sling.api.resource.ResourceResolver;

import javax.jcr.Session;

public interface ResourceResolverService {

    public ResourceResolver getServiceResourceResolver();


    public Session getServiceSession();


    public void closeResourceResolver(ResourceResolver resourceResolver);


    public void closeSession(Session session);
}
