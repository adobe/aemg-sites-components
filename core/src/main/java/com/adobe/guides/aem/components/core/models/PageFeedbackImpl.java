/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2024 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

package com.adobe.guides.aem.components.core.models;

import com.adobe.cq.export.json.ComponentExporter;
import com.adobe.cq.export.json.ExporterConstants;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

@Model(adaptables = SlingHttpServletRequest.class,
       adapters = {PageFeedback.class, ComponentExporter.class},
       resourceType = {PageFeedbackImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class PageFeedbackImpl extends AbstractComponentImpl implements PageFeedback {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/pagefeedback";

    @ValueMapValue
    @Default(values = "Was this page helpful?")
    private String questionText;

    @ValueMapValue
    @Default(values = "Yes, thanks")
    private String positiveButtonText;

    @ValueMapValue
    @Default(values = "Not really")
    private String negativeButtonText;

    @ValueMapValue
    @Default(values = "We're glad. Tell us how this page helped.")
    private String positiveHeading;

    @ValueMapValue
    @Default(values = "We're sorry. Can you tell us what didn't work for you?")
    private String negativeHeading;

    @ValueMapValue
    @Default(values = "Thank you for your feedback. Your response will help improve this page.")
    private String thankYouMessage;

    @ValueMapValue
    @Nullable
    private String feedbackEndpoint;

    @Override
    public String getQuestionText() {
        return this.questionText;
    }

    @Override
    public String getPositiveButtonText() {
        return this.positiveButtonText;
    }

    @Override
    public String getNegativeButtonText() {
        return this.negativeButtonText;
    }

    @Override
    public String getPositiveHeading() {
        return this.positiveHeading;
    }

    @Override
    public String getNegativeHeading() {
        return this.negativeHeading;
    }

    @Override
    public String getThankYouMessage() {
        return this.thankYouMessage;
    }

    @Override
    public String getFeedbackEndpoint() {
        return this.feedbackEndpoint;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }
}
