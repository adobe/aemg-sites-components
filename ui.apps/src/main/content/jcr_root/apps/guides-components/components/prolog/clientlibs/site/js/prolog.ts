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

    private static PASS_THROUGH_CLASSES = ['prolog', 'metadata'];
    private static PROCESSED_ATTR = 'data-prolog-processed';
    private static MAX_DEPTH = 10;

    private safeText(node: Element | Node | null): string {
        if (!node || !node.textContent) {
            return '';
        }
        return node.textContent.trim();
    }

    private cleanKey(raw: string): string {
        if (!raw) {
            return '';
        }
        let key = raw.trim();
        key = key.replace(/[:]\s*$/, '').trim();
        key = key.toLowerCase();
        key = key.replace(/\s+/g, '-');
        return key;
    }

    private createMetaTag(name: string, content: string): void {
        if (!name || !content || !document.head) {
            return;
        }
        const meta = document.createElement('meta');
        meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }

    private getDirectTextContent(element: Element): string {
        let text = '';
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
                text += (node.textContent || '');
            }
        }
        return text.trim();
    }

    private getPrefixContent(element: Element): Element | null {
        if (!element || !element.children) {
            return null;
        }
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            if (child.classList && child.classList.contains('prefix-content')) {
                return child;
            }
        }
        return null;
    }

    private getTextAfterPrefix(element: Element, prefixEl: Element): string {
        let text = '';
        let pastPrefix = false;
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];
            if (node === prefixEl) {
                pastPrefix = true;
                continue;
            }
            if (pastPrefix && node.nodeType === Node.TEXT_NODE) {
                text += (node.textContent || '');
            }
        }
        return text.trim();
    }

    private getChildElements(element: Element, excludePrefix: boolean): Element[] {
        if (!element || !element.children) {
            return [];
        }
        const children: Element[] = [];
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children[i];
            if (excludePrefix && child.classList && child.classList.contains('prefix-content')) {
                continue;
            }
            children.push(child);
        }
        return children;
    }

    private extractValueForCombination(element: Element, depth: number): string {
        if (depth > PrologMetaInjector.MAX_DEPTH) {
            return '';
        }

        const prefixEl = this.getPrefixContent(element);
        if (!prefixEl) {
            return this.getDirectTextContent(element) || this.safeText(element);
        }

        const textAfter = this.getTextAfterPrefix(element, prefixEl);
        const nestedChildren = this.getChildElements(element, true);

        if (nestedChildren.length === 0) {
            return textAfter || this.safeText(prefixEl);
        }

        const values: string[] = [];
        for (const child of nestedChildren) {
            const val = this.extractValueForCombination(child, depth + 1);
            if (val) {
                values.push(val);
            }
        }
        return values.join(', ');
    }

    private extractKeyAndValue(element: Element): { key: string; value: string } | null {
        const prefixEl = this.getPrefixContent(element);
        if (!prefixEl) {
            return null;
        }

        const prefixText = this.safeText(prefixEl);
        if (!prefixText) {
            return null;
        }

        const colonIdx = prefixText.indexOf(':');
        const key = this.cleanKey(colonIdx !== -1
            ? prefixText.substring(0, colonIdx)
            : prefixText);

        if (!key) {
            return null;
        }

        const textAfter = this.getTextAfterPrefix(element, prefixEl);
        const nestedChildren = this.getChildElements(element, true);

        let value: string;
        if (nestedChildren.length > 0) {
            const values: string[] = [];
            for (const child of nestedChildren) {
                const val = this.extractValueForCombination(child, 0);
                if (val) {
                    values.push(val);
                }
            }
            value = values.join(', ');
        } else if (textAfter) {
            value = textAfter;
        } else if (colonIdx !== -1) {
            value = prefixText.substring(colonIdx + 1).trim();
        } else {
            value = prefixText;
        }

        return { key, value };
    }

    private isPassThrough(element: Element): boolean {
        if (!element || !element.classList) {
            return false;
        }
        for (const cls of PrologMetaInjector.PASS_THROUGH_CLASSES) {
            if (element.classList.contains(cls)) {
                return true;
            }
        }
        return false;
    }

    private processOthermeta(element: Element): void {
        const name = element.getAttribute('data-attr-name');
        const content = element.getAttribute('data-attr-content');
        if (name && content) {
            this.createMetaTag(name.trim(), content.trim());
        }
    }

    private processKeywords(element: Element): void {
        const keywordEls = element.querySelectorAll('.keyword');
        if (!keywordEls || keywordEls.length === 0) {
            return;
        }
        const keywords: string[] = [];
        for (let i = 0; i < keywordEls.length; i++) {
            const text = this.safeText(keywordEls[i]);
            if (text) {
                keywords.push(text);
            }
        }
        if (keywords.length > 0) {
            this.createMetaTag('keywords', keywords.join(', '));
        }
    }

    private processChildren(container: Element, depth: number): void {
        if (depth > PrologMetaInjector.MAX_DEPTH) {
            return;
        }

        const children = this.getChildElements(container, true);

        for (const child of children) {
            if (!child || !child.classList) {
                continue;
            }
            if (child.classList.contains('othermeta')) {
                this.processOthermeta(child);
            } else if (child.classList.contains('keywords')) {
                this.processKeywords(child);
            } else if (this.isPassThrough(child)) {
                this.processChildren(child, depth + 1);
            } else {
                const result = this.extractKeyAndValue(child);
                if (result && result.key && result.value) {
                    this.createMetaTag(result.key, result.value);
                }
            }
        }
    }

    onDocumentReady(): void {
        const prologElement = document.querySelector('.prolog');
        if (!prologElement) {
            return;
        }

        if (prologElement.getAttribute(PrologMetaInjector.PROCESSED_ATTR) === 'true') {
            return;
        }
        prologElement.setAttribute(PrologMetaInjector.PROCESSED_ATTR, 'true');

        try {
            this.processChildren(prologElement, 0);
            (prologElement as HTMLElement).style.display = 'none';
        } catch (e) {
            if (typeof console !== 'undefined' && console.error) {
                console.error('PrologMetaInjector: failed to process prolog content', e);
            }
        }
    }
}

const prologMetaInjector = new PrologMetaInjector();
document.addEventListener('DOMContentLoaded', prologMetaInjector.onDocumentReady.bind(prologMetaInjector));
