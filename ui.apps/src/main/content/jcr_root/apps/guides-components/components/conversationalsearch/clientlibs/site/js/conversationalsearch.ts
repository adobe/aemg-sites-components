class ConversationalSearch {
    promptButton : any
    conversationWindow : any
    textArea : any
    closeButton : any
    submitButton : any
    chatWindow : any
    resetButton : any
    errorBlock : any
    loadingArea : any
    scrollingWindow : any
    promptVisible : boolean = false
    userName : string
    userThumbnail : string

    scrollButton
    initDone :boolean = false
    userMessage : string
    conversationId : string
    siteId : string
    index = 0
    dislikeOptions = [ "Partially incorrect", "Incorrect", "Misleading/off topic",
    "Poorly presented", "Incorrect citation", "Misunderstood question", "Other"]

    reportOptions = ["Harmful", "Copyright/Trademark violation", "Illegal",
    "Offensive", "Biased", "Sexual content", "Others"
    ]
    responseMap = {}

    cannedFeedback = []
    textualFeedback = ""
    feedbackConversationId = ""

    onDocumentReady() {
        this.addAllEventListeners()
        this.getUserInfo()
        this.getSiteId()
    }

    defer(func) {
        setTimeout(func, 0)
    }

    debounce(func, timeout){
        let timer
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => { func.apply(this, args) }, timeout)
        }
    }

    getSiteId() {
        let wrapperNode = document.getElementsByClassName("conversational-search-wrapper")[0];
        this.siteId = wrapperNode.getAttribute("data-cmp-site-id")
        const isEnabled = wrapperNode.getAttribute("data-cmp-is-enabled")
        if(isEnabled == "false") {
            wrapperNode.setAttribute("style", "display: none");
        }
    }

    async getUserInfo() {
        const response = await fetch('/libs/cq/security/userinfo.json')
        const data = await response.json()
        const thumbnail = `${data['home']}/profile/photos/primary/image.prof.thumbnail.24.24.png`
        fetch(thumbnail).then((response) => {
            this.userName = data['userName']
            if(response.ok) {
                this.userThumbnail = thumbnail
            }
            else {
                this.userThumbnail = "https://ab.adobe-identity.com/api/avatars/50/791280C75AC613DC0A495C97@adobe.com"
            }
        })
    }

    resetVisibility() {
        this.promptVisible = !this.promptVisible
        this.conversationWindow.style.display = this.promptVisible ? '' : 'none'
        this.promptButton.style.display = this.promptVisible ? 'none' : ''
        if(!this.initDone) {
            this.initDone = true
            this.defer(this.setChatEvents())
        }
        this.scrollChatToBottom()
    }

    setChatEvents() {
        this.closeButton = document.getElementById('close-conversation-button');
        this.closeButton.addEventListener('click', this.resetVisibility.bind(this))
        this.resetButton = document.getElementById('refresh-button')
        this.resetButton.addEventListener('click', this.resetChat.bind(this))
        this.textArea = document.getElementById('conversation-textbox')
        this.textArea.value = ""
        this.textArea.addEventListener('keydown', this.messageChanged.bind(this))
        this.submitButton = document.getElementById('submit-button')
        this.submitButton.addEventListener('click', this.getChatReply.bind(this))
        this.submitButton.disabled = true
        this.loadingArea = document.getElementById('progress-state')
        this.loadingArea.style.display = 'none'
        this.chatWindow = document.getElementById("chat-history")
        this.scrollingWindow = document.getElementById("scrolling-window")
        this.scrollingWindow.addEventListener("scroll", this.checkForScrollButton.bind(this))
        this.scrollButton = document.getElementById("scroll-button")
        this.scrollButton.addEventListener("click", this.scrollChatToBottom.bind(this))
        this.scrollButton.style.display = 'none'
        this.errorBlock = document.getElementById("error-block")
        this.errorBlock.style.display = 'none'
        this.addInitialMessage()
    }

    addAllEventListeners() {
        this.conversationWindow = document.getElementById('search-window');
        this.conversationWindow.style.display = 'none'
        this.promptButton = document.getElementById('prompt-button');
        this.promptButton.addEventListener("click", this.resetVisibility.bind(this))
    }

    messageChanged(event) {
        if(event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault()
            this.getChatReply()
        }
        this.defer(() => {
            this.submitButton.disabled = event.target.value.trim() === "";
        })
    }

    getChatReply() {
        this.userMessage = this.textArea.value
        if(this.userMessage.trim().length === 0) {
            return
        }
        this.textArea.value = ""
        this.textArea.blur()
        this.startLoading()
        this.addUserQuery()
        this.fetchAIReply()
    }

    addUserQuery() {
        this.insertChatMessage(this.userMessage, true)
    }

    addInitialMessage() {
        this.insertChatMessage("Hey, how can I help you?", false, true)
    }

    fetchAIReply() {
        const opts ={
            site_id: this.siteId,
            query: this.userMessage
        }
        if(this.conversationId) {
            opts["conversation_id"] = this.conversationId
        }
        const question = this.userMessage
        const xhr = new XMLHttpRequest();

        xhr.open("POST", "/bin/guides/v1/smartsuggest/chat", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = this.processReply.bind(this, xhr, question)
        xhr.send(JSON.stringify(opts));
    }

    processReply( xhr, query) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            this.conversationId = response['conversation_id']
            this.responseMap[this.conversationId] = {
                query: query,
                answer: response.answer
            }
            this.insertChatMessage(response.answer, false)
        }
        else {
            this.errorBlock.style.display = ""
        }
        this.stopLoading()
    }

    insertChatMessage(message, isUser, isInitialMessage = false) {
        this.errorBlock.style.display = 'none'
        const listNode = document.createElement('li')
        const messageNode = document.createElement('div')
        const userBlock = document.createElement('div')
        userBlock.className = "user-message-block"
        messageNode.className = `chat-message ${isUser ? 'user-query' : 'chatbot-reply'}`
        userBlock.appendChild(this.getDisplayPictureNode(isUser))
        if(isUser) {
            const messageLabel = document.createElement('label')
            messageLabel.innerText = message
            userBlock.appendChild(messageLabel)
            messageNode.appendChild(userBlock)
            messageNode.setAttribute('id', `user-${this.index}`)
        }
        else {
            const node = document.createElement('div')
            node.className = "reply-html"
            node.innerHTML = message
            userBlock.appendChild(node)
            messageNode.appendChild(userBlock)
            !isInitialMessage && this.appendChatActionButtons(messageNode)
            messageNode.setAttribute('id', this.conversationId ? `${this.conversationId}` : 'default-id' )
        }
        listNode.appendChild(messageNode)
        this.chatWindow.appendChild(listNode)
        this.scrollChatToBottom()
    }

    appendChatActionButtons(node) {
        const buttonGroup = document.createElement('div')
        buttonGroup.className = "chat-action-buttons"
        const copyButton = document.createElement('button')
        copyButton.className = "copy-button"
        copyButton.addEventListener('click', this.copyContent.bind(this) )
        buttonGroup.appendChild(copyButton)
        const likeButton = document.createElement('button')
        likeButton.className = "like-button"
        likeButton.addEventListener('click', this.likeContent.bind(this))
        buttonGroup.appendChild(likeButton)
        const dislikeButton = document.createElement('button')
        dislikeButton.className = "dislike-button"
        buttonGroup.appendChild(dislikeButton)
        dislikeButton.addEventListener('click', this.dislikeContent.bind(this))
        const reportButton = document.createElement('button')
        reportButton.className = "report-button"
        buttonGroup.appendChild(reportButton)
        reportButton.addEventListener("click", this.reportContent.bind(this))
        node.appendChild(buttonGroup)
    }

    copyContent(opts) {
        const targetButton = opts.target
        const reqMessageNode = this.findParentMessageNode(targetButton)
        if(!reqMessageNode) {
            return
        }
        const htmlReplyNode = reqMessageNode.querySelector('.reply-html')
        const range = document.createRange()
        range.selectNodeContents(htmlReplyNode)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        document.execCommand('copy')
        selection?.removeAllRanges()
        targetButton.className = "copied-button"
    }

    likeContent(opts) {
        const targetButton = opts.target
        if(targetButton.className == "like-button") {
            const reqMessageNode = this.findParentMessageNode(targetButton)
            this.feedbackConversationId = reqMessageNode.getAttribute('id')
            targetButton.className = "liked-button"
            const dislikedButton = targetButton.parentNode.querySelector(".disliked-button");
            if(dislikedButton) {
                dislikedButton.className = "dislike-button"
            }
            const opts = {
                "conversation_id": this.feedbackConversationId,
                "query": this.responseMap[this.feedbackConversationId].query,
                "answer": this.responseMap[this.feedbackConversationId].answer,
                "site_id": this.siteId,
                "feedback":  {
                    overall: true,
                    canned_feedback: this.cannedFeedback,
                    textual_feedback: this.textualFeedback
                }
            }
            this.sendFeedback(opts, true)
        }
        else {
            targetButton.className = "like-button"
        }
    }

    handleTextAreaEvents() {
        const textArea = document.getElementsByClassName("user-textual-feedback")[0]
        textArea.addEventListener("blur", this.textualFeedbackChanged.bind(this));
    }

    showDialogAndSetConversationId(target) {
        const reqMessageNode = this.findParentMessageNode(target)
        this.feedbackConversationId = reqMessageNode.getAttribute('id')
        const overlay = document.getElementById("overlay")
        overlay.style.display = "block"
        document.body.style.overflow = "hidden"
    }

    dislikeContent(opts) {
        if(opts.target.className === "dislike-button") {
            this.showDialogAndSetConversationId(opts.target)
            this.defer(() => {
                this.addCheckboxItems(this.dislikeOptions)
                this.addDialogActions(true, opts.target)
                this.handleTextAreaEvents()
            })
        }
        else {
            opts.target.className = "dislike-button"
        }
    }

    reportContent(opts) {
        if(opts.target.className === "report-button") {
            this.showDialogAndSetConversationId(opts.target)
            this.defer(() => {
                this.addCheckboxItems(this.reportOptions)
                this.addDialogActions(false, opts.target)
                this.handleTextAreaEvents()
            })
        }
        else {
            opts.target.className = "report-button"
        }
    }

    addCheckboxItems(options) {
        const checkboxList = document.getElementById("checklist-items")
        this.removeAllCheckboxItems(checkboxList)
        options.forEach((option, index) => {
            const checkboxOption = document.createElement('label')
            checkboxOption.className = "checkbox-label-group"
            const checkboxInput = document.createElement("input")
            checkboxInput.setAttribute("type", "checkbox")
            checkboxInput.setAttribute("value", option)
            checkboxInput.setAttribute("metadata", index)
            checkboxOption.addEventListener("change", this.checkboxChecked.bind(this))
            const checkboxLabel = document.createElement("label")
            checkboxLabel.className = "checkbox-label"
            checkboxLabel.innerHTML = option
            checkboxOption.appendChild(checkboxInput)
            checkboxOption.appendChild(checkboxLabel)
            checkboxList.appendChild(checkboxOption)
        })
    }

    checkboxChecked(event) {
        if(!event.target.checked) {
            const index = this.cannedFeedback.findIndex(feedback => feedback === event.target.value);
            this.cannedFeedback.splice(index, 1);
        }
        else {
            this.cannedFeedback.push(event.target.value);
        }
    }

    textualFeedbackChanged(event) {
        this.textualFeedback = event.target.value
    }

    removeAllCheckboxItems(element) {
        while (element.firstChild) {
           element.removeChild(element.firstChild);
        }
    }

    findParentMessageNode(element) {
        let currentElement = element;
        while (currentElement && !currentElement.classList.contains("chat-message")) {
            currentElement = currentElement.parentNode;
        }

        return currentElement;
    }

    addDialogActions(isDislike, targetButton) {
        const cancelButton = document.querySelector(".dialog-button.secondary")
        const submitButton = document.querySelector(".dialog-button.primary")
        cancelButton.addEventListener("click", this.closeDialog.bind(this))
        submitButton.addEventListener("click", isDislike ? this.submitDislike.bind(this, targetButton)
                                                                        : this.submitReport.bind(this, targetButton))
    }

    closeDialog() {
        const overlay = document.getElementById("overlay")
        const cancelButton = document.querySelector(".dialog-button.secondary")
        const submitButton = document.querySelector(".dialog-button.primary")
        const textArea = document.querySelector(".user-textual-feedback") as HTMLTextAreaElement
        textArea.value = ""

        const newCancelButton = cancelButton.cloneNode(true);
        cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);

        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        overlay.style.display = "none"
        this.cannedFeedback = []
        this.textualFeedback = ""
    }

    submitDislike(targetButton) {
        const opts = {
            "conversation_id": this.feedbackConversationId,
            "query": this.responseMap[this.feedbackConversationId].query,
            "answer": this.responseMap[this.feedbackConversationId].answer,
            "site_id": this.siteId,
            "feedback":  {
                overall: false,
                canned_feedback: this.cannedFeedback,
                textual_feedback: this.textualFeedback
            }
        }
        this.closeDialog()
        this.sendFeedback(opts, true)
        targetButton.className = "disliked-button"
        const likedButton = targetButton.parentNode.querySelector(".liked-button")
        if(likedButton) {
            likedButton.className = "like-button"
        }
    }

    submitReport(targetButton) {
        const opts = {
            "conversation_id": this.feedbackConversationId,
            "site_id": this.siteId,
            "query": this.responseMap[this.feedbackConversationId].query,
            "answer": this.responseMap[this.feedbackConversationId].answer,
            "report":  {
                canned_report: this.cannedFeedback,
                textual_report: this.textualFeedback
            }
        }
        this.closeDialog()
        this.sendFeedback(opts, false)
        targetButton.className = "reported-button"
    }

    sendFeedback(opts, isFeedback) {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", isFeedback ?
                                    "/bin/guides/v1/smartsuggest/feedback" :
                                    "/bin/guides/v1/smartsuggest/report", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(opts));
        this.showFeedbackBanner();
    }

    showFeedbackBanner() {
        const banner = document.getElementById("feedback-banner");
        banner.style.display = "flex";
        const closeIcon = document.getElementById("banner-close-button")
        closeIcon.addEventListener("click", this.hideFeedbackBanner.bind(this, banner))
        setTimeout(() => {
            this.hideFeedbackBanner(banner)
        }, 5000)
    }

    hideFeedbackBanner(banner) {
        banner.style.display = "none"
    }

    getDisplayPictureNode(isUser) {
        if(isUser) {
            const imageNode = document.createElement('img')
            imageNode.src = this.userThumbnail
            imageNode.className = `display-picture user-image`
            imageNode.title =this.userName
            return imageNode
        }
        else {
            const botImage = document.createElement('div')
            botImage.className = 'display-picture chatbot-image'
            return botImage
        }
    }

    resetChat() {
        while (this.chatWindow.firstChild) {
            this.chatWindow.removeChild(this.chatWindow.firstChild);
        }
        this.loadingArea.style.display = "none"
        this.errorBlock.style.display = "none"
    }

    startLoading() {
        this.textArea.disabled = true
        this.submitButton.disabled = true
        this.loadingArea.style.display = 'inline-grid'
    }

    stopLoading() {
        this.textArea.disabled = false
        this.submitButton.disabled = false
        this.loadingArea.style.display = 'none'
        this.textArea.focus()
    }

    scrollChatToBottom() {
        this.scrollingWindow.scrollTop = this.scrollingWindow.scrollHeight
    }

    checkForScrollButton() {
        this.debounce(this.func.bind(this), 500)()
    }

    func() {
        if(this.scrollingWindow.scrollHeight - (this.scrollingWindow.scrollTop + this.scrollingWindow.clientHeight) > 20 ){
            this.scrollButton.style.display = ''
        }
        else {
            this.scrollButton.style.display = 'none'
        }
    }

}

const conversationalSearch = new ConversationalSearch()
window.addEventListener("DOMContentLoaded", conversationalSearch.onDocumentReady.bind(conversationalSearch))
