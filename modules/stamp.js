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
		dropImageClick : function () {
			var url, src;
			src = result.getFullSizeImageUrl();
			if (src === urls.noimagesrc) {
				return;
			}
			uicontrols.fullSizeImage.attr('src', src);
			url = uicontrols.fullSizeImage.get(0).src;
			router.identify(url, popup.showPopup);
		},
		assignPopupEvents : function () {
			uicontrols.dropImage.click(result.dropImageClick);
		},
		getTotalImageWidth : function (arr) {
			var totalImageWidth = 0;
			arr.forEach(function (element) {
				totalImageWidth += element.width();
			});
			return totalImageWidth;
		},
		canSaveStamp : function (stamp) {
			if (!stamp) {
				throw "stamp should not be undefined";
			}
			if (!stamp.issuedBy || stamp.issuedBy === 'null') {
				return false;
			}
			return true;
		},
		getStampHtml : function (id) {
			var callback = function (data) {
				history.pushState( {id: id}, '', '/stamps/?id=' + id);
				$('.stampcontainer').html(data);
			};
			router.getStampHtml(id, callback);
		}
	};
	return result;
};



