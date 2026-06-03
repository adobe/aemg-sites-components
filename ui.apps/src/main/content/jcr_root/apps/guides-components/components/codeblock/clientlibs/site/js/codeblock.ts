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

declare var Prism: any;

const PRISM_VERSION = "1.29.0";
const PRISM_CDN = `https://cdnjs.cloudflare.com/ajax/libs/prism/${PRISM_VERSION}`;

const PRISM_LANGUAGE_MAP: Record<string, string[]> = {
    javascript: ["prism-javascript.min.js"],
    typescript: ["prism-javascript.min.js", "prism-typescript.min.js"],
    java: ["prism-java.min.js"],
    python: ["prism-python.min.js"],
    css: ["prism-css.min.js"],
    json: ["prism-json.min.js"],
    xml: ["prism-markup.min.js"],
    markup: ["prism-markup.min.js"],
    sql: ["prism-sql.min.js"],
    bash: ["prism-bash.min.js"],
    csharp: ["prism-csharp.min.js"],
    c: ["prism-c.min.js"],
    cpp: ["prism-c.min.js", "prism-cpp.min.js"],
    php: ["prism-markup.min.js", "prism-php.min.js"],
    ruby: ["prism-ruby.min.js"],
    go: ["prism-go.min.js"],
    yaml: ["prism-yaml.min.js"],
    cfscript: ["prism-clike.min.js"],
};

const COPY_ICON_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.75 18H4.25C3.00977 18 2 16.9902 2 15.75V8.25C2 7.00977 3.00977 6 4.25 6C4.66406 6 5 6.33594 5 6.75C5 7.16406 4.66406 7.5 4.25 7.5C3.83691 7.5 3.5 7.83691 3.5 8.25V15.75C3.5 16.1631 3.83691 16.5 4.25 16.5H11.75C12.1631 16.5 12.5 16.1631 12.5 15.75C12.5 15.3359 12.8359 15 13.25 15C13.6641 15 14 15.3359 14 15.75C14 16.9902 12.9902 18 11.75 18Z" fill="#292929"/>
    <path d="M6.75 5C6.33594 5 6 4.66406 6 4.25C6 3.00977 7.00977 2 8.25 2C8.66406 2 9 2.33594 9 2.75C9 3.16406 8.66406 3.5 8.25 3.5C7.83691 3.5 7.5 3.83691 7.5 4.25C7.5 4.66406 7.16406 5 6.75 5Z" fill="#292929"/>
    <path d="M13 3.5H11C10.5859 3.5 10.25 3.16406 10.25 2.75C10.25 2.33594 10.5859 2 11 2H13C13.4141 2 13.75 2.33594 13.75 2.75C13.75 3.16406 13.4141 3.5 13 3.5Z" fill="#292929"/>
    <path d="M13 14H11C10.5859 14 10.25 13.6641 10.25 13.25C10.25 12.8359 10.5859 12.5 11 12.5H13C13.4141 12.5 13.75 12.8359 13.75 13.25C13.75 13.6641 13.4141 14 13 14Z" fill="#292929"/>
    <path d="M15.75 14C15.3359 14 15 13.6641 15 13.25C15 12.8359 15.3359 12.5 15.75 12.5C16.1631 12.5 16.5 12.1631 16.5 11.75C16.5 11.3359 16.8359 11 17.25 11C17.6641 11 18 11.3359 18 11.75C18 12.9902 16.9902 14 15.75 14Z" fill="#292929"/>
    <path d="M17.25 5C16.8359 5 16.5 4.66406 16.5 4.25C16.5 3.83691 16.1631 3.5 15.75 3.5C15.3359 3.5 15 3.16406 15 2.75C15 2.33594 15.3359 2 15.75 2C16.9902 2 18 3.00977 18 4.25C18 4.66406 17.6641 5 17.25 5Z" fill="#292929"/>
    <path d="M17.25 9.75C16.8359 9.75 16.5 9.41406 16.5 9V7C16.5 6.58594 16.8359 6.25 17.25 6.25C17.6641 6.25 18 6.58594 18 7V9C18 9.41406 17.6641 9.75 17.25 9.75Z" fill="#292929"/>
    <path d="M6.75 9.75C6.33594 9.75 6 9.41406 6 9V7C6 6.58594 6.33594 6.25 6.75 6.25C7.16406 6.25 7.5 6.58594 7.5 7V9C7.5 9.41406 7.16406 9.75 6.75 9.75Z" fill="#292929"/>
    <path d="M8.25 14C7.00977 14 6 12.9902 6 11.75C6 11.3359 6.33594 11 6.75 11C7.16406 11 7.5 11.3359 7.5 11.75C7.5 12.1631 7.83691 12.5 8.25 12.5C8.66406 12.5 9 12.8359 9 13.25C9 13.6641 8.66406 14 8.25 14Z" fill="#292929"/>
