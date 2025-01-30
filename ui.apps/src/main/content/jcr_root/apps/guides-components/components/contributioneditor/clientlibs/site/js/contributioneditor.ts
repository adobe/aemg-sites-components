/*******************************************************************************
 * Copyright 2022 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/


// });


class GuidesContributionEditorButton {
    onDocumentReady() {
        const button = document.getElementById("contribution-editor")
        const guidesUrl = button.getAttribute("data-href")
        button.addEventListener('click', () => {
            window.open(guidesUrl, "_blank")
        })
    }
}

const guidesContributionEditorButton = new GuidesContributionEditorButton();
document.addEventListener("DOMContentLoaded", guidesContributionEditorButton.onDocumentReady.bind(guidesContributionEditorButton));