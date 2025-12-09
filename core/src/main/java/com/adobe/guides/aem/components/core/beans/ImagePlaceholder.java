package com.adobe.guides.aem.components.core.beans;

/**
 * Bean class to hold image information extracted from table HTML
 */
public class ImagePlaceholder {
    private String placeholderId;
    private String imagePath;
    private String altText;
    private String title;
    private String cssClass;
    private String width;
    private String height;

    public ImagePlaceholder(String placeholderId, String imagePath, String altText, 
                           String title, String cssClass, String width, String height) {
        this.placeholderId = placeholderId;
        this.imagePath = imagePath;
        this.altText = altText;
        this.title = title;
        this.cssClass = cssClass;
        this.width = width;
        this.height = height;
    }

    public String getPlaceholderId() {
        return placeholderId;
    }

    public String getImagePath() {
        return imagePath;
    }

    public String getAltText() {
        return altText;
    }

    public String getTitle() {
        return title;
    }

    public String getCssClass() {
        return cssClass;
    }

    public String getWidth() {
        return width;
    }

    public String getHeight() {
        return height;
    }
}