</svg>`;

const CFFIDDLE_ICON_SVG = `<svg class="cmp-codeblock__cffiddle-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 15.75V4.25C18 3.00928 16.9907 2 15.75 2H4.25C3.00928 2 2 3.00928 2 4.25V7.96777C2 8.38183 2.33594 8.71777 2.75 8.71777C3.16406 8.71777 3.5 8.38183 3.5 7.96777V4.25C3.5 3.83643 3.83643 3.5 4.25 3.5H15.75C16.1636 3.5 16.5 3.83643 16.5 4.25V15.75C16.5 16.1636 16.1636 16.5 15.75 16.5H11.939C11.5249 16.5 11.189 16.8359 11.189 17.25C11.189 17.6641 11.5249 18 11.939 18H15.75C16.9907 18 18 16.9907 18 15.75Z" fill="currentColor"/>
    <path d="M11 9.75V13.9927C11 14.4067 10.6641 14.7427 10.25 14.7427C9.83594 14.7427 9.5 14.4067 9.5 13.9927V11.5605L3.03027 18.0303C2.88379 18.1768 2.69189 18.25 2.5 18.25C2.30811 18.25 2.11621 18.1768 1.96973 18.0303C1.67676 17.7373 1.67676 17.2627 1.96973 16.9697L8.43946 10.5H6.00733C5.59327 10.5 5.25733 10.1641 5.25733 9.75C5.25733 9.33594 5.59327 9 6.00733 9H10.25C10.6641 9 11 9.33594 11 9.75Z" fill="currentColor"/>
