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

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
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

async function highlightCodeBlock(block: HTMLElement): Promise<void> {
    const language = block.getAttribute("data-cmp-codeblock-language") || "plaintext";
    const codeElement = block.querySelector<HTMLElement>(".cmp-codeblock__code");

    if (!codeElement || language === "plaintext") {
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

function handleCopy(button: HTMLElement): void {
    const codeBlock = button.closest(".cmp-codeblock");
    if (!codeBlock) return;

    const codeElement = codeBlock.querySelector<HTMLElement>(".cmp-codeblock__code");
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

function initCodeBlocks(): void {
    const codeBlocks = document.querySelectorAll<HTMLElement>(".cmp-codeblock");

    codeBlocks.forEach((block) => {
        if (block.getAttribute("data-cmp-codeblock-initialized") === "true") {
            return;
        }
        block.setAttribute("data-cmp-codeblock-initialized", "true");

        highlightCodeBlock(block);

        const copyButton = block.querySelector<HTMLElement>(".cmp-codeblock__copy");
        if (copyButton) {
            copyButton.addEventListener("click", () => handleCopy(copyButton));
        }
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
