package com.adobe.guides.aem.components.core.linklocalization;

import org.apache.sling.caconfig.annotation.Configuration;
import org.apache.sling.caconfig.annotation.Property;

@Configuration(label = "Link Localization Rule",
        description = "URL pattern shared by a set of link hosts", collection = true)
public @interface LinkLocalizationRule {

    @Property(label = "Hosts", description = "Link hosts this rule applies to, e.g. www.adobe.com")
    String[] hosts() default {};

    @Property(label = "Pattern",
            description = "PATH_PREFIX inserts the code as the first path segment; "
                    + "QUERY_PARAMETER sets the code as the value of the query parameter")
    String pattern() default "";

    @Property(label = "Query parameter", description = "Query parameter name used by the QUERY_PARAMETER pattern")
    String queryParameter() default "";

    @Property(label = "Locale codes", description = "Page locale to URL code mappings, e.g. ja=jp")
    String[] localeCodes() default {};
}