</svg>`;

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
        if (existingScript) {
            if (existingScript.getAttribute("data-loaded") === "true") {
                resolve();
            } else {
                existingScript.addEventListener("load", () => resolve());
                existingScript.addEventListener("error", () => reject(new Error(`Failed to load script: ${src}`)));
            }
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            script.setAttribute("data-loaded", "true");
            resolve();
        };
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
    });
}

function loadStylesheet(href: string): void {
    if (document.querySelector(`link[href="${href}"]`)) {
        return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

async function loadPrism(language: string): Promise<void> {
    loadStylesheet(`${PRISM_CDN}/themes/prism-tomorrow.min.css`);

    await loadScript(`${PRISM_CDN}/prism.min.js`);
    await loadScript(`${PRISM_CDN}/components/prism-clike.min.js`);

    const langFiles = PRISM_LANGUAGE_MAP[language];
    if (langFiles) {
        for (const file of langFiles) {
            await loadScript(`${PRISM_CDN}/components/${file}`);
        }
    }
}

function decodeHTMLEntities(text: string): string {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

async function highlightCodeElement(codeElement: HTMLElement, language: string): Promise<void> {
    codeElement.textContent = decodeHTMLEntities(
        (codeElement.textContent || "").replace(/<br\s*\/?>/gi, "")
    );

    if (language === "plaintext") {
        return;
    }

    try {
        await loadPrism(language);

        if (typeof Prism !== "undefined") {
            Prism.highlightElement(codeElement);
        }
    } catch (error) {
        console.warn("Code block: syntax highlighting unavailable", error);
    }
}

function createCodeBlockActions(): HTMLElement {
    const actions = document.createElement("div");
    actions.className = "cmp-codeblock__actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "cmp-codeblock__copy";
    copyBtn.type = "button";
    copyBtn.title = "Copy code";
    copyBtn.innerHTML = COPY_ICON_SVG;

    const fiddleBtn = document.createElement("button");
    fiddleBtn.className = "cmp-codeblock__cffiddle";
    fiddleBtn.type = "button";
    fiddleBtn.title = "Try CFFiddle";
    fiddleBtn.innerHTML = CFFIDDLE_ICON_SVG;
    fiddleBtn.style.display = "none";

    actions.appendChild(copyBtn);
    actions.appendChild(fiddleBtn);
    return actions;
}

function handleCopy(button: HTMLElement): void {
    const scope = button.closest(".cmp-codeblock__body");
    if (!scope) return;

    const codeElement = scope.querySelector<HTMLElement>(".cmp-codeblock__code");
    if (!codeElement) return;

    const codeText = codeElement.textContent || "";
    const copyTextLabel = button.querySelector<HTMLElement>(".cmp-codeblock__copy-text");

    navigator.clipboard.writeText(codeText).then(() => {
        if (copyTextLabel) {
            copyTextLabel.textContent = "Copied!";
        }
        button.classList.add("cmp-codeblock__copy--success");

        setTimeout(() => {
            if (copyTextLabel) {
                copyTextLabel.textContent = "Copy code";
            }
            button.classList.remove("cmp-codeblock__copy--success");
        }, 2000);
    }).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = codeText;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand("copy");
            if (copyTextLabel) {
                copyTextLabel.textContent = "Copied!";
            }
            button.classList.add("cmp-codeblock__copy--success");

            setTimeout(() => {
                if (copyTextLabel) {
                    copyTextLabel.textContent = "Copy code";
                }
                button.classList.remove("cmp-codeblock__copy--success");
            }, 2000);
        } catch (err) {
            console.warn("Code block: copy failed", err);
        }

        document.body.removeChild(textArea);
    });
}

function handleCFFiddle(button: HTMLElement): void {
    window.open("https://cffiddle.org/", "_blank", "noopener,noreferrer");

    button.classList.add("cmp-codeblock__cffiddle--opened");

    setTimeout(() => {
        button.classList.remove("cmp-codeblock__cffiddle--opened");
    }, 2000);
}

function bindActions(container: HTMLElement): void {
    const copyButton = container.querySelector<HTMLElement>(".cmp-codeblock__copy");
    if (copyButton) {
        copyButton.addEventListener("click", () => handleCopy(copyButton));
    }

    const cffiddleButton = container.querySelector<HTMLElement>(".cmp-codeblock__cffiddle");
    if (cffiddleButton) {
        cffiddleButton.addEventListener("click", () => handleCFFiddle(cffiddleButton));
    }
}

async function initBlock(block: HTMLElement): Promise<void> {
    const language = block.getAttribute("data-cmp-codeblock-language") || "plaintext";
    const codeElements = block.querySelectorAll<HTMLElement>("code.codeblock");

    for (const codeEl of Array.from(codeElements)) {
        const body = document.createElement("div");
        body.className = "cmp-codeblock__body";

        const actions = createCodeBlockActions();
        body.appendChild(actions);

        const pre = document.createElement("pre");
        pre.className = `cmp-codeblock__pre language-${language}`;
        pre.tabIndex = 0;

        codeEl.classList.add("cmp-codeblock__code", `language-${language}`);

        codeEl.parentNode!.insertBefore(body, codeEl);
        pre.appendChild(codeEl);
        body.appendChild(pre);

        await highlightCodeElement(codeEl, language);
        bindActions(body);
    }
}

function initCodeBlocks(): void {
    document.querySelectorAll<HTMLElement>(".cmp-codeblock").forEach((block) => {
        if (block.getAttribute("data-cmp-codeblock-initialized") === "true") {
            return;
        }
        block.setAttribute("data-cmp-codeblock-initialized", "true");
        initBlock(block);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCodeBlocks);
} else {
    initCodeBlocks();
}

const observer = new MutationObserver(() => {
    initCodeBlocks();
});
observer.observe(document.body, { childList: true, subtree: true });
