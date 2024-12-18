/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2022 Adobe Systems Incorporated
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

import com.adobe.cq.wcm.core.components.models.Component;
import org.osgi.annotation.versioning.ConsumerType;


@ConsumerType
public interface Minitoc extends Component {

    /**
     * Returns starting of the range of heading in the minitoc.
     *
     * @return start number of heading type(h1-h6) minitoc 
     */
    int getStart();

     /**
     * Returns ending of the range of heading in the minitoc.
     *
     * @return end number of heading type(h1-h6) minitoc 
     */
    int getEnd();
    /**
     * Returns title of the minitoc component.
     *
     */
    String getTitle();
}
