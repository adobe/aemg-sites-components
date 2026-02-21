/*
 *  Copyright 2024 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const DEFAULT_MARKDOWN_RESPONSE = `Based on the provided search results, there is no evidence suggesting Adobe ColdFusion should be used for physical "cold storage" (refrigerated, long-term storage of physical goods).

However, the results indicate that **Adobe ColdFusion is a powerful, Java-based web application development platform** that is highly suitable for archival, data management, and secure storage of digital information.

Here is why you should use Adobe ColdFusion for digital cold storage/archival solutions:

- **Secure Data Archival:** ColdFusion provides robust, built-in security features to protect data, including encryption and secure authentication mechanisms, making it ideal for storing sensitive, rarely accessed, or compliance-related records.
- **Multi-Cloud Integration (AWS, Azure, GCP):** Modern ColdFusion (2021/2023 releases) has native, built-in support for cloud storage services like AWS S3 and Azure Blob, allowing you to easily move data to low-cost, long-term storage buckets.
- **Rapid Development for Data Handling:** It excels at rapidly building applications that manage, index, and query large datasets. Its tag-based syntax (CFML) allows developers to handle complex data manipulation, file system tasks, and PDF generation with less code.`;

class AskAI {
    private wrapper: HTMLElement;
    private input: HTMLInputElement;
    private clearBtn: HTMLButtonElement;
    private summary: HTMLElement;
    private content: HTMLElement;
    private body: HTMLElement;
    private toggleBtn: HTMLButtonElement;
    private toggleText: HTMLElement;
    private loading: HTMLElement;
    private copyBtn: HTMLButtonElement;
    private likeBtn: HTMLButtonElement;
    private dislikeBtn: HTMLButtonElement;
    private digDeeperBtn: HTMLButtonElement;
    private disclaimerText: HTMLElement;
    private endpoint: string;
    private isExpanded: boolean;
    private isLiked: boolean;
    private isDisliked: boolean;
    private collapsedHeight: number;

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper;
        this.isExpanded = false;
        this.isLiked = false;
        this.isDisliked = false;
        this.collapsedHeight = 150;

        this.endpoint = this.wrapper.getAttribute('data-cmp-endpoint') || '';

        this.input = this.wrapper.querySelector('#askai-input') as HTMLInputElement;
        this.clearBtn = this.wrapper.querySelector('#askai-clear') as HTMLButtonElement;
        this.summary = this.wrapper.querySelector('#askai-summary') as HTMLElement;
        this.content = this.wrapper.querySelector('#askai-content') as HTMLElement;
        this.body = this.wrapper.querySelector('#askai-body') as HTMLElement;
        this.toggleBtn = this.wrapper.querySelector('#askai-toggle') as HTMLButtonElement;
        this.toggleText = this.wrapper.querySelector('#askai-toggle-text') as HTMLElement;
        this.loading = this.wrapper.querySelector('#askai-loading') as HTMLElement;
        this.copyBtn = this.wrapper.querySelector('#askai-copy') as HTMLButtonElement;
        this.likeBtn = this.wrapper.querySelector('#askai-like') as HTMLButtonElement;
        this.dislikeBtn = this.wrapper.querySelector('#askai-dislike') as HTMLButtonElement;
        this.digDeeperBtn = this.wrapper.querySelector('#askai-dig-deeper') as HTMLButtonElement;
        this.disclaimerText = this.wrapper.querySelector('#askai-disclaimer-text') as HTMLElement;

        const placeholder = this.wrapper.getAttribute('data-cmp-placeholder') || 'Ask a question...';
        if (this.input && !this.input.getAttribute('placeholder')) {
            this.input.placeholder = placeholder;
        }

        const disclaimer = this.wrapper.getAttribute('data-cmp-disclaimer') || '';
        if (this.disclaimerText && disclaimer) {
            this.disclaimerText.textContent = disclaimer;
        }

        this.bindEvents();
        this.showDefaultResponse();
    }

    private bindEvents(): void {
        this.input.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.submitQuery();
            }
        });

        this.input.addEventListener('input', () => {
            this.clearBtn.style.display = this.input.value.trim() ? '' : 'none';
        });

        this.clearBtn.addEventListener('click', () => {
            this.input.value = '';
            this.clearBtn.style.display = 'none';
            this.input.focus();
        });

        this.toggleBtn.addEventListener('click', () => this.toggleExpand());
        this.copyBtn.addEventListener('click', () => this.copySummary());
        this.likeBtn.addEventListener('click', () => this.toggleLike());
        this.dislikeBtn.addEventListener('click', () => this.toggleDislike());

        if (this.digDeeperBtn) {
            this.digDeeperBtn.addEventListener('click', () => this.openAskDoc());
        }
    }

    private openAskDoc(): void {
        const query = this.input.value.trim();
        const event = new CustomEvent('askdoc:open', {
            detail: { query: query || '' },
            bubbles: true
        });
        window.dispatchEvent(event);
    }

    private showDefaultResponse(): void {
        this.renderMarkdown(DEFAULT_MARKDOWN_RESPONSE);
        this.summary.style.display = '';
        this.applyCollapse();
    }

    private submitQuery(): void {
        const query = this.input.value.trim();
        if (!query) return;

        this.clearBtn.style.display = '';

        if (!this.endpoint) {
            this.renderMarkdown(DEFAULT_MARKDOWN_RESPONSE);
            this.summary.style.display = '';
            this.applyCollapse();
            return;
        }

        this.summary.style.display = 'none';
        this.loading.style.display = '';

        this.resetFeedbackState();

        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                this.loading.style.display = 'none';
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        const markdown = response.answer || response.content || response.text || xhr.responseText;
                        this.renderMarkdown(markdown);
                    } catch {
                        this.renderMarkdown(xhr.responseText);
                    }
                } else {
                    this.renderMarkdown('*An error occurred while fetching the response. Please try again.*');
                }
                this.summary.style.display = '';
                this.applyCollapse();
            }
        };
        xhr.send(JSON.stringify({ question: query }));
    }

    private renderMarkdown(md: string): void {
        this.content.innerHTML = this.markdownToHtml(md);
    }

    private markdownToHtml(md: string): string {
        let html = this.escapeHtml(md);

        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });

        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

        const lines = html.split('\n');
        const result: string[] = [];
        let inList = false;
        let listType = '';
        let inParagraph = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (trimmed === '') {
                if (inList) {
                    result.push(listType === 'ul' ? '</ul>' : '</ol>');
                    inList = false;
                    listType = '';
                }
                if (inParagraph) {
                    result.push('</p>');
                    inParagraph = false;
                }
                continue;
            }

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
            if (headingMatch) {
                if (inList) { result.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false; }
                if (inParagraph) { result.push('</p>'); inParagraph = false; }
                const level = headingMatch[1].length;
                result.push(`<h${level}>${headingMatch[2]}</h${level}>`);
                continue;
            }

            const ulMatch = trimmed.match(/^[-*+]\s+(.+)/);
            if (ulMatch) {
                if (inParagraph) { result.push('</p>'); inParagraph = false; }
                if (!inList || listType !== 'ul') {
                    if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
                    result.push('<ul>');
                    inList = true;
                    listType = 'ul';
                }
                result.push(`<li>${ulMatch[1]}</li>`);
                continue;
            }

            const olMatch = trimmed.match(/^\d+\.\s+(.+)/);
            if (olMatch) {
                if (inParagraph) { result.push('</p>'); inParagraph = false; }
                if (!inList || listType !== 'ol') {
                    if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
                    result.push('<ol>');
                    inList = true;
                    listType = 'ol';
                }
                result.push(`<li>${olMatch[1]}</li>`);
                continue;
            }

            if (inList) {
                result.push(listType === 'ul' ? '</ul>' : '</ol>');
                inList = false;
                listType = '';
            }

            if (!inParagraph) {
                result.push('<p>');
                inParagraph = true;
            }
            result.push(trimmed);
        }

        if (inList) result.push(listType === 'ul' ? '</ul>' : '</ol>');
        if (inParagraph) result.push('</p>');

        return result.join('\n');
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        let escaped = div.innerHTML;
        escaped = escaped.replace(/&amp;(#\d+;)/g, '&$1');
        return escaped;
    }

    private applyCollapse(): void {
        this.isExpanded = false;
        this.body.style.maxHeight = this.collapsedHeight + 'px';
        this.body.classList.add('cmp-askai__summary-body--collapsed');
        this.toggleText.textContent = 'Show more';
        this.toggleBtn.classList.add('cmp-askai__toggle-btn--collapsed');

        requestAnimationFrame(() => {
            const scrollHeight = this.content.scrollHeight;
            if (scrollHeight <= this.collapsedHeight) {
                this.toggleBtn.style.display = 'none';
                this.body.style.maxHeight = '';
                this.body.classList.remove('cmp-askai__summary-body--collapsed');
            } else {
                this.toggleBtn.style.display = '';
            }
        });
    }

    private toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.body.style.maxHeight = this.content.scrollHeight + 'px';
            this.body.classList.remove('cmp-askai__summary-body--collapsed');
            this.toggleText.textContent = 'Show less';
            this.toggleBtn.classList.remove('cmp-askai__toggle-btn--collapsed');
        } else {
            this.body.style.maxHeight = this.collapsedHeight + 'px';
            this.body.classList.add('cmp-askai__summary-body--collapsed');
            this.toggleText.textContent = 'Show more';
            this.toggleBtn.classList.add('cmp-askai__toggle-btn--collapsed');
        }
    }

    private copySummary(): void {
        const textContent = this.content.innerText || this.content.textContent || '';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textContent).then(() => {
                this.showCopyFeedback();
            });
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = textContent;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showCopyFeedback();
        }
    }

    private showCopyFeedback(): void {
        this.copyBtn.classList.add('cmp-askai__action-btn--active');
        setTimeout(() => {
            this.copyBtn.classList.remove('cmp-askai__action-btn--active');
        }, 2000);
    }

    private toggleLike(): void {
        this.isLiked = !this.isLiked;
        if (this.isLiked) {
            this.isDisliked = false;
            this.dislikeBtn.classList.remove('cmp-askai__action-btn--active');
        }
        this.likeBtn.classList.toggle('cmp-askai__action-btn--active', this.isLiked);
    }

    private toggleDislike(): void {
        this.isDisliked = !this.isDisliked;
        if (this.isDisliked) {
            this.isLiked = false;
            this.likeBtn.classList.remove('cmp-askai__action-btn--active');
        }
        this.dislikeBtn.classList.toggle('cmp-askai__action-btn--active', this.isDisliked);
    }

    private resetFeedbackState(): void {
        this.isLiked = false;
        this.isDisliked = false;
        this.likeBtn.classList.remove('cmp-askai__action-btn--active');
        this.dislikeBtn.classList.remove('cmp-askai__action-btn--active');
        this.copyBtn.classList.remove('cmp-askai__action-btn--active');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.cmp-askai');
    wrappers.forEach((wrapper) => {
        new AskAI(wrapper as HTMLElement);
    });
});
