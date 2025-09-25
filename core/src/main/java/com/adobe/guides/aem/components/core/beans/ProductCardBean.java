package com.adobe.guides.aem.components.core.beans;

import java.util.List;

public class ProductCardBean {

    private String productTitle;

    private String productDescription;

    private String productIconPath;

    private String productLink;
    
    private List<String> productTags;

    public ProductCardBean(String productTitle, String productDescription, String productIconPath, String productLink) {
        super();
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.productIconPath = productIconPath;
        this.productLink = productLink;
    }
    
    public ProductCardBean(String productTitle, String productDescription, String productIconPath, String productLink, List<String> productTags) {
        super();
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.productIconPath = productIconPath;
        this.productLink = productLink;
        this.productTags = productTags;
    }

    public String getProductTitle() {
        return productTitle;
    }

    public void setProductTitle(String productTitle) {
        this.productTitle = productTitle;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public String getProductIconPath() {
        return productIconPath;
    }

    public void setProductIconPath(String productIconPath) {
        this.productIconPath = productIconPath;
    }

    public String getProductLink() {
        return productLink;
    }

    public void setProductLink(String productLink) {
        this.productLink = productLink;
    }
    
    public List<String> getProductTags() {
        return productTags;
    }

    public void setProductTags(List<String> productTags) {
        this.productTags = productTags;
    }
}
