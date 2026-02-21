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

interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
    suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
    'What exactly is ColdFusion used for?',
    'What are the USPs of ColdFusion',
    'What should I do with all this chicken if I can\'t find a cold storage?'
];

const DEFAULT_BOT_RESPONSE = `Sure thing! Here are few follow up questions I can help with. You can ask your own question if you have anything specific in mind.`;

class AskDoc {
    private wrapper: HTMLElement;
    private panel: HTMLElement;
    private backdrop: HTMLElement;
    private messagesContainer: HTMLElement;
    private input: HTMLTextAreaElement;
    private sendBtn: HTMLButtonElement;
    private closeBtn: HTMLButtonElement;
    private refreshBtn: HTMLButtonElement;

    private endpoint: string;
    private welcomeMessage: string;
    private placeholder: string;
    private isOpen: boolean;
    private chatHistory: ChatMessage[];

    constructor(wrapper: HTMLElement) {
        this.wrapper = wrapper;
        this.isOpen = false;
        this.chatHistory = [];

        this.endpoint = wrapper.getAttribute('data-cmp-chat-endpoint') || '';
        this.welcomeMessage = wrapper.getAttribute('data-cmp-welcome-message') || '';
        this.placeholder = wrapper.getAttribute('data-cmp-chat-placeholder') || 'Ask me anything...';

        this.panel = wrapper.querySelector('.cmp-askdoc__panel') as HTMLElement;
        this.backdrop = wrapper.querySelector('.cmp-askdoc__backdrop') as HTMLElement;
        this.messagesContainer = wrapper.querySelector('.cmp-askdoc__messages') as HTMLElement;
        this.input = wrapper.querySelector('.cmp-askdoc__input') as HTMLTextAreaElement;
        this.sendBtn = wrapper.querySelector('.cmp-askdoc__send-btn') as HTMLButtonElement;
        this.closeBtn = wrapper.querySelector('.cmp-askdoc__header-close') as HTMLButtonElement;
        this.refreshBtn = wrapper.querySelector('.cmp-askdoc__header-refresh') as HTMLButtonElement;

        if (this.input && !this.input.getAttribute('placeholder')) {
            this.input.placeholder = this.placeholder;
        }

        this.bindEvents();
    }


    private bindEvents(): void {
        this.closeBtn.addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());
        this.refreshBtn.addEventListener('click', () => this.resetConversation());
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.input.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.input.addEventListener('input', () => {
            this.autoResize();
            this.updateSendButton();
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        window.addEventListener('askdoc:open', ((e: CustomEvent) => {
            const query = e.detail?.query || '';
            this.open(query);
        }) as EventListener);
    }

    private autoResize(): void {
        this.input.style.height = 'auto';
        this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
    }

    private updateSendButton(): void {
        const hasContent = this.input.value.trim().length > 0;
        this.sendBtn.classList.toggle('cmp-askdoc__send-btn--active', hasContent);
    }

    public open(initialQuery?: string): void {
        if (!this.isOpen) {
            this.isOpen = true;
            this.wrapper.classList.add('cmp-askdoc--open');
            document.body.style.overflow = 'hidden';

            if (this.chatHistory.length === 0) {
                this.addBotMessage(this.welcomeMessage);
            }
        }

        if (initialQuery) {
            const displayText = `Dig deeper on "${initialQuery}"`;
            this.addUserMessage(displayText);
            this.fetchBotResponse(initialQuery);
        }

        this.input.focus();
    }

    public close(): void {
        this.isOpen = false;
        this.wrapper.classList.remove('cmp-askdoc--open');
        document.body.style.overflow = '';
    }

    private resetConversation(): void {
        this.chatHistory = [];
        this.messagesContainer.innerHTML = '';
        this.addBotMessage(this.welcomeMessage);
    }

    private sendMessage(): void {
        const text = this.input.value.trim();
        if (!text) return;

        this.addUserMessage(text);
        this.input.value = '';
        this.input.style.height = 'auto';
        this.updateSendButton();

        this.fetchBotResponse(text);
    }

    private addUserMessage(text: string): void {
        const message: ChatMessage = { role: 'user', content: text };
        this.chatHistory.push(message);

        const messageEl = document.createElement('div');
        messageEl.className = 'cmp-askdoc__message cmp-askdoc__message--user';

        const bubble = document.createElement('div');
        bubble.className = 'cmp-askdoc__message-bubble';
        bubble.textContent = text;

        messageEl.appendChild(bubble);
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    private addBotMessage(text: string, suggestions?: string[]): void {
        const message: ChatMessage = { role: 'bot', content: text, suggestions };
        this.chatHistory.push(message);

        const messageEl = document.createElement('div');
        messageEl.className = 'cmp-askdoc__message cmp-askdoc__message--bot';

        const bubble = document.createElement('div');
        bubble.className = 'cmp-askdoc__message-bubble';
        bubble.innerHTML = this.markdownToHtml(text);

        messageEl.appendChild(bubble);

        if (suggestions && suggestions.length > 0) {
            const suggestionsEl = document.createElement('div');
            suggestionsEl.className = 'cmp-askdoc__suggestions';

            suggestions.forEach((suggestion) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'cmp-askdoc__suggestion-btn';
                btn.textContent = suggestion;
                btn.addEventListener('click', () => {
                    this.addUserMessage(suggestion);
                    this.fetchBotResponse(suggestion);
                });
                suggestionsEl.appendChild(btn);
            });

            messageEl.appendChild(suggestionsEl);
        }

        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    private showTypingIndicator(): HTMLElement {
        const messageEl = document.createElement('div');
        messageEl.className = 'cmp-askdoc__message cmp-askdoc__message--bot';

        const typing = document.createElement('div');
        typing.className = 'cmp-askdoc__typing';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dot.className = 'cmp-askdoc__typing-dot';
            typing.appendChild(dot);
        }

        messageEl.appendChild(typing);
        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
        return messageEl;
    }

    private fetchBotResponse(query: string): void {
        const typingEl = this.showTypingIndicator();

        if (!this.endpoint) {
            setTimeout(() => {
                this.messagesContainer.removeChild(typingEl);
                this.addBotMessage(DEFAULT_BOT_RESPONSE, DEFAULT_SUGGESTIONS);
            }, 800);
            return;
        }

        const payload: Record<string, any> = {
            question: query
        };

        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (typingEl.parentNode) {
                    this.messagesContainer.removeChild(typingEl);
                }
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success === false || response.error) {
                            this.addBotMessage('*Sorry, something went wrong. Please try again.*');
                        } else {
                            const markdown = response.answer || response.content || response.text || xhr.responseText;
                            const suggestions = response.suggestions || response.followUpQuestions || [];
                            this.addBotMessage(markdown, suggestions.length > 0 ? suggestions : undefined);
                        }
                    } catch {
                        this.addBotMessage(xhr.responseText);
                    }
                } else {
                    this.addBotMessage('*Sorry, something went wrong. Please try again.*');
                }
            }
        };
        xhr.send(JSON.stringify(payload));
    }

    private scrollToBottom(): void {
        requestAnimationFrame(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        });
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
}

window.addEventListener('DOMContentLoaded', () => {
    const wrappers = document.querySelectorAll('.cmp-askdoc');
    wrappers.forEach((wrapper) => {
        new AskDoc(wrapper as HTMLElement);
    });
});
