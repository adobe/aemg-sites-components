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

interface PageActionsConfig {
    copySelector: string;
    mcpConfig: string;
    cursorScheme: string;
}

function getConfig(root: HTMLElement): PageActionsConfig {
    return {
        copySelector: root.getAttribute("data-copy-selector") || "#section-topic",
        mcpConfig: root.getAttribute("data-mcp-config") || '{"mcpServers":{"aemg-docs":{"command":"npx","args":["-y","@anthropic/mcp-fetch"]}}}',
        cursorScheme: root.getAttribute("data-cursor-scheme") || "cursor://anysphere.cursor-deeplink/mcp/install",
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

function handleCopyPage(config: PageActionsConfig): void {
    const contentEl = document.querySelector<HTMLElement>(config.copySelector);
    if (!contentEl) {
        showToast("No content found to copy");
        return;
    }

    const textContent = contentEl.innerText || contentEl.textContent || "";
    copyToClipboard(textContent.trim())
        .then(() => showToast("Page copied to clipboard"))
        .catch(() => showToast("Failed to copy page"));
}

function handleCopyMcp(config: PageActionsConfig): void {
    copyToClipboard(config.mcpConfig)
        .then(() => showToast("MCP Server config copied to clipboard"))
        .catch(() => showToast("Failed to copy MCP config"));
}

function handleConnectCursor(config: PageActionsConfig): void {
    const mcpConfig = config.mcpConfig;
    const encodedConfig = encodeURIComponent(btoa(mcpConfig));
    const url = `${config.cursorScheme}?config=${encodedConfig}`;

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
