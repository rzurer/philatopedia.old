/*global  describe, beforeEach, afterEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
    urls = require('../modules/urls').urls,
    func = function () {},
    window = {},
    router = require('../modules/routers').stampRouter(urls, window, func),
	stamp,
	controls,
	sut,
	popup,
	setup = function () {
		stamp = {};
		controls = {
			dropImage : $('<img/>'),
			backgroundPopup : $('<div/>'),
			popupImage : $('<div/>'),
			body : $('<body/>'),
			fullSizeImage : $('<div/>')
		};
		popup = require('../modules/popup').popup();
		popup.initializeControls(controls);
		sut = require('../modules/stamp').stamp(urls, router, popup, stamp);
		sut.initializeControls(controls);
	};
describe('stamp_module', function () {
	beforeEach(setup);
	it("updateStamp should set stamp property value", function () {
		var obj = {name : 'foo', value : 'baz'};
		sut.updateStamp(obj);
		assert.strictEqual(stamp.foo, 'baz');
		obj = {name : 'bip', value : 'bop'};
		sut.updateStamp(obj);
		assert.strictEqual(stamp.foo, 'baz');
		assert.strictEqual(stamp.bip, 'bop');
	});
	it("getFullSizeImageUrl should get full size image path of dropImage src", function () {
		var spy = sinon.spy(urls, 'getFullSizeImageUrl'),
			src = 'foo';
		controls.dropImage.attr('src', src);
		sut.getFullSizeImageUrl();
		urls.getFullSizeImageUrl.restore();

		sinon.assert.calledWith(spy, src);
	});
	describe('dropImageClick', function () {
		it("should call router identify", function () {
			var spy, url, callback;
			spy = sinon.spy(router, 'identify');
			sut.dropImageClick();
			url = controls.fullSizeImage.get(0).src;
			callback = popup.showPopup;
			router.identify.restore();

			sinon.assert.calledWith(spy, url, callback);
		});
		it("should call getFullSizeImageUrl", function () {
			var spy;
			spy = sinon.spy(sut, 'getFullSizeImageUrl');
			sut.dropImageClick();
			sut.getFullSizeImageUrl.restore();

			sinon.assert.calledOnce(spy);
		});
		it("when src is noimagesrc should not call router identify", function () {
			var stub, spy;
			spy = sinon.spy(router, 'identify');
			stub = sinon.stub(sut, 'getFullSizeImageUrl').returns(urls.noimagesrc);
			sut.dropImageClick();
			router.identify.restore();
			stub.restore();

			sinon.assert.notCalled(spy);
		});
		it("when src is not noimagesrc should set source of fullSizeImage", function () {
			var stub, spy, src;
			spy = sinon.spy(controls.fullSizeImage, 'attr');
			src = "www.google.com";
			stub = sinon.stub(sut, 'getFullSizeImageUrl').returns(src);
			sut.dropImageClick();
			controls.fullSizeImage.attr.restore();
			stub.restore();

			sinon.assert.calledWith(spy, 'src', src);
		});
	});
	it("assignPopupEvents should assign dropImage click event", function () {
		var spy;
		spy = sinon.spy(sut, 'dropImageClick');
		sut.assignPopupEvents();
		controls.dropImage.click();
		sut.dropImageClick.restore();

		sinon.assert.calledOnce(spy);
	});
	it("getTotalImageWidth should return sum of images width", function () {
		var arr, getImage, actual, width;
		width = 10;
		getImage = function () {
			return { width : function () { return width; }};
		};
		arr = [ getImage(), getImage(), getImage(), getImage()];
		actual = sut.getTotalImageWidth(arr);
		assert.strictEqual(actual, arr.length * width);
	});
	describe('canSaveStamp', function () {
		it("when stamp is undefined should throw", function () {
			try {
				sut.canSaveStamp();
			} catch (err) {
				assert.strictEqual(err, "stamp should not be undefined");
			}
		});
		it("when stamp.issuedBy is undefined should return false", function () {
			var canSave = sut.canSaveStamp({});
			assert.strictEqual(canSave, false);
		});
		it("when stamp.issuedBy is 'null' should return false", function () {
			var canSave, stamp;
			stamp = {issuedBy : null};
			canSave = sut.canSaveStamp(stamp);
			assert.strictEqual(canSave, false);
			stamp = {issuedBy : "null"};
			canSave = sut.canSaveStamp(stamp);
			assert.strictEqual(canSave, false);
		});
		it("when stamp.issuedBy is defined should return true", function () {
			var stamp = {issuedBy : "Great Britain"};
			var canSave = sut.canSaveStamp(stamp);
			assert.strictEqual(canSave, true);
		});
	});

});
