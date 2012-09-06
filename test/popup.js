/*global  describe, beforeEach, afterEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	func = function () {},
	sut,
	controls,
	setup = function () {
		controls = {
			backgroundPopup : $('<div/>'),
			popupImage : $('<div/>'),
			body : $('<body/>'),
			popupImageClose:  $('<a/>')
		};
		sut = require('../modules/popup').popup();
		sut.initializeControls(controls);
		sut.setPopupStatus(0);
	};
describe('popup_module', function () {
	beforeEach(setup);
	describe('assignEventHandlers', function () {
		it("should set backgroundPopup click event to disablePopup", function () {
			var spy;
			spy = sinon.spy(sut, 'disablePopup');
			sut.assignEventHandlers();
			controls.backgroundPopup.click();
			sut.disablePopup.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should set popupImageClose click event to disablePopup", function () {
			var spy;
			spy = sinon.spy(sut, 'disablePopup');
			sut.assignEventHandlers();
			controls.popupImageClose.click();
			sut.disablePopup.restore();

			sinon.assert.calledOnce(spy);
		});
	});
	describe('loadPopup', function () {
		it("should set the opacity of the backgroundPopup to 0.7", function () {
			var spy = sinon.spy(controls.backgroundPopup, 'css');
			sut.loadPopup();
			controls.backgroundPopup.css.restore();

			sinon.assert.calledWith(spy, {"opacity": "0.7"});
		});
		it("should fadin the backgroundPopup slowly", function () {
			var spy = sinon.spy(controls.backgroundPopup, 'fadeIn');
			sut.loadPopup();
			controls.backgroundPopup.fadeIn.restore();

			sinon.assert.calledWith(spy, "slow");
		});
		it("should fadin the popupImage slowly", function () {
			var spy = sinon.spy(controls.popupImage, 'fadeIn');
			sut.loadPopup();
			controls.popupImage.fadeIn.restore();

			sinon.assert.calledWith(spy, "slow");
		});
		it("should set the popupStatus to 1", function () {
			var popupStatus;
			popupStatus = sut.getPopupStatus();
			assert.strictEqual(popupStatus, 0);
			sut.loadPopup();
			popupStatus = sut.getPopupStatus();
			assert.strictEqual(popupStatus, 1);
		});
	});
	describe('showPopup', function () {
		it("should set popup image absolute position", function () {
			var spy = sinon.spy(controls.popupImage, 'css'),
				width = 100,
				height = 100,
				position;
			sut.showPopup(width, height);
			controls.popupImage.css.restore();
			position = {"position": "absolute", "top": -50, "left": -50};

			sinon.assert.calledWith(spy, position);
		});
		it("should load Popup", function () {
			var spy = sinon.spy(sut, 'loadPopup'),
				width = 100,
				height = 100;
			sut.showPopup(width, height);
			sut.loadPopup.restore();

			sinon.assert.calledOnce(spy);
		});
	});
	describe('disablePopup', function () {
		var tempBackgroundPopup, tempPopupImage;
		beforeEach(function () {
			tempBackgroundPopup = controls.backgroundPopup;
			tempPopupImage = controls.popupImage;
			controls.backgroundPopup = {fadeOut : function (speed) {}};
			controls.popupImage = {fadeOut : function (speed) {}};
			sut.setPopupStatus(1);
		});
		afterEach(function () {
			controls.backgroundPopup = tempBackgroundPopup;
			controls.popupImage = tempPopupImage;
		});
		it("should fadout the backgroundPopup slowly", function () {

			var spy = sinon.spy(controls.backgroundPopup, 'fadeOut');
			sut.disablePopup();
			controls.backgroundPopup.fadeOut.restore();

			sinon.assert.calledWith(spy, "slow");
		});
		it("should fadout the popupImage slowly", function () {
			var spy = sinon.spy(controls.popupImage, 'fadeOut');
			sut.disablePopup();
			controls.popupImage.fadeOut.restore();

			sinon.assert.calledWith(spy, "slow");
		});
		it("should set the popupStatus to 0", function () {
			var popupStatus;
			popupStatus = sut.getPopupStatus();

			assert.strictEqual(popupStatus, 1);
			sut.disablePopup();
			popupStatus = sut.getPopupStatus();

			assert.strictEqual(popupStatus, 0);
		});
	});
});