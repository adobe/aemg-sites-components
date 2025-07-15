(function($, ns, channel, window, undefined) {
	var currentVariation = Granite.HTTP.getPath().replace(new RegExp(".+\\.html"), "");
	var xfVariantType = "cq:xfVariantType";
	channel.on("dialog-loaded", function() {
		var itselfError = Granite.I18n.get("The edited variation cannot include itself.");
		var containsItselfError = Granite.I18n.get("The edited variation cannot include a variation that contains the edited variation.");
		var noVariationError = Granite.I18n.get("Choose an experience fragment variation.");
		var $windowUI = $(window).adaptTo("foundation-ui");
		$(".xf-focusout").each(function(idx, item) {
			$(item).on("oninput change", function(event) {
				$(item).setCustomValidity();
				var variation = $(event.target).val();
				if (variation == "") {
                    $(item).setCustomValidity(null);
					$(item).checkValidity();
					$(item).validationMessage();
					$(item).updateErrorUI();
					return;
				}
				if (variation == currentVariation) {
					$(item).setCustomValidity(itselfError);
				}
				if (variation != "" && variation != "/content" && variation != "/content/") {
					$windowUI.wait();
					$.ajax(variation + ".3.json", {
							method: "GET",
                           async: true
						})
						.success(function(data) {
							var result = data['jcr:content'];
							if (!result || (result && !result.root)) {
								// Not a variation.
								$(item).setCustomValidity(noVariationError);
								return;
							} else {
								// Look for current variation on root level children
								for (var key in result.root) {
									if (result.root[key]["fragmentPath"] == currentVariation) {
										$(item).setCustomValidity(containsItselfError)
                                        $(event.target).val('');
										break;
									}
								}
							}
                        }).error(function(){

                            if (variation.startsWith("/content/")) {
                            $(item).setCustomValidity(noVariationError);
                            $(item).find("coral-tag-label[role='rowheader']").text(variation);
                            $(event.target).val(variation);
                            return;
                            }

                        })
						.always(function() {
							$windowUI.clearWait();
							$(item).updateErrorUI()
						});
				} else {
					$(item).setCustomValidity(null);
					$(item).checkValidity();
					$(item).validationMessage();
					$(item).updateErrorUI();
					return;
				}
			})
		});
	});
})(jQuery, Granite.author, jQuery(document), this);