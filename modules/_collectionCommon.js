"use strict";
exports._collectionCommon = function (urls, common, jquery) {
	var uicontrols, result, $, imageInfos;
	uicontrols = {};
	imageInfos = [];
	$ = jquery;
	result = {
		initializeControls : function (controls, imageInfoArray) {
			uicontrols = controls;
			imageInfos = imageInfoArray;
			return common.getObjectInfo(uicontrols);
		},
		setImages : function () {
			var i, k, imageInfo, imageElement, stampId, defaultImageSrc, stampImage, stampImages, src;
			for (i = 0; i < imageInfos.length; i += 1) {
				imageInfo = imageInfos[i];
				stampId = imageInfo.stampId;
				defaultImageSrc = imageInfo.defaultImageSrc;

				stampImage = uicontrols.getStampImage(stampId);
				if (!defaultImageSrc || defaultImageSrc.length === 0) {
					stampImage.attr('src', urls.nostampimage);
				} else {
					stampImage.attr('src', defaultImageSrc);
				}
			}
			stampImages = uicontrols.getStampImages();
			for (k = 0; k < stampImages.length; k += 1) {
				imageElement = $(stampImages[k]);
				src = imageElement.attr('src');
				if (!src || !imageElement || src.length === 0) {
					imageElement.attr('src', urls.nostampImage);
				}
			}
		},
		truncate : function () {
			var value, truncated, labels;
			labels = uicontrols.getStampLabels();
			labels.each(function () {
				if ($(this).text().length > 30) {
					value = $(this).text();
					truncated = value.substring(0, 25) + " ...";
					$(this).attr('title', value);
					$(this).text(truncated);
				}
			});
		}
	};
	return result;
};