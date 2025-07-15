package com.adobe.guides.aem.components.core.utils;

import org.apache.commons.lang3.StringUtils;

public class LinkUtils {

    private LinkUtils() {

    }

    public static String getVaildLink(String linkUrl) {
        if(linkUrl == null) {
            return null;
        } else if ((StringUtils.startsWith(linkUrl, "/content/"))) {
            if((!StringUtils.endsWithAny(linkUrl, ".html"))) {
                linkUrl = linkUrl.concat(".html");
            }
        }
        return linkUrl;
    }

}
