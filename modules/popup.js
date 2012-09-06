"use strict";
exports.popup = function () {
	var popupStatus = 0,
		uicontrols,
		result = {
			getPopupStatus : function (status) {
				return popupStatus;
			},
			setPopupStatus : function (status) {
				popupStatus = status;
			},
			loadPopup : function () {
				if (popupStatus === 0) {
					uicontrols.backgroundPopup.css({"opacity": "0.7"});
					uicontrols.backgroundPopup.fadeIn("slow");
					uicontrols.popupImage.fadeIn("slow");
					popupStatus = 1;
				}
			},
			showPopup : function (width, height) {
				var containerWidth, containerHeight, top, left;
				containerWidth = uicontrols.body.width();
				containerHeight = uicontrols.body.height();
				top = (containerHeight / 2) - (height / 2);
				left = (containerWidth / 2) - (width / 2);
				uicontrols.popupImage.css({"position": "absolute", "top": top, "left": left});
				result.loadPopup();
			},
			disablePopup : function () {
				if (popupStatus === 1) {
					uicontrols.backgroundPopup.fadeOut("slow");
					uicontrols.popupImage.fadeOut("slow");
					popupStatus = 0;
				}
			},
			initializeControls : function (controls) {
				uicontrols = controls;
			},
			assignEventHandlers : function () {
				uicontrols.popupImageClose.click(result.disablePopup);
				uicontrols.backgroundPopup.click(result.disablePopup);
			}
		};
	return result;
};