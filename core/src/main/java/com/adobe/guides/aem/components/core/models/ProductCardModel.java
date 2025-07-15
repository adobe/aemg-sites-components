package com.adobe.guides.aem.components.core.models;

import com.adobe.guides.aem.components.core.beans.ProductCardBean;
import com.adobe.cq.wcm.core.components.commons.link.LinkManager;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.NameConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;
import javax.inject.Inject;
import javax.inject.Named;
import org.apache.jackrabbit.JcrConstants;
import org.apache.sling.models.annotations.injectorspecific.ScriptVariable;
import org.apache.sling.models.annotations.injectorspecific.Self;

@Model(adaptables = {Resource.class, SlingHttpServletRequest.class}, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ProductCardModel {

    private static final Logger logger = LoggerFactory.getLogger(ProductCardModel.class);
    
    @SlingObject
    ResourceResolver resourceResolver;
    
    @Inject
    @ScriptVariable
    private Page currentPage;
    
    @Inject
    @Named("jcr:title")
    private String title;
    
    @Inject
    @Named("jcr:description")
    private String description;
    
    @Inject
    @Named("thumbnail")
    private String thumbnail;
    
    @Inject
    @Named("link")
    private String link;

    
    @Inject
    @Self
    private LinkManager linkManager;
    
    private PageManager pageManager;

    private List<ProductCardBean> productCardBeanList = new ArrayList<>();

    @PostConstruct
    public void init() {
        if (currentPage == null) {
            logger.error("could not inject currentPage into Sling Mode; cannot render product cards");
            return;
        }
        logger.info("Fetching product pages for site : {}", currentPage.getPath());
        pageManager = resourceResolver.adaptTo(PageManager.class);
        
        Locale locale = currentPage.getLanguage();
        if(locale == null) {
            logger.debug("could not determine locale for roor page of site : {}; skipping...", currentPage.getPath());
            return;
        }
        
        String languageCode = locale.getLanguage();
        String languageTag =locale.toLanguageTag();
        String localeTag = languageTag.replace("-", "_").toLowerCase();
        Page parent;
        if(currentPage.getName().replace("-", "_").toLowerCase().equals(languageTag)) {
            parent = currentPage;
        } else if(currentPage.getName().equals(languageCode)) {
            if(currentPage.hasChild(localeTag)) {
                parent = pageManager.getPage(currentPage.getPath() + "/" + localeTag);                
            } else if(currentPage.hasChild(languageTag)) {
                parent = pageManager.getPage(currentPage.getPath() + "/" + languageTag);                
            } else {
                parent = currentPage;
            }
        } else {
            if(currentPage.hasChild(languageCode)) {
                Page languagePage = pageManager.getPage(currentPage.getPath() + "/" + languageCode);
                if(languagePage.hasChild(localeTag)) {
                    parent = pageManager.getPage(currentPage.getPath() + "/" + languageCode + "/" + localeTag);                
                } else if(languagePage.hasChild(languageTag)) {
                    parent = pageManager.getPage(currentPage.getPath() + "/" + languageTag);                
                } else {
                    parent = languagePage;
                }
            } else if(currentPage.hasChild(localeTag)) {
                parent = pageManager.getPage(currentPage.getPath() + "/" + localeTag);                
            } else if(currentPage.hasChild(languageTag)) {
                parent = pageManager.getPage(currentPage.getPath() + "/" + languageTag);                
            } else {
                parent = currentPage;
            }          
        } 
        logger.debug("the parent page for product pages is : {}", parent.getPath());
        
        List<Page> productPages = getProductPages(parent);
        for(Page productPage : productPages) {
            ValueMap attributes = productPage.getContentResource().getValueMap();
        
            String productTitle = Optional.ofNullable(attributes.get(com.day.cq.commons.jcr.JcrConstants.JCR_TITLE, String.class)).orElse("Untitled Product");
            String productDescription = Optional.ofNullable(attributes.get(com.day.cq.commons.jcr.JcrConstants.JCR_DESCRIPTION, String.class)).orElse("No description available");
            String productThumbnail = Optional.ofNullable(attributes.get("thumbnail", String.class)).orElse("");
            String productLink = productPage.getPath();
            if(linkManager != null) {
                productLink = linkManager.get(productLink).build().getMappedURL();
            }
            productCardBeanList.add(new ProductCardBean(productTitle, productDescription, productThumbnail, productLink));
            logger.info("Added product: {} from {}", productTitle, productPage.getPath());

        }
    }

    public List<ProductCardBean> getProductCardBeanList() {
        return productCardBeanList;
    }
    
    private String getProductPageTemplate(Page page) {
        ValueMap properties = page.getContentResource().getValueMap();
        String pageTemplate = properties.get(NameConstants.PN_TEMPLATE, String.class);
        if(pageTemplate == null) {
            logger.debug("child resource {} not a valid page", page.getPath());
            return null;
        }

        List<String> allowedTemplates = List.of(page.getParent().getContentResource().getValueMap().get(NameConstants.PN_ALLOWED_TEMPLATES, new String[] {}));  
        logger.debug("page.template -> {}, allowedTemplates -> {}", pageTemplate, List.of(allowedTemplates));
        boolean isProductPageTemplate = false;
        for(String allowedTemplate : allowedTemplates) {
            if(pageTemplate.equals(allowedTemplate) || Pattern.compile(allowedTemplate).matcher(pageTemplate).matches()) { 
                isProductPageTemplate = true;
                break;
            }
        }
        if(isProductPageTemplate) {
            return pageTemplate;
        }
        return null;
    }
    
    private List<Page> getProductPages(Page parent) {  
        List<Page> children = new ArrayList<>();
        Iterator<Page> iterator = parent.listChildren();
        while(iterator.hasNext()) {
            Page child = iterator.next();
            Resource childContentResource = child.getContentResource();
            if (childContentResource == null) {
                logger.debug("content-node missing for child page : {}", child.getPath());
                continue;
            }
            String productPageTemplate = getProductPageTemplate(child);
            if(productPageTemplate != null) {
                children.add(child);
            }            
        }        
        return children;
    }
}
