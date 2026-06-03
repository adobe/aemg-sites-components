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

const CURSOR_DEEPLINK = "cursor://anysphere.cursor-deeplink/mcp/install";

const MCP_SERVER_CONFIG = {
    name: "coldfusion-documentation",
    url: "https://guidesai.adobe.io/mcp",
    description: "Knowledge base for coldfusion-documentation",
    headers: {
        "X-Api-Key": "fb_sk_ZIIm5oNLfXLV1fQhPe84M3mOlNRV1jO6KA_8sBia5gQ",
    },
};

interface PageActionsMessages {
    noContent: string;
    pageCopied: string;
    pageCopyFailed: string;
    mcpMissing: string;
    mcpCopied: string;
    mcpCopyFailed: string;
    mcpConfigMissing: string;
    topicNoContent: string;
    pdfMissing: string;
}

interface PageActionsConfig {
    mcpConfig: string;
    mcpServer: string;
    mcpName: string;
    pdfPath: string;
    messages: PageActionsMessages;
}

function getConfig(root: HTMLElement): PageActionsConfig {
    return {
        mcpConfig: root.getAttribute("data-mcp-config") || "",
        mcpServer: root.getAttribute("data-mcp-server") || "",
        mcpName: root.getAttribute("data-mcp-name") || "",
        pdfPath: root.getAttribute("data-pdf-path") || "",
        messages: {
            noContent: root.getAttribute("data-msg-no-content") || "No content found to copy",
            pageCopied: root.getAttribute("data-msg-page-copied") || "Page copied to clipboard",
            pageCopyFailed: root.getAttribute("data-msg-page-copy-failed") || "Failed to copy page",
            mcpMissing: root.getAttribute("data-msg-mcp-missing") || "MCP Server configuration is missing",
            mcpCopied: root.getAttribute("data-msg-mcp-copied") || "MCP Server config copied to clipboard",
            mcpCopyFailed: root.getAttribute("data-msg-mcp-copy-failed") || "Failed to copy MCP config",
            mcpConfigMissing: root.getAttribute("data-msg-mcp-config-missing") || "MCP configuration is missing",
            topicNoContent: root.getAttribute("data-msg-topic-no-content") || "No topic content found to download",
            pdfMissing: root.getAttribute("data-msg-pdf-missing") || "PDF path is not configured",
        },
    };
}

function showToast(message: string): void {
    const existing = document.querySelector(".cmp-page-actions__toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "cmp-page-actions__toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 2000);
}

function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand("copy");
            resolve();
        } catch (e) {
            reject(e);
        } finally {
            document.body.removeChild(ta);
        }
    });
}

function buildStyledHtml(contentEl: HTMLElement): string {
    const clone = contentEl.cloneNode(true) as HTMLElement;
    const origNodes = contentEl.querySelectorAll("*");
    const cloneNodes = clone.querySelectorAll("*");

    const BASE_PROPS = [
        "color", "background-color",
        "font-size", "font-weight", "font-family", "font-style",
        "line-height", "text-align", "text-decoration",
        "margin-top", "margin-bottom", "margin-left", "margin-right",
        "padding-top", "padding-right", "padding-bottom", "padding-left",
        "border-top", "border-right", "border-bottom", "border-left",
        "white-space", "list-style-type",
    ];

    const TABLE_EXTRA_PROPS = [
        "display", "border-collapse", "border-spacing",
        "vertical-align", "width",
    ];

    for (let i = 0; i < origNodes.length; i++) {
        const orig = origNodes[i] as HTMLElement;
        const cloned = cloneNodes[i] as HTMLElement;
        const cs = window.getComputedStyle(orig);
        const display = cs.getPropertyValue("display");

        const isTableRelated =
            display.startsWith("table") ||
            orig.matches("table, thead, tbody, tfoot, tr, th, td, caption");

        const props = isTableRelated
            ? [...BASE_PROPS, ...TABLE_EXTRA_PROPS]
            : BASE_PROPS;

        const parts: string[] = [];
        for (const p of props) {
            const v = cs.getPropertyValue(p);
            if (v) parts.push(`${p}:${v}`);
        }
        if (parts.length) {
            cloned.setAttribute("style", parts.join(";"));
        }
    }

    return clone.outerHTML;
}

