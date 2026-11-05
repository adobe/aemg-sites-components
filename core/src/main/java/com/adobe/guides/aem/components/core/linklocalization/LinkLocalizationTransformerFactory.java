package com.adobe.guides.aem.components.core.linklocalization;

import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Component;

@Component(service = TransformerFactory.class, property = {
        "pipeline.mode=global",
        "pipeline.order:Integer=100",
        "pipeline.paths=/content",
        "pipeline.contentTypes=text/html"
})
public class LinkLocalizationTransformerFactory implements TransformerFactory {

    @Override
    public Transformer createTransformer() {
        return new LinkLocalizationTransformer();
    }
}
