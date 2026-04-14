/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/

class Citation {
    private popover: HTMLElement | null = null;

    private getPopover(): HTMLElement {
        if (!this.popover) {
            this.popover = document.createElement('div');
            this.popover.id = 'cite-popover';
            Object.assign(this.popover.style, {
                display: 'none',
                position: 'absolute',
                zIndex: '10000',
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '12px 16px',
                maxWidth: '480px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: '14px',
                lineHeight: '1.5'
            });
            document.body.appendChild(this.popover);
        }
        return this.popover;
    }

    private showPopover(evt: MouseEvent, element: HTMLElement): void {
        const bib = element.getAttribute('data-citation-bib');
        if (!bib) {
            return;
        }

        const popover = this.getPopover();
        popover.innerHTML = bib;
        popover.style.display = 'block';

        const sx = window.scrollX || document.documentElement.scrollLeft;
        const sy = window.scrollY || document.documentElement.scrollTop;
        popover.style.left = `${evt.clientX + sx}px`;
        popover.style.top = `${evt.clientY + sy + 20}px`;

        const rect = popover.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            popover.style.left = `${Math.max(0, window.innerWidth - rect.width - 10)}px`;
        }
        if (rect.bottom > window.innerHeight + sy) {
            popover.style.top = `${evt.clientY + sy - rect.height - 10}px`;
        }
    }

    onDocumentReady(): void {
        document.addEventListener('mouseover', (evt: MouseEvent) => {
            const target = (evt.target as Element).closest('[data-citation-bib]');
            if (target) {
                this.showPopover(evt, target as HTMLElement);
            }
        });

        document.addEventListener('mouseout', (evt: MouseEvent) => {
            const target = (evt.target as Element).closest('[data-citation-bib]');
            const relatedTarget = evt.relatedTarget as Element;
            if (target && !target.contains(relatedTarget)) {
                this.getPopover().style.display = 'none';
            }
        });

        document.addEventListener('click', (evt: MouseEvent) => {
            const target = (evt.target as Element).closest('[data-citation-bib]');
            if (target) {
                const citationId = target.getAttribute('data-citation-id');
                // Write your code here to handle the click event.
                console.log(citationId);
            }
        });
    }
}

const citation = new Citation();
document.addEventListener("DOMContentLoaded", citation.onDocumentReady.bind(citation));
