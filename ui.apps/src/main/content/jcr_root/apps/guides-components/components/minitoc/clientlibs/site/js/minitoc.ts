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


class MiniTOC {
    tagList: any
    headings: any
    expand_mini_toc_btn = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<g id=\"Frame\">\n" +
        "<path id=\"iconFill\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15 9.00006C15 9.13097 14.9742 9.26059 14.924 9.38149C14.8738 9.50238 14.8002 9.61218 14.7075 9.70456L10.716 13.6946C10.6277 13.7994 10.5188 13.8849 10.3961 13.9459C10.2734 14.0068 10.1394 14.0419 10.0026 14.049C9.86573 14.056 9.7289 14.0348 9.60057 13.9868C9.47224 13.9388 9.35515 13.8649 9.25658 13.7697C9.158 13.6745 9.08003 13.5601 9.02752 13.4335C8.97501 13.307 8.94907 13.1709 8.95131 13.0339C8.95354 12.8969 8.98392 12.7618 9.04054 12.6371C9.09716 12.5123 9.17882 12.4005 9.28046 12.3086L9.30496 12.2841L12.5905 9.00006L9.30446 5.71506C9.13453 5.52698 9.04237 5.28138 9.04661 5.02794C9.05086 4.77449 9.15119 4.53212 9.32732 4.34983C9.50345 4.16754 9.74223 4.05894 9.99538 4.04599C10.2485 4.03303 10.4971 4.1167 10.691 4.28006L10.7155 4.30456L14.707 8.29456C14.7999 8.38702 14.8737 8.49696 14.9239 8.61804C14.9742 8.73912 15.0001 8.86895 15 9.00006Z\" fill=\"#222222\"/>\n" +
        "<path id=\"iconFill_2\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8.99991 9.00003C8.99995 9.13094 8.97413 9.26056 8.92393 9.38146C8.87374 9.50236 8.80015 9.61215 8.70741 9.70453L4.71591 13.6945C4.62781 13.7997 4.51899 13.8857 4.39623 13.947C4.27348 14.0084 4.13941 14.0438 4.00237 14.0511C3.86533 14.0584 3.72826 14.0374 3.59969 13.9894C3.47111 13.9415 3.35378 13.8676 3.25501 13.7723C3.15623 13.677 3.07812 13.5624 3.02554 13.4357C2.97296 13.3089 2.94703 13.1727 2.94936 13.0355C2.9517 12.8983 2.98225 12.763 3.03912 12.6381C3.09599 12.5132 3.17795 12.4014 3.27991 12.3095L3.30441 12.285L6.59041 9.00003L3.30441 5.71503C3.13372 5.52703 3.04095 5.28113 3.04492 5.02723C3.04888 4.77333 3.14929 4.53045 3.32576 4.34787C3.50224 4.16529 3.74157 4.05668 3.99518 4.04408C4.2488 4.03148 4.49771 4.11584 4.69141 4.28003L4.71591 4.30453L8.70741 8.29453C8.80027 8.38704 8.87392 8.49699 8.92412 8.61807C8.97432 8.73915 9.00008 8.86896 8.99991 9.00003Z\" fill=\"#222222\"/>\n" +
        "</g>\n" +
        "</svg>\n";
    collapse_mini_toc_btn = "<svg width=\"18\" height=\"18\" viewBox=\"0 0 18 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
        "<g id=\"Frame\">\n" +
        "<path id=\"iconFill\" d=\"M16.5 12H6.5C6.22386 12 6 12.2239 6 12.5V13.5C6 13.7761 6.22386 14 6.5 14H16.5C16.7761 14 17 13.7761 17 13.5V12.5C17 12.2239 16.7761 12 16.5 12Z\" fill=\"#222222\"/>\n" +
        "<path id=\"iconFill_2\" d=\"M16.5 9H6.5C6.22386 9 6 9.22386 6 9.5V10.5C6 10.7761 6.22386 11 6.5 11H16.5C16.7761 11 17 10.7761 17 10.5V9.5C17 9.22386 16.7761 9 16.5 9Z\" fill=\"#222222\"/>\n" +
        "<path id=\"iconFill_3\" d=\"M16.5 15H6.5C6.22386 15 6 15.2239 6 15.5V16.5C6 16.7761 6.22386 17 6.5 17H16.5C16.7761 17 17 16.7761 17 16.5V15.5C17 15.2239 16.7761 15 16.5 15Z\" fill=\"#222222\"/>\n" +
        "<path id=\"iconFill_4\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M1 1.33599C0.999965 1.28577 1.01506 1.2367 1.04331 1.19517C1.07157 1.15365 1.11167 1.1216 1.1584 1.1032C1.20514 1.0848 1.25633 1.0809 1.30531 1.09201C1.35428 1.10312 1.39878 1.12873 1.433 1.16549L4 3.99999L1.433 6.83449C1.39878 6.87125 1.35428 6.89686 1.30531 6.90797C1.25633 6.91908 1.20514 6.91518 1.1584 6.89678C1.11167 6.87838 1.07157 6.84633 1.04331 6.80481C1.01506 6.76328 0.999965 6.71421 1 6.66399V1.33599Z\" fill=\"#222222\"/>\n" +
        "<path id=\"iconFill_5\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M16.5 1H6.5C6.36739 1 6.24021 1.05268 6.14645 1.14645C6.05268 1.24021 6 1.36739 6 1.5V6.5C6 6.63261 6.05268 6.75979 6.14645 6.85355C6.24021 6.94732 6.36739 7 6.5 7H16.5C16.6326 7 16.7598 6.94732 16.8536 6.85355C16.9473 6.75979 17 6.63261 17 6.5V1.5C17 1.36739 16.9473 1.24021 16.8536 1.14645C16.7598 1.05268 16.6326 1 16.5 1ZM16 6H7V2H16V6Z\" fill=\"#222222\"/>\n" +
        "</g>\n" +
        "</svg>\n";
    onDocumentReady() {
        var content = document.querySelector('#topic-container')
        if(content === null) {
            return;
        }
        var minitocContainer = document.getElementsByClassName("minitoc")[0];
        var miniTOCList = document.createElement("ul");
        const htmlTag = document.getElementsByTagName('html').item(0)
        const getListOfHeadings = () => {
            let low
            let high
            try {
                const start = parseInt(minitocContainer.getAttribute("data-start") || "1")
                const end = parseInt(minitocContainer.getAttribute("data-end") || "6")
                low = Math.min(start, end)
                high = Math.max(start, end)
            } catch(e) {
                low = 1
                high = 6
            }
            let selector = ""
            for(let i=low;i<=high;i++) {
                if(i==high) {
                    selector += `h${i}`
                } else {
                    selector += `h${i},`
                }
            }
            return selector
        }
        this.headings = content.querySelectorAll(getListOfHeadings());
        this.tagList = []
        for (var i = 0; i < this.headings.length; i++) {
            var heading = this.headings[i];
            var headingLevel = parseInt(heading.tagName[1]);
            var listItem = document.createElement("li");
            listItem.classList.add(`minitoc-level`)
            listItem.classList.add(`minitoc-level-${headingLevel}`)
            var link = document.createElement("a");
            link.textContent = heading.textContent;
            if (!heading.textContent) {
                continue
            }
            if(!heading.id) {
                heading.id = `heading-id-generated-${i}`
            }
            link.href = "#" + heading.id;
            listItem.appendChild(link);
            miniTOCList.appendChild(listItem);
            this.tagList.push(listItem)
        }
        if (this.tagList.length !== 0) {
            miniTOCList.classList.add('minitoc-list')
            minitocContainer.appendChild(miniTOCList)
        } else {
            const minitocContainerSection = document.getElementsByClassName('minitoc-container')[0]
            minitocContainerSection.classList.add('force-hide')
        }

        this.tagList.forEach(tag => {
            tag.addEventListener('click', (event) => {
                event.preventDefault();
                setTimeout(() => {
                    for (let j = 0; j < this.tagList.length; j++) {
                        this.tagList[j].classList.remove('selected');
                    }
                    tag.classList.add('selected');
                    const a_tag = tag.children[0]
                    if (a_tag) {
                        let href = a_tag.attributes['href'].value
                        let target_id
                        if (href) {
                            target_id = href[0] === '#' ? href.substr(1, href.length - 1) : href
                        }
                        let targetNode
                        for (var i = 0; i < this.headings.length; i++) {
                            let heading = this.headings[i]
                            let id = heading.attributes['id'].value
                            if (id === target_id) {
                                targetNode = heading
                                break;
                            }
                        }
                        if (targetNode) {
                            const parentScrollNode = htmlTag
                            this.scrollContentWRTMinitoc(targetNode, parentScrollNode, 300)
                        }
                    }
                }, 0)
            })
        })

        window.addEventListener('scroll', this.updateSelectedTag.bind(this));
        window.addEventListener('resize', this.updateSelectedTag.bind(this));
        this.updateSelectedTag()
    }

    scrollContentWRTMinitoc(element, parentScrollNode, offset) {
        if (element.offsetTop < parentScrollNode.scrollTop || element.offsetTop + element.offsetHeight > parentScrollNode.scrollTop + parentScrollNode.clientHeight) {
            parentScrollNode.scrollTo({
                top: Math.max(element.offsetTop - offset, 0)
            });
        }
        setTimeout(() => {
            parentScrollNode.style.overflowY = ''
        }, 100)
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 100 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || (document.documentElement.clientHeight - 100)) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    updateSelectedTag() {
        for (let i = 0; i < this.headings.length; i++) {
            if (this.isInViewport(this.headings[i])) {
                for (let j = 0; j < this.tagList.length; j++) {
                    this.tagList[j].classList.remove('selected');
                }
                if(this.tagList[i]) {
                    this.tagList[i].classList.add('selected');
                }
                break;
            }
        }
    }

}

const minitoc = new MiniTOC();
document.addEventListener("DOMContentLoaded", minitoc.onDocumentReady.bind(minitoc));