<!--
Copyright 2022 Adobe Systems Incorporated

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
TOC List (v1)
====
TOC List component written in HTL.

Renders the top-level (depth 1) entries of the Guides site TOC as cards, using the same look as the
Category List component. The TOC is read from the `guides-navigation` binary property on
`<sitePath>/jcr:content`, where `sitePath` is a property of the current page's `jcr:content`
(same source as the Guides Side Navigation component). Only visible root-level entries are rendered;
their children are not. Entries with `active: false` are rendered without a link.

## BEM Description
```
BLOCK cmp-toc-list
    ELEMENT toc-list
    ELEMENT cmp-toc-list-group
    ELEMENT toc-list-card
    ELEMENT toc-list-card-icon
    ELEMENT toc-list-card-text
    ELEMENT toc-list-card-title
    ELEMENT toc-list-card-chevron
```

## Information
* **Vendor**: Adobe
* **Version**: v1
* **Compatibility**: AEM 6.5
* **Status**: production-ready