(function ($, ns, channel) {

    function fetchToolbarConfig(method, data, successMessage, errorMessage) {
        $.ajax("/bin/toolbarconfig.json", {
            method: method,
            data: data,
            async: true
        })
        .done((data) => {
            if (method === "GET") {
            let toolbarXFField = $("coral-taglist[name='./toolbarXFPath']");
                if(toolbarXFField) toolbarXFField.val(data.toolbarXFPath);
            let headerXFField = $("coral-taglist[name='./headerXFPath']");
                if(headerXFField) headerXFField.val(data.headerXFPath);
            let footerXFField = $("coral-taglist[name='./footerXFPath']");
                if(footerXFField) footerXFField.val(data.footerXFPath);
            }
            console.log(successMessage);
        })
        .fail(() => {
            console.error(errorMessage);
        });
    }

    channel.on("dialog-loaded", function () {

        const toolbarFoundation = $("foundation-autocomplete[name='./toolbarXFPath']");
        const headerFoundation = $("foundation-autocomplete[name='./headerXFPath']");
        const footerFoundation= $("foundation-autocomplete[name='./footerXFPath']");

        if (toolbarFoundation.length && headerFoundation.length && footerFoundation.length) {

            const toolbarInput = $("input[name='./toolbarXFPath']");
            const headerInput = $("input[name='./headerXFPath']");
            const footerInput = $("input[name='./footerXFPath']");
            const toolbarXFPath = toolbarInput.val();
            const headerXFPath = headerInput.val();
            const footerXFPath = footerInput.val();
            const urlParams = new URLSearchParams(window.location.search);
            const pagePath = urlParams.get('item');

            const data = {
                'toolbarXFPath': toolbarXFPath,
                'headerXFPath': headerXFPath,
                'footerXFPath': footerXFPath,
                'pagePath': pagePath
            };

            fetchToolbarConfig("GET", data, "Data fetched successfully", "Error while fetching data");

            $("#shell-propertiespage-doneactivator").on("click", function () {

            const toolbarInput = $("input[name='./toolbarXFPath']");
            const headerInput = $("input[name='./headerXFPath']");
            const footerInput = $("input[name='./footerXFPath']");
            const toolbarXFPath = toolbarInput.val();
            const headerXFPath = headerInput.val();
            const footerXFPath = footerInput.val();
            const urlParams = new URLSearchParams(window.location.search);
            const pagePath = urlParams.get('item');

            const data = {
                'toolbarXFPath': toolbarXFPath,
                'headerXFPath': headerXFPath,
                'footerXFPath': footerXFPath,
                'pagePath': pagePath
            };
                fetchToolbarConfig("POST", data, "Saved successfully", "Error saving data");
            });
        }
    });

})(jQuery, Granite.author, jQuery(document));