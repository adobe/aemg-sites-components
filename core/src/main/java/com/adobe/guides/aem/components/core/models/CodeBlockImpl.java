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
       adapters = {CodeBlock.class, ComponentExporter.class},
       resourceType = {CodeBlockImpl.RESOURCE_TYPE_V1})
@Exporter(name = ExporterConstants.SLING_MODEL_EXPORTER_NAME,
          extensions = ExporterConstants.SLING_MODEL_EXTENSION)
public class CodeBlockImpl extends AbstractComponentImpl implements CodeBlock {

    protected static final String RESOURCE_TYPE_V1 = "guides-components/components/codeblock";

    @ValueMapValue
    @Nullable
    private String codeText;

    @ValueMapValue
    @Nullable
    private String codeTitle;

    @ValueMapValue
    @Default(values = "plaintext")
    private String language;

    @ValueMapValue
    @Default(values = "dark")
    private String theme;

    @Override
    public String getCodeText() {
        return this.codeText;
    }

    @Override
    public String getCodeTitle() {
        return this.codeTitle;
    }

    @Override
    public String getLanguage() {
        return this.language;
    }

    @Override
    public String getTheme() {
        return this.theme;
    }

    @NotNull
    @Override
    public String getExportedType() {
        return resource.getResourceType();
    }
}
