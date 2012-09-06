"use strict";
exports.stamp = function (urls, router, popup, stamp) {
	var result, uicontrols;
	result = {
		initializeControls : function (controls) {
			uicontrols = controls;
		},
		updateStamp : function (obj) {
			stamp[obj.name] = obj.value;
		},
		getFullSizeImageUrl : function () {
			var src = uicontrols.dropImage.attr('src');
			return urls.getFullSizeImageUrl(src);
		},
		identify : function () {

		},
		dropImageClick : function () {
			var url, src;
			src = result.getFullSizeImageUrl();
			if (src === urls.noimagesrc) {
				return;
			}
			uicontrols.fullSizeImage.attr('src', src);
			url = uicontrols.fullSizeImage.get(0).src;
			result.identify(url, popup.showPopup);
		},
		assignEventHandlers : function () {
			uicontrols.dropImage.click(result.dropImageClick);
		}
	};
	return result;
};



