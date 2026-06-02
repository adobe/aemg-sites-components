/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2026 Adobe Systems Incorporated
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

class PrologMetaInjector {

    private static PROCESSED_ATTR = 'data-prolog-processed';
    private static MAX_DEPTH = 20;
    private static SKIP_CLASSES = ['display-inline', 'tcx-empty-element', 'collapsible-tags', 'collapsed-tag', 'prolog'];
    private static DATA_ATTR_PREFIX = 'data-attr-';
    private static TCX_ATTR_PREFIX = 'data-tcx-attr-';

    private createMetaTag(name: string, content: string): void {
        if (!name || !content || !document.head) {
            return;
        }
        const trimmedName = name.trim();
        const trimmedContent = content.trim();
        const existing = document.head.querySelector(
            'meta[name="' + trimmedName + '"][content="' + trimmedContent + '"]'
        );
        if (existing) {
            return;
        }
        const meta = document.createElement('meta');
        meta.setAttribute('name', trimmedName);
        meta.setAttribute('content', trimmedContent);
        document.head.appendChild(meta);
    }

    private getTextAfterPrefix(element: Element): string {
        let text = '';
        let pastPrefix = false;
        let foundPrefix = false;
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE &&
                (node as Element).classList &&
                (node as Element).classList.contains('prefix-content')) {
                pastPrefix = true;
                foundPrefix = true;
                continue;
            }
            if (pastPrefix && node.nodeType === Node.TEXT_NODE) {
                text += (node.textContent || '');
            }
        }
        if (!foundPrefix) {
            for (let i = 0; i < element.childNodes.length; i++) {
                const node = element.childNodes[i];
                if (node.nodeType === Node.TEXT_NODE) {
                    text += (node.textContent || '');
                }
            }
        }
        return text.trim();
    }

    private getMeaningfulClassName(element: Element): string {
        if (!element || !element.classList) {
            return '';
        }
        for (let i = 0; i < element.classList.length; i++) {
            const cls = element.classList[i];
            if (PrologMetaInjector.SKIP_CLASSES.indexOf(cls) === -1) {
                return cls;
            }
        }
        return '';
    }

    private getDataAttributes(element: Element): Array<{ key: string; value: string }> {
        const result: Array<{ key: string; value: string }> = [];
        if (!element || !element.attributes) {
            return result;
        }
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            if (attr.name.indexOf(PrologMetaInjector.TCX_ATTR_PREFIX) === 0) {
                continue;
            }
            if (attr.name.indexOf(PrologMetaInjector.DATA_ATTR_PREFIX) === 0) {
                const key = attr.name.substring(PrologMetaInjector.DATA_ATTR_PREFIX.length);
                if (key && key !== 'name' && key !== 'content' && key !== 'value') {
                    result.push({ key: key, value: attr.value });
                }
            }
        }
        return result;
    }

    private processKeywords(element: Element): void {
        const keywordEls = element.querySelectorAll('.keyword');
        if (!keywordEls || keywordEls.length === 0) {
            return;
        }
        const keywords: string[] = [];
        for (let i = 0; i < keywordEls.length; i++) {
            const text = (keywordEls[i].textContent || '').trim();
            if (text) {
                keywords.push(text);
            }
        }
        if (keywords.length > 0) {
            this.createMetaTag('keywords', keywords.join(', '));
        }
    }

    private processElement(element: Element, depth: number): void {
        if (depth > PrologMetaInjector.MAX_DEPTH) {
            return;
        }

        if (!element || !element.classList) {
            return;
        }

        if (element.classList.contains('prefix-content')) {
            return;
        }

        let handled = false;

        const attrName = element.getAttribute('data-attr-name');
        const attrContent = element.getAttribute('data-attr-content');
        const attrValue = element.getAttribute('data-attr-value');

        if (attrName && attrContent) {
            this.createMetaTag(attrName, attrContent);
            handled = true;
        } else if (attrName && attrValue) {
            this.createMetaTag(attrName, attrValue);
            handled = true;
        }

        if (!handled && element.classList.contains('keywords')) {
            this.processKeywords(element);
            handled = true;
        }

        if (!handled) {
            const textAfter = this.getTextAfterPrefix(element);
            if (textAfter) {
                const className = this.getMeaningfulClassName(element);
                if (className) {
                    this.createMetaTag(className, textAfter);
                    handled = true;
                }
            }
        }

        if (!handled) {
            const dataAttrs = this.getDataAttributes(element);
            if (dataAttrs.length > 0) {
                const className = this.getMeaningfulClassName(element);
                for (const attr of dataAttrs) {
                    const metaName = className ? className + '.' + attr.key : attr.key;
                    this.createMetaTag(metaName, attr.value);
                }
            }
        }

        for (let i = 0; i < element.children.length; i++) {
            this.processElement(element.children[i], depth + 1);
        }
    }

    private initBlock(block: HTMLElement): void {
        if (block.getAttribute(PrologMetaInjector.PROCESSED_ATTR) === 'true') {
            return;
        }
        block.setAttribute(PrologMetaInjector.PROCESSED_ATTR, 'true');

        try {
            this.processElement(block, 0);
        } catch (e) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('PrologMetaInjector: failed to process prolog content', e);
            }
        }
    }

    initAllPrologBlocks(): void {
        const blocks = document.querySelectorAll<HTMLElement>('.cmp-prolog');
        for (let i = 0; i < blocks.length; i++) {
            this.initBlock(blocks[i]);
        }
    }
}

const prologMetaInjector = new PrologMetaInjector();

function initProlog(): void {
    prologMetaInjector.initAllPrologBlocks();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProlog);
} else {
    initProlog();
}

const prologObserver = new MutationObserver(() => {
    initProlog();
});
prologObserver.observe(document.body, { childList: true, subtree: true });
