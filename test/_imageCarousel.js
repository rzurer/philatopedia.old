/*global  describe, beforeEach, afterEach, it, $*/
"use strict";
var sut = require('../modules/_imageCarousel')._imageCarousel(),
	sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	imageWidth = 10,
	func = function () {},
	getLabel = function () {
		return $('<label/>');
	},
	getInput = function () {
		return $('<input/>');
	},
	getImage = function () {
		var img = $('<img/>');
		img.width = function () {
			return imageWidth;
		};
		return img;
	},
	controls = {
		thumbnailNav : getLabel(),
		currentImageId : getInput(),
		thumbnailNavNext :  getLabel(),
		createImage : getImage
	},
	setup = function () {
		sut.initializeControls(controls);
	};
describe('_imageCarousel_module', function () {
	beforeEach(setup);
	describe('createThumbnails', function () {
		describe('when imageInfos is undefined or empty', function () {
			it("should not call create image", function () {
				var spy;
				spy = sinon.spy(sut, 'createImage');
				sut.createThumbnails();
				sut.createImage.restore();

				sinon.assert.notCalled(spy);
			});
		});
		describe('when imageInfos is not empty', function () {
			var imageInfos;
			beforeEach(function () {
				imageInfos = [ {}, {}, {}, {}];
			});
			it("should call create image for every imageInfo", function () {
				var spy;
				spy = sinon.spy(sut, 'createImage');
				sut.createThumbnails(imageInfos);
				sut.createImage.restore();

				sinon.assert.callCount(spy, imageInfos.length);
			});
			it("should get currentImageId", function () {
				var spy;
				spy = sinon.spy(controls.currentImageId, 'val');
				sut.createThumbnails(imageInfos);
				controls.currentImageId.val.restore();

				sinon.assert.calledOnce(spy);
			});
			it("should get setActiveThumbnail", function () {
				var spy, images, stub, id;
				id = 10;
				spy = sinon.spy(sut, 'setActiveThumbnail');
				stub = sinon.stub(controls.currentImageId, 'val').returns(id);
				images = sut.createThumbnails(imageInfos, func);
				sut.setActiveThumbnail.restore();

				sinon.assert.calledWith(spy, images, id, func);
			});
			it("should get setTotalImageWidth", function () {
				var spy, images;
				spy = sinon.spy(sut, 'setTotalImageWidth');
				images = sut.createThumbnails(imageInfos);
				sut.setTotalImageWidth.restore();

				sinon.assert.calledWith(spy, images);
			});
			it("should refreshThumbnails", function () {
				var spy, images;
				spy = sinon.spy(sut, 'refreshThumbnails');
				images = sut.createThumbnails(imageInfos);
				sut.refreshThumbnails.restore();

				sinon.assert.calledWith(spy, images);
			});
		});
	});
	describe('createImage', function () {
		var imageInfo;
		beforeEach(function () {
			imageInfo = {
				defaultImageSrc : "foo.jpg",
				imageId : 'A12345',
				stampId : 'S7894'
			};
		});
		it("should call controls createImage", function () {
			var spy, img;
			spy = sinon.spy(controls, 'createImage');
			img = sut.createImage(imageInfo);
			controls.createImage.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should set image id attribute", function () {
			var img;
			img = sut.createImage(imageInfo);
			assert.equal(img.attr('id'), imageInfo.imageId);
		});
		it("should set image src attribute", function () {
			var img;
			img = sut.createImage(imageInfo);
			assert.equal(img.attr('src'), imageInfo.defaultImageSrc);
		});
		it("should set image stampId attribute", function () {
			var img;
			img = sut.createImage(imageInfo);
			assert.equal(img.attr('stampId'), imageInfo.stampId);
		});
		it("should set image opacity to '0.2'", function () {
			var img;
			img = sut.createImage(imageInfo);
			assert.equal(img.css('opacity'), '0.2');
		});
	});
	describe('setActiveThumbnail', function () {
		describe('when image is not current image', function () {
			it("should not set image opacity", function () {
				var images, currentImageId, img;
				currentImageId = "B4567";
				img = getImage();
				img.css('opacity', '0.2');
				img.attr('id', 'A1234');
				images = [img];
				sut.setActiveThumbnail(images, currentImageId, func);

				assert.equal(img.css('opacity'), '0.2');
			});
		});
		describe('when image is current image', function () {
			it("should set image opacity to 1.0", function () {
				var images, currentImageId, img;
				currentImageId = "A1234";
				img = getImage();
				img.css('opacity', '0.2');
				img.attr('id', 'A1234');
				images = [img];
				sut.setActiveThumbnail(images, currentImageId, func);

				assert.equal(img.css('opacity'), 1);
			});
			it("should set image click", function () {
				var images, currentImageId, img, count;
				count = 0;
				currentImageId = "A1234";
				img = getImage();
				img.attr('id', 'A1234');
				images = [img];
				sut.setActiveThumbnail(images, currentImageId, function () {
					count = 42;
				});
				img.click();
				assert.strictEqual(count, 42);
			});
		});
	});
	describe('setTotalImageWidth', function () {
		it("should call getTotalImageWidth", function () {
			var images, spy;
			images = [ getImage(), getImage(), getImage(), getImage()];
			spy = sinon.spy(sut, 'getTotalImageWidth');
			sut.setTotalImageWidth(images);
			sut.getTotalImageWidth.restore();

			sinon.assert.calledWith(spy, images);
		});
	});
	describe('getTotalImageWidth', function () {
		it("should return sum of images width", function () {
			var images, actual;
			images = [ getImage(), getImage(), getImage(), getImage()];
			actual = sut.getTotalImageWidth(images);
			assert.strictEqual(actual, images.length * imageWidth);
		});
	});
	describe('refreshThumbnails', function () {
		it("should empty thumbnail container", function () {
			var images, spy;
			images = [ getImage(), getImage(), getImage(), getImage()];
			spy = sinon.spy(controls.thumbnailNav, 'empty');
			sut.refreshThumbnails(images);
			controls.thumbnailNav.empty.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should add each imaage to thumbnail container", function () {
			var images, spy;
			images = [ getImage(), getImage(), getImage(), getImage()];
			spy = sinon.spy(controls.thumbnailNav, 'append');
			sut.refreshThumbnails(images);
			controls.thumbnailNav.append.restore();

			sinon.assert.callCount(spy, images.length);
		});
	});
});