function copyRichContent(html: string, plainText: string): Promise<void> {
    if (navigator.clipboard && typeof ClipboardItem !== "undefined") {
        const item = new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plainText], { type: "text/plain" }),
        });
        return navigator.clipboard.write([item]);
    }
    return new Promise((resolve, reject) => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        wrapper.style.position = "fixed";
        wrapper.style.opacity = "0";
        wrapper.style.pointerEvents = "none";
        document.body.appendChild(wrapper);
        const range = document.createRange();
        range.selectNodeContents(wrapper);
        const sel = window.getSelection();
        if (!sel) {
            document.body.removeChild(wrapper);
            reject(new Error("No selection available"));
            return;
        }
        sel.removeAllRanges();
        sel.addRange(range);
        try {
            document.execCommand("copy");
            resolve();
        } catch (e) {
            reject(e);
        } finally {
            sel.removeAllRanges();
            document.body.removeChild(wrapper);
        }
    });
}

function handleCopyPage(config: PageActionsConfig): void {
    const contentEl = document.querySelector<HTMLElement>('.cmp-dita-topic-content');
    if (!contentEl) {
        showToast(config.messages.noContent);
        return;
    }

    const plainText = (contentEl.innerText || contentEl.textContent || "").trim();
    const styledHtml = buildStyledHtml(contentEl);

    copyRichContent(styledHtml, plainText)
        .then(() => showToast(config.messages.pageCopied))
        .catch(() => showToast(config.messages.pageCopyFailed));
}

function handleCopyMcp(config: PageActionsConfig): void {
    if (!config.mcpServer) {
        showToast(config.messages.mcpMissing);
        return;
    }
    copyToClipboard(config.mcpServer)
        .then(() => showToast(config.messages.mcpCopied))
        .catch(() => showToast(config.messages.mcpCopyFailed));
}

function handleConnectCursor(): void {
    const { name, ...serverConfig } = MCP_SERVER_CONFIG;
    const encodedName = encodeURIComponent(name);
    const encodedConfig = btoa(JSON.stringify(serverConfig));
    const url = `${CURSOR_DEEPLINK}?name=${encodedName}&config=${encodedConfig}`;
    window.open(url, "_self");
}

function loadHtml2Pdf(): Promise<void> {
    if (typeof (window as any).html2pdf === "function") {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2pdf"));
        document.head.appendChild(script);
    });
}

function preparePdfClone(clonedDoc: Document): void {
    const topicContainer = clonedDoc.querySelector<HTMLElement>("#topic-container");
    if (topicContainer) {
        topicContainer.style.paddingLeft = "0";
        topicContainer.style.paddingRight = "0";
        // topicContainer.style.marginLeft = "-100px";
        // topicContainer.style.marginRight = "-100px";
    }

    const boxContainer = clonedDoc.querySelector<HTMLElement>(".box-container");
    if (boxContainer) {
        boxContainer.style.maxWidth = "100%";
        boxContainer.style.padding = "0";
        boxContainer.style.margin = "0";
    }

    clonedDoc.querySelectorAll<HTMLElement>(".left-container, .right-container").forEach((el) => {
        el.style.display = "none";
    });

    const middleContainer = clonedDoc.querySelector<HTMLElement>(".middle-container");
    if (middleContainer) {
        middleContainer.style.padding = "0";
        middleContainer.style.maxWidth = "100%";
        middleContainer.style.width = "100%";
    }

    clonedDoc.querySelectorAll(".cmp-codeblock__actions").forEach((el) => el.remove());

    clonedDoc.querySelectorAll<HTMLElement>(".cmp-codeblock").forEach((el) => {
        el.style.overflow = "visible";
        el.style.borderRadius = "0";
        el.style.border = "1px solid #dadada";
        el.style.setProperty("page-break-inside", "avoid");
        el.style.setProperty("break-inside", "avoid");
    });

    clonedDoc.querySelectorAll<HTMLElement>(".cmp-codeblock__body").forEach((el) => {
        el.style.overflow = "visible";
    });

    const avoidBreak = "pre, table, thead, tbody, tr, figure, blockquote, img, .cmp-image, h1, h2, h3, h4, h5, h6";
    clonedDoc.querySelectorAll<HTMLElement>(avoidBreak).forEach((el) => {
        el.style.setProperty("page-break-inside", "avoid");
        el.style.setProperty("break-inside", "avoid");
    });
}

