/*globals  history*/
"use strict";
exports.stamp = function (urls, router, popup, search, stamp) {
	var result, uicontrols;
	result = {
		initializeControls : function (controls) {
			uicontrols = controls;
			search.initializeControls(controls.searchControls);
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
				history.pushState({id: id}, '', '/stamps/?id=' + id);
				uicontrols.stampcontainer.html(data);
			};
			router.getStampHtml(id, callback);
		},
		createUpsertCallback : function (callback) {
			return function (data) {
				stamp = data;
				if (callback) {
					callback();
				}
			};
		},
		upsertStamp : function (callback) {
			var upsertCallback;
			if (!result.canSaveStamp(stamp)) {
				return;
			}
			upsertCallback = result.createUpsertCallback(callback);
			router.upsertStamp(stamp, upsertCallback);
		},

	};
	return result;
};


