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
			body : $('<body/>')
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
});