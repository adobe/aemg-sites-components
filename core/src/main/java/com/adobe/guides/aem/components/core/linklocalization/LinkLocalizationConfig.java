package com.adobe.guides.aem.components.core.linklocalization;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(label = "Link Localization",
        description = "Rewrites external link URLs to the page locale on localized pages")
public @interface LinkLocalizationConfig {

    @Property(label = "Excluded URLs", description = "Exact link URLs that are never localized")
    String[] excludedUrls() default {};

    @Property(label = "Excluded link attributes",
            description = "Links carrying any of these attributes are never localized, e.g. data-attr-href on DITA links")
    String[] excludedLinkAttributes() default {};
}
