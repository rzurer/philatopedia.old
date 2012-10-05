/*global  describe, beforeEach, afterEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	localStorage = {},
	common =  require('../modules/common').common(localStorage),
	sut = require('../modules/slider').slider(common),
	controls,
	clientWidth = 10,
	getImage = function () {
		return $('<img/>');
	},
	createListItem = function () {
		return $('<li/>');
	},
	createInput = function (value) {
		var input = $('<input/>');
		input.val(value)
		return input;
	},
	getListItem = function (name) {
		var li = createListItem();
		li.clientWidth = clientWidth;
		li.name = name;
		return li;
	},
	callback = function () {},
	setup = function () {
		controls = {
			ul : $('<ul/>'),
			items : [getListItem("a"), getListItem("b"), getListItem("c")],
			prev: getImage(),
			next: getImage()
		};
	};
describe('slider_module', function () {
	beforeEach(setup);
	describe('ready', function () {
		it("should set list width to item client width times list item count", function () {
			var expected, actual;
			sut.ready(controls, callback);
			expected = (controls.items.length * clientWidth) + 'px';
			actual = controls.ul.css("width");
			assert.equal(actual, expected);
		});
		it("should set current index to zero", function () {
			var expected, actual;
			sut.ready(controls, callback);
			expected = sut.getCurrentIndex();
			actual = 0;
			assert.strictEqual(actual, expected);
		});
		it("should set next image click event", function () {
			var expected, actual;
			sut.ready(controls, callback);
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 0);
			controls.next.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 1);
			controls.next.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 2);
			controls.next.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 2);
		});
		it("should set prev image click event", function () {
			var expected, actual;
			sut.ready(controls, callback);
			controls.next.click();
			controls.next.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 2);
			controls.prev.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 1);
			controls.prev.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 0);
			controls.prev.click();
			actual = sut.getCurrentIndex();
			assert.strictEqual(actual, 0);
		});
		it("should call common disableControls", function () {
			var spy;
			spy = sinon.spy(common, 'disableControls');
			sut.ready(controls, callback);
			common.disableControls.restore();

			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, [controls.prev, controls.next]);
		});
		it("should call callback", function () {
			var count = 0;
			var goToCallback = function () {
				count = 42;
			}
			sut.ready(controls, goToCallback);
			assert.strictEqual(count, 42);
		});
		describe('when index is first', function () {
			it("should call common enableControls", function () {
				var spy;
				spy = sinon.spy(common, 'enableControl');
				sut.ready(controls, callback);
				common.enableControl.restore();

				sinon.assert.calledOnce(spy);
				sinon.assert.calledWith(spy, controls.next);
			});
			it("should disable prev image and enable next image", function () {
				sut.ready(controls, callback);
				assert.strictEqual(controls.prev.css('opacity'), '0.3')
				assert.strictEqual(controls.next.css('opacity'), '1')
			});
			it("should set left to expected", function () {
				var actual, expected;
				sut.ready(controls, callback);
				actual = controls.ul.css('left');
				expected = '-0%';
				assert.strictEqual(actual, expected);
			});
		});
		describe('when index is last', function () {
			it("should disable prev image and enable next image", function () {
				sut.ready(controls, callback);
				controls.next.click();
				controls.next.click();
				assert.strictEqual(controls.next.css('opacity'), '0.3')
				assert.strictEqual(controls.prev.css('opacity'), '1')
			});
			it("should set left to expected", function () {
				var actual, expected;
				sut.ready(controls, callback);
				controls.next.click();
				controls.next.click();
				actual = controls.ul.css('left');
				expected = '-200%';
				assert.strictEqual(actual, expected);
			});
		});
		describe('when index is neither first nor last', function () {
			it("should call common enableControls thrice", function () {
				var spy;
				spy = sinon.spy(common, 'enableControl');
				sut.ready(controls, callback);
				controls.next.click();
				common.enableControl.restore();

				sinon.assert.calledThrice(spy);
			});
			it("should enable prev image and next image", function () {
				sut.ready(controls, callback);
				controls.next.click();
				assert.strictEqual(controls.next.css('opacity'), '1')
				assert.strictEqual(controls.prev.css('opacity'), '1')
			});
			it("should set left to expected", function () {
				var actual, expected;
				sut.ready(controls, callback);
				controls.next.click();
				actual = controls.ul.css('left');
				expected = '-100%';
				assert.strictEqual(actual, expected);
			});
		});
	});
	describe('isEmpty', function () {
		it("should return false when there are list items", function () {
			var actual;
			sut.ready(controls, callback);
			actual = sut.isEmpty();
			assert.strictEqual(actual, false);
		});
		it("should return true when there list items is undefined", function () {					
			var actual;
			controls.items = undefined;
			sut.ready(controls, callback);
			actual = sut.isEmpty();
			assert.strictEqual(actual, true);
		});
		it("should return true when there ar no list items ", function () {					
			var actual;
			controls.items = [];
			sut.ready(controls, callback);
			actual = sut.isEmpty();
			assert.strictEqual(actual, true);
		});
	});
});
