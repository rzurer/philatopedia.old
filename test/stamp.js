/*global  describe, beforeEach, afterEach, it*/
"use strict";
var localStorage = {},
    window = {},
    func = function () {},
    postFunction = function (url, data, callback) {
        if (callback) {
            callback(data);
        }
    },
	stamp = {},
	controls,
	sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	common =  require('../modules/common').common(localStorage),
	popup = require('../modules/popup').popup(),
	urls = require('../modules/urls').urls,
	router = require('../modules/routers').stampRouter(urls, window, func),
	tagInternals = require("../modules/_tags")._tags(),
	tags = require("../modules/tags").tags(tagInternals),
	searchInternals = require('../modules/_search')._search(tags, common),
	searchRouter = require('../modules/routers').searchRouter(urls, postFunction),
	search = require('../modules/search').search(searchInternals, common, searchRouter),
	sut = require('../modules/stamp').stamp(urls, router, popup, search, stamp),
	setup = function () {
		controls = {
			dropImage : $('<img/>'),
			backgroundPopup : $('<div/>'),
			popupImage : $('<div/>'),
			body : $('<body/>'),
			fullSizeImage : $('<div/>')
		};
		popup.initializeControls(controls);
		sut.initializeControls(controls);
	};
describe('stamp_module', function () {
	beforeEach(setup);
	describe('updateStamp', function () {
		it("should set stamp property value", function () {
			var obj = {name : 'foo', value : 'baz'};
			sut.updateStamp(obj);
			assert.strictEqual(stamp.foo, 'baz');
			obj = {name : 'bip', value : 'bop'};
			sut.updateStamp(obj);
			assert.strictEqual(stamp.foo, 'baz');
			assert.strictEqual(stamp.bip, 'bop');
		});
	});
	describe('getFullSizeImageUrl', function () {
		it("should get full size image path of dropImage src", function () {
			var spy = sinon.spy(urls, 'getFullSizeImageUrl'),
				src = 'foo';
			controls.dropImage.attr('src', src);
			sut.getFullSizeImageUrl();
			urls.getFullSizeImageUrl.restore();

			sinon.assert.calledWith(spy, src);
		});
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
	describe('assignPopupEvents', function () {
		it("should assign dropImage click event", function () {
			var spy;
			spy = sinon.spy(sut, 'dropImageClick');
			sut.assignPopupEvents();
			controls.dropImage.click();
			sut.dropImageClick.restore();

			sinon.assert.calledOnce(spy);
		});
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
			var stamp, canSave;
			stamp = {issuedBy : "Great Britain"};
			canSave = sut.canSaveStamp(stamp);
			assert.strictEqual(canSave, true);
		});
	});
	describe('upsertStamp', function () {
		describe('when can save stamp is false', function () {
			it("should not call router upsert stamp", function () {
				var spy, stub;
				spy = sinon.spy(router, 'upsertStamp');
				stub = sinon.stub(sut, 'canSaveStamp').returns(false);
				sut.upsertStamp(stamp, func);

				router.upsertStamp.restore();
				sut.canSaveStamp.restore();

				sinon.assert.notCalled(spy);

			});
		});
		describe('when can save stamp is true', function () {
			it("should call router upsert stamp", function () {
				var spy, stub, upsertCallbackStub;
				spy = sinon.spy(router, 'upsertStamp');
				stub = sinon.stub(sut, 'canSaveStamp').returns(true);
				upsertCallbackStub = sinon.stub(sut, 'createUpsertCallback').returns(func);

				sut.upsertStamp(stamp, func);

				router.upsertStamp.restore();
				sut.canSaveStamp.restore();
				sut.createUpsertCallback.restore();

				sinon.assert.calledWith(spy, stamp, func);

			});
		});
	});
});
