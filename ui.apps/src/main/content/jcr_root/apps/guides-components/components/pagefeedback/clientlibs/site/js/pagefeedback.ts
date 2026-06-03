/*******************************************************************************
 * Copyright 2024 Adobe Systems Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
export {}

declare global {
    interface Window {
        _satellite?: { track: (ruleName: string, detail?: object) => void }
    }
}

class Pagefeedback {
    component: HTMLElement
    prompt: HTMLElement
    positiveForm: HTMLElement
    negativeForm: HTMLElement
    thankyou: HTMLElement
    yesButton: Element
    noButton: Element
    positiveSubmitButton: Element
    positiveSkipButton: Element
    negativeSubmitButton: Element
    negativeSkipButton: Element
    currentSentiment: boolean

    hideclass = 'tcx-hide'

    static readonly ANALYTICS_EVENTS = {
        HELPFUL: 'event147',
        NOT_HELPFUL: 'event136',
        COMMENT_HELPFUL: 'event137',
        COMMENT_NOT_HELPFUL: 'event138'
    }

    hideSection(section: Element) {
        section.classList.add(this.hideclass)
    }

    showSection(section: Element) {
        section.classList.remove(this.hideclass)
    }

    onDocumentReady() {
        this.component = document.getElementById("page-feedback-component")
        this.prompt = document.getElementById("page-feedback-prompt")
        this.positiveForm = document.getElementById("page-feedback-positive")
        this.negativeForm = document.getElementById("page-feedback-negative")
        this.thankyou = document.getElementById("page-feedback-thankyou")

        if (this.component === null) {
            return
        }

        this.yesButton = this.prompt.getElementsByClassName("yes-button").item(0)
        this.noButton = this.prompt.getElementsByClassName("no-button").item(0)

        this.positiveSubmitButton = this.positiveForm.getElementsByClassName("submit-button").item(0)
        this.positiveSkipButton = this.positiveForm.getElementsByClassName("skip-button").item(0)

        this.negativeSubmitButton = this.negativeForm.getElementsByClassName("submit-button").item(0)
        this.negativeSkipButton = this.negativeForm.getElementsByClassName("skip-button").item(0)

        this.subscribeEvents()
    }

    getCheckedReasons(formSection: HTMLElement): string[] {
        const checkboxes = formSection.querySelectorAll('input[type="checkbox"][name="reason"]:checked')
        const reasons: string[] = []
        checkboxes.forEach((cb: HTMLInputElement) => {
            reasons.push(cb.value)
        })
        return reasons
    }

    getSuggestionsText(formSection: HTMLElement): string {
        const textarea = formSection.getElementsByClassName("suggestions-input").item(0) as HTMLTextAreaElement
        return textarea ? textarea.value.trim() : ""
    }

    trackAnalyticsEvent(eventId: string, extraData?: Record<string, string>) {
        if (!window._satellite) {
            return
        }
        window._satellite.track('pageFeedback', {
            detail: {
                event: eventId,
                pageUrl: window.location.href,
                ...extraData
            }
        })
    }

    trackRating(isHelpful: boolean) {
        const event = isHelpful
            ? Pagefeedback.ANALYTICS_EVENTS.HELPFUL
            : Pagefeedback.ANALYTICS_EVENTS.NOT_HELPFUL
        this.trackAnalyticsEvent(event)
    }

    trackComment(isHelpful: boolean, comment: string) {
        const event = isHelpful
            ? Pagefeedback.ANALYTICS_EVENTS.COMMENT_HELPFUL
            : Pagefeedback.ANALYTICS_EVENTS.COMMENT_NOT_HELPFUL
        this.trackAnalyticsEvent(event, { comment })
    }

    buildPayload(formSection: HTMLElement, isHelpful: boolean) {
        return {
            helpful: isHelpful,
            reasons: this.getCheckedReasons(formSection),
            suggestions: this.getSuggestionsText(formSection),
            pageUrl: window.location.href,
            timestamp: Date.now()
        }
    }

    submitFeedback(payload: object) {
        const endpoint = this.component.getAttribute("data-feedback-endpoint") || ""
        console.log("submitFeedback", payload)
        if (!endpoint) {
            console.warn("[PageFeedback] No endpoint configured, logging payload:", payload)
            return
        }

        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Feedback submission failed: " + response.status)
            }
            return response.json()
        })
        .catch((error) => {
            console.error("[PageFeedback] Submission error:", error)
        })
    }

    subscribeEvents() {
        this.yesButton.addEventListener('click', () => {
            this.currentSentiment = true
            this.trackRating(true)
            this.hideSection(this.prompt)
            this.showSection(this.positiveForm)
        })

        this.noButton.addEventListener('click', () => {
            this.currentSentiment = false
            this.trackRating(false)
            this.hideSection(this.prompt)
            this.showSection(this.negativeForm)
        })

        this.positiveSubmitButton.addEventListener('click', () => {
            const payload = this.buildPayload(this.positiveForm, true)
            const comment = this.getSuggestionsText(this.positiveForm)
            if (comment) {
                this.trackComment(true, comment)
            }
            this.submitFeedback(payload)
            this.hideSection(this.positiveForm)
            this.showSection(this.thankyou)
        })

        this.positiveSkipButton.addEventListener('click', () => {
            this.submitFeedback({ helpful: true, reasons: [], suggestions: "", pageUrl: window.location.href, timestamp: Date.now(), skipped: true })
            this.hideSection(this.positiveForm)
            this.showSection(this.thankyou)
        })

        this.negativeSubmitButton.addEventListener('click', () => {
            const payload = this.buildPayload(this.negativeForm, false)
            const comment = this.getSuggestionsText(this.negativeForm)
            if (comment) {
                this.trackComment(false, comment)
            }
            this.submitFeedback(payload)
            this.hideSection(this.negativeForm)
            this.showSection(this.thankyou)
        })

        this.negativeSkipButton.addEventListener('click', () => {
            this.submitFeedback({ helpful: false, reasons: [], suggestions: "", pageUrl: window.location.href, timestamp: Date.now(), skipped: true })
            this.hideSection(this.negativeForm)
            this.showSection(this.thankyou)
        })
    }
}

const pagefeedback = new Pagefeedback();

document.addEventListener("DOMContentLoaded", pagefeedback.onDocumentReady.bind(pagefeedback));
