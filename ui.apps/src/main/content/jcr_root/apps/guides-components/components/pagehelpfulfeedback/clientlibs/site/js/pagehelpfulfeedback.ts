/*******************************************************************************
 * Copyright 2022 Adobe Systems Incorporated
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
class Pagehelpfulfeedback {
    askFeedback: HTMLElement
    submitFeedback: HTMLElement
    acknowledgement: HTMLElement
    textarea: any
    yesButton: Element
    noButton: Element
    submitButton: any
    cancelButton: Element
    characterCounter: Element
    characterCounterWrapper: HTMLElement

    hideclass = 'tcx-hide'
    warningClass = 'feedback-overflow-warning'

    hideSection(section: Element) {
        section.classList.add(this.hideclass)
    }

    showSection(section: Element) {
        section.classList.remove(this.hideclass)
    }

    onDocumentReady() {
        this.askFeedback = document.getElementById("page-helpful-feedback-yes-no")
        this.submitFeedback = document.getElementById("page-helpful-feedback-yes-text")
        this.acknowledgement = document.getElementById("page-helpful-feedback-given")
        this.characterCounterWrapper = document.getElementById("feedback-character-counter-wrapper")

        if(this.askFeedback === null) {
            return;
        }

        this.yesButton = this.askFeedback.getElementsByClassName("yes-button").item(0)
        this.noButton = this.askFeedback.getElementsByClassName("no-button").item(0)

        this.submitButton = this.submitFeedback.getElementsByClassName("submit-button").item(0)
        this.cancelButton = this.submitFeedback.getElementsByClassName("cancel-button").item(0)

        this.textarea = this.submitFeedback.getElementsByClassName("page-helpful-feedback-inputbox").item(0)
        this.characterCounter = this.characterCounterWrapper.getElementsByClassName("feedback-character-counter").item(0)
        this.subscribeEvents()
    }

    analyticsSendFeedbackHelpful() {

    }

    analyticsSendFeedbackNotHelpfulWithMessage() {
        const text = this.textarea.value
    }

    addWarningOfCharLimit() {
        this.characterCounterWrapper.classList.add(this.warningClass)
        this.textarea.classList.add(this.warningClass)
        this.submitButton.disabled = true
        this.submitButton.classList.add(this.warningClass)
    }

    removeWarningOfCharLimit() {
        this.characterCounterWrapper.classList.remove(this.warningClass)
        this.textarea.classList.remove(this.warningClass)
        this.submitButton.disabled = false
        this.submitButton.classList.remove(this.warningClass)
    }

    updateCharacterCounter(count: number) {
        this.characterCounter.textContent = `${count}/255`
    }

    subscribeEvents() {
        this.yesButton.addEventListener('click', () => {
            this.hideSection(this.askFeedback)
            this.showSection(this.acknowledgement)
            this.analyticsSendFeedbackHelpful()
        })
        this.noButton.addEventListener('click', () => {
            this.hideSection(this.askFeedback)
            this.showSection(this.submitFeedback)
        })
        this.submitButton.addEventListener('click', () => {
            this.hideSection(this.submitFeedback)
            this.showSection(this.acknowledgement)
            this.analyticsSendFeedbackNotHelpfulWithMessage()
        })
        this.cancelButton.addEventListener('click', () => {
            this.hideSection(this.submitFeedback)
            this.showSection(this.askFeedback)
        })
        this.textarea.addEventListener('input', () => {
            var currentLength = this.textarea.value.length;
            this.updateCharacterCounter(currentLength)
            if (currentLength > 255) {
                this.addWarningOfCharLimit()
            } else {
                this.removeWarningOfCharLimit()
            }

        })
    }
}

const pagehelpfulfeedback = new Pagehelpfulfeedback();

document.addEventListener("DOMContentLoaded", pagehelpfulfeedback.onDocumentReady.bind(pagehelpfulfeedback));