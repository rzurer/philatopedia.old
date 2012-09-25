/*globals   $*/
"use strict";
exports._imageCarousel = function () {
	var result, uicontrols;
	result = {
		initializeControls : function (controls) {
			uicontrols = controls;
		},
		refreshThumbnails : function (images) {
			uicontrols.thumbnailNav.empty();
			images.forEach(function (image) {
				uicontrols.thumbnailNav.append(image);
			});
		},
		getTotalImageWidth : function (arr) {
			var totalImageWidth = 0;
			arr.forEach(function (element) {
				totalImageWidth += element.width();
			});
			return totalImageWidth;
		},
		setTotalImageWidth : function (images) {
			var totalImageWidth, img, pos;
			totalImageWidth = this.getTotalImageWidth(images);
			pos = images.length - 1;
			while (totalImageWidth >= 825) {
				img = images[pos];
				if (img !== undefined) {
					img.css('width', 0);
					img.hide();
					uicontrols.thumbnailNavNext.show();
				}
				pos = pos - 1;
				totalImageWidth = this.getTotalImageWidth(images);
			}
		},
		setActiveThumbnail : function (images, currentImageId, clickCallback) {
			images.forEach(function (img) {
				if (img.attr('id') === currentImageId) {
					img.css('opacity', '1.0');
					img.click(clickCallback);
				}
			});
		},
		createImage : function (element) {
			var src, imageId, stampId, img;
			src = element.defaultImageSrc;
			imageId = element.imageId;
			stampId = element.stampId;
			img = uicontrols.createImage();
			img.attr('id', imageId);
			img.attr('src', src);
			img.attr('stampId', stampId);
			img.css('opacity', '0.2');
			return img;
		},
		createThumbnails : function (imageInfos, clickCallback) {
			var images, currentImageId;
			if (!imageInfos || imageInfos.length === 0) {
				return;
			}
			images = imageInfos.map(this.createImage);
			currentImageId = uicontrols.currentImageId.val();
			this.setActiveThumbnail(images, currentImageId, clickCallback);
			this.setTotalImageWidth(images);
			this.refreshThumbnails(images);
			return images;
		}
	};
	return result;
};

