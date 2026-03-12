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

interface PageActionsMessages {
    noContent: string;
    pageCopied: string;
    pageCopyFailed: string;
    mcpMissing: string;
    mcpCopied: string;
    mcpCopyFailed: string;
    mcpConfigMissing: string;
}

interface PageActionsConfig {
    mcpConfig: string;
    mcpServer: string;
    mcpName: string;
    messages: PageActionsMessages;
}

function getConfig(root: HTMLElement): PageActionsConfig {
    return {
        mcpConfig: root.getAttribute("data-mcp-config") || "",
        mcpServer: root.getAttribute("data-mcp-server") || "",
        mcpName: root.getAttribute("data-mcp-name") || "",
        messages: {
            noContent: root.getAttribute("data-msg-no-content") || "No content found to copy",
            pageCopied: root.getAttribute("data-msg-page-copied") || "Page copied to clipboard",
            pageCopyFailed: root.getAttribute("data-msg-page-copy-failed") || "Failed to copy page",
            mcpMissing: root.getAttribute("data-msg-mcp-missing") || "MCP Server configuration is missing",
            mcpCopied: root.getAttribute("data-msg-mcp-copied") || "MCP Server config copied to clipboard",
            mcpCopyFailed: root.getAttribute("data-msg-mcp-copy-failed") || "Failed to copy MCP config",
            mcpConfigMissing: root.getAttribute("data-msg-mcp-config-missing") || "MCP configuration is missing",
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

function handleConnectCursor(config: PageActionsConfig): void {
    if (!config.mcpConfig || !config.mcpName) {
        showToast(config.messages.mcpConfigMissing);
        return;
    }
    const encodedName = encodeURIComponent(config.mcpName);
    const encodedConfig = btoa(config.mcpConfig);
    const url = `${CURSOR_DEEPLINK}?name=${encodedName}&config=${encodedConfig}`;
    window.open(url, "_self");
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
                    handleConnectCursor(config);
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