function generatePdf(topicEl: HTMLElement, filename: string): void {
    window.scrollTo(0, 0);
    setTimeout(() => {
        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            padding: [0, 0, 0, 0],
            filename: filename,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollY: 0,
                onclone: (clonedDoc: Document) => preparePdfClone(clonedDoc),
            },
            pagebreak: {
                mode: ["css", "legacy"],
                avoid: [
                    ".cmp-codeblock", "pre", "table", "figure",
                    "blockquote", "img", ".cmp-image",
                ],
            },
            jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
        };
        (window as any).html2pdf().set(options).from(topicEl).save();
    }, 500);
}

function handleDownloadTopic(config: PageActionsConfig): void {
    const topicEl = document.querySelector<HTMLElement>("#topic-container");
    if (!topicEl) {
        showToast(config.messages.topicNoContent);
        return;
    }

    const titleEl = topicEl.querySelector<HTMLElement>(".title h1.cmp-title__text");
    let filename = "topic.pdf";
    if (titleEl && titleEl.textContent) {
        filename = titleEl.textContent.trim().toLowerCase().replace(/\s+/g, "-") + ".pdf";
    }

    if (typeof (window as any).CreatePDFfromHTML === "function") {
        (window as any).CreatePDFfromHTML(".cmp-dita-topic-content", filename);
    } else {
        loadHtml2Pdf()
            .then(() => generatePdf(topicEl, filename))
            .catch(() => showToast(config.messages.topicNoContent));
    }
}

function handleDownloadDocument(config: PageActionsConfig): void {
    if (!config.pdfPath) {
        showToast(config.messages.pdfMissing);
        return;
    }
    const link = document.createElement("a");
    link.href = config.pdfPath;
    link.target = "_blank";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function positionMenu(trigger: HTMLElement, menu: HTMLElement): void {
    const rect = trigger.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.right = `${window.innerWidth - rect.right}px`;
}

function openPanel(root: HTMLElement): void {
    const trigger = root.querySelector<HTMLButtonElement>(".cmp-page-actions__trigger");
    const panel = root.querySelector<HTMLElement>(".cmp-page-actions__panel");
    const menu = root.querySelector<HTMLElement>(".cmp-page-actions__menu");
    if (!trigger || !panel || !menu) return;

    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    positionMenu(trigger, menu);
    document.body.style.overflow = "hidden";
}

function closePanel(root: HTMLElement): void {
    const trigger = root.querySelector<HTMLButtonElement>(".cmp-page-actions__trigger");
    const panel = root.querySelector<HTMLElement>(".cmp-page-actions__panel");
    if (!trigger || !panel) return;

    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    document.body.style.overflow = "";
}

function initPageActions(root: HTMLElement): void {
    if (root.getAttribute("data-cmp-page-actions-initialized") === "true") return;
    root.setAttribute("data-cmp-page-actions-initialized", "true");

    const config = getConfig(root);
    const trigger = root.querySelector<HTMLButtonElement>(".cmp-page-actions__trigger");
    const panel = root.querySelector<HTMLElement>(".cmp-page-actions__panel");
    const backdrop = root.querySelector<HTMLElement>(".cmp-page-actions__backdrop");
    const items = root.querySelectorAll<HTMLButtonElement>(".cmp-page-actions__item");

    if (!trigger || !panel) return;

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        if (isOpen) {
            closePanel(root);
        } else {
            openPanel(root);
        }
    });

    if (backdrop) {
        backdrop.addEventListener("click", () => closePanel(root));
    }

    items.forEach((item) => {
        item.addEventListener("click", () => {
            const action = item.getAttribute("data-action");
            closePanel(root);

            switch (action) {
                case "copy-page":
                    handleCopyPage(config);
                    break;
                case "copy-mcp":
                    handleCopyMcp(config);
                    break;
                case "connect-cursor":
                    handleConnectCursor();
                    break;
                case "download-topic":
                    handleDownloadTopic(config);
                    break;
                case "download-document":
                    handleDownloadDocument(config);
                    break;
            }
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
            closePanel(root);
            trigger.focus();
        }
    });
}

function initAllPageActions(): void {
    const components = document.querySelectorAll<HTMLElement>("[data-cmp-page-actions]");
    components.forEach(initPageActions);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllPageActions);
} else {
    initAllPageActions();
}

const pageActionsObserver = new MutationObserver(initAllPageActions);
pageActionsObserver.observe(document.body, { childList: true, subtree: true });
