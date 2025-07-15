$(document).ready(function () {
    $(".copy-link-component").each(function () {
        const $component = $(this);
        const $button = $component.find(".gu-copy-link");
        const $confirmation = $component.find(".gu-copy-link__text");

        $button.on("click", function () {
            const pageUrl = window.location.href;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(pageUrl).then(function () {
                    $confirmation.fadeIn(200).delay(1000).fadeOut(200);
                }).catch(function (err) {
                    console.error("Clipboard write failed: ", err);
                });
            } else {
                // Fallback using deprecated execCommand
                const tempInput = $("<input>");
                $("body").append(tempInput);
                tempInput.val(pageUrl).select();
                try {
                    document.execCommand("copy");
                    $confirmation.fadeIn(200).delay(1000).fadeOut(200);
                } catch (err) {
                    console.error("Fallback copy failed: ", err);
                }
                tempInput.remove();
            }
        });
    });
});
