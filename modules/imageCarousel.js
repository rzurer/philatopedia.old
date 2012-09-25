/*globals   $*/
"use strict";
exports.imageCarousel = function (methods, search) {
	return {
		displayThumbnails : function () {
			search.getStampIdDefaultImageIdImageSrcArray(methods.createThumbnails);
		}
	};
};

/*function (evt) {
result.upsertStamp(function () {
result.stampId = $(img).attr('stampId');
result.getStampHtml(stampId);
}*/