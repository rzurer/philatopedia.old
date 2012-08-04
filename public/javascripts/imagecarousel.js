'use strict';
/*global $*/
var ImageCarousel = function () {
	this.initialize.apply(this, arguments);
};
ImageCarousel.prototype = {
	initialize: function (stamp, propertyManager, navigationButtons) {
		this.imageIndex = 0;
		this.stamp = stamp;
		this.propertyManager = propertyManager;
		this.navigationButtons = navigationButtons;
		this.propertyname = 'defaultimage';
		this.setCurrentImageId = function (id) {
			$('#currentImageId').val(id);
		};
		this.getCurrentImageId = function () {
			return $('#currentImageId').val();
		};
		this.setCurrentImageCaption = function () {
			$("#imagecaption").val(this.stamp.imageInfos[this.imageIndex].caption);
		};
		this.getDropImage = function () {
			return $("#dropImage");
		};
		this.getDefaultImageCheckbox = function () {
			return $('#defaultimage');
		};
		this.setImageAttributes = function () {
			var img, imageInfo;
			img = $("#dropImage");
			imageInfo = this.stamp.imageInfos[this.imageIndex];
			img.attr('src', imageInfo.url);
			img.attr('height', imageInfo.height);
			img.attr('width', imageInfo.width);
			this.setCurrentImageId(imageInfo._id);
			this.setCurrentImageCaption(this.imageIndex);
		};
		this.getDefaultImageId = function () {
			return this.propertyManager.getPropertyValue(this.stamp.displayProperties, this.propertyname);
		};
		this.getDefaultImageIndex = function () {
			var defaultImageId, result;
			result = 0;
			defaultImageId = this.getDefaultImageId();
			this.stamp.imageInfos.forEach(function (element, idx) {
				if (element._id === defaultImageId) {
					result = idx;
				}
			});
			return result;
		};
		this.getLength = function () {
			return this.stamp.imageInfos.length;
		};
	},
	setImageCaption : function (obj) {
		if(!this.stamp.imageInfos || this.stamp.imageInfos.length == 0){
			return;
		}
		this.stamp.imageInfos[this.imageIndex].caption = obj.value;
	},
	addImageInfo : function (img) {
		var stampId, idx;
		stampId = $('#_id').val();
		this.stamp.imageInfos.push({
			_id: new Date().getTime() + '_' +  stampId,
			stampId: stampId,
			url: img.src,
			height: img.height,
			width: img.width
		});
		this.navigateTo('last');
		this.setDefaultImageCheckbox();
	},
	setImageToDefault : function () {
		var dropImage, defaultimage;
		dropImage = this.getDropImage();
		if (this.getLength() === 0) {
			dropImage.attr('src', '/images/dropimagehere.png');
			dropImage.attr('height', 300);
			dropImage.attr('width', 300);
			this.navigationButtons.enableDisableButtons(this.getLength(), this.imageIndex);
			this.setDefaultImageCheckbox();
			return;
		}
		this.imageIndex = this.getDefaultImageIndex();
		defaultimage = this.stamp.imageInfos[this.imageIndex];
		dropImage.attr('src', defaultimage.url);
		dropImage.attr('height', defaultimage.height);
		dropImage.attr('width', defaultimage.width);
		this.setCurrentImageId(this.stamp.imageInfos[this.imageIndex]._id);
		this.navigationButtons.enableDisableButtons(this.getLength(), this.imageIndex);
		this.setCurrentImageCaption();
		this.setDefaultImageCheckbox();
	},
	setStamp : function (stamp) {
		this.stamp = stamp;
	},
	setDefaultImageCheckbox : function () {
		var defaultImageCheckbox, defaultImageId, currentImageId;
		defaultImageCheckbox = this.getDefaultImageCheckbox();
		if (this.getLength() === 0) {
			defaultImageCheckbox.attr('disabled', 'disabled');
			defaultImageCheckbox.attr('checked', false);
			return;
		}
		defaultImageId = this.getDefaultImageId();
		currentImageId = this.getCurrentImageId();
		defaultImageCheckbox.attr('checked', defaultImageId === currentImageId);
		defaultImageCheckbox.removeAttr('disabled');
	},
	setDefaultImage : function () {
		var array, value;
		value = this.getCurrentImageId(); //there is no image id when the image is dropped
		if (value && this.getDefaultImageCheckbox().is(':checked')) {
			this.propertyManager.addOrReplaceProperty(this.stamp.displayProperties, this.propertyname, value);
			return;
		}
		this.propertyManager.removeProperty(this.stamp.displayProperties, this.propertyname);
	},
	getImageInfoFromSrc : function (imageInfos) {
		var src, result;
		src = this.getDropImage().attr('src');
		imageInfos.forEach(function(element){
			if(element.url === src){
				result = element;
				return;
			}
		})
		return result;

	},
	navigateTo: function (to) {
		var length;
		length = this.getLength();
		if (length === 0) {
			return;
		}
		switch (to) {
		case 'first':
			this.imageIndex = 0;
			break;
		case 'previous':
			if (this.imageIndex > 0) {
				this.imageIndex -= 1;
			}
			break;
		case 'next':
			if (this.imageIndex < length - 1) {
				this.imageIndex += 1;
			}
			break;
		case "last":
			this.imageIndex = length - 1;
			break;
		}
		this.setImageAttributes();
		this.setDefaultImageCheckbox();
		this.navigationButtons.enableDisableButtons(length, this.imageIndex);
	}
};




