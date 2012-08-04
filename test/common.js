/*global  describe, it, beforeEach*/
"use strict";

var sut = require('../modules/common').Common,
	assert = require('assert'),
	sinon = require('sinon'),
	func,
	parent,
	toaster,
	text = 'done',
	top = 10,
	left = 20,
	width = 12.5,
	collections = {},
	localStorage = {collections : collections},
	setupToaster = function () {
		func = function () { return {hide : func, top : top, left: left }; };
		parent = {offset : func,  width : function () {return width; }};
		toaster = {addClass : func, css : func, text : func, show : func, hide: func, delay : function () {return this; }};
		text = 'done';
	};
describe('Common', function () {
	describe('#findFirst', function () {
		it("should find the first element in an array where the named property equals the passed in value", function () {
			var ford = {make : "Ford", color : "blue", vin: "4da4trafc87a"},
				mini = {make : "Mini", color : "red", vin: "a89ad54+fa89"},
				packard = {make : "Packard", color : "blue", vin: "d7a58tra456"},
				cars = [ford, mini, packard],
				actual;
			actual = sut.findFirst(cars, "color", "blue");
			assert.strictEqual(ford, actual);
			cars = [packard, ford, mini];
			actual = sut.findFirst(cars, "color", "blue");
			assert.strictEqual(packard, actual);
		});
	});
	describe('#inspect', function () {
		it("should report on object", function () {
			var ford = {make : "Ford", color : "blue", vin: "4da4trafc87a"}, actual, expected;
			actual = sut.inspect(ford, true);
			expected = "make=Ford\r\ncolor=blue\r\nvin=4da4trafc87a\r\n";
			assert.strictEqual(expected, actual);
		});
	});
	describe('#trim', function () {
		it("when string is undefined should return undefined", function () {
			var actual = sut.trim();
			assert.ok(!actual);
		});
		it("when string is empty undefined", function () {
			var actual = sut.trim('');
			assert.ok(!actual);
		});
		it("when string is whitespace should return undefined", function () {
			var actual = sut.trim('                ');
			assert.ok(!actual);
		});
		it("should trim string", function () {
			var actual;
			actual = sut.trim('      foo         ');
			assert.strictEqual("foo", actual);
			actual = sut.trim('foo                    ');
			assert.strictEqual("foo", actual);
			actual = sut.trim('                    foo');
			assert.strictEqual("foo", actual);
		});
	});
	describe('#getFromOrPlaceInLocalStorage', function () {
		beforeEach(function () { sut.initialize(localStorage); });
		describe('when object exists in LocalStorage', function () {
			it("should get object", function () {
				var actual,
					name = 'collections';
				actual = sut.getFromOrPlaceInLocalStorage(name, func);
				assert.strictEqual(collections, actual);
			});
		});
		describe('when object does not exist in LocalStorage', function () {
			it("should create object and place in LocalStorage", function () {
				var actual,
					name = 'tags',
					newObj = {},
					createFunction = function () {return newObj; };
				assert.ok(!localStorage.tags);
				actual = sut.getFromOrPlaceInLocalStorage(name, createFunction);
				assert.strictEqual(JSON.stringify(newObj), localStorage.tags);
			});
		});
	});
	describe('#showToaster', function () {
		beforeEach(setupToaster);
		it("should add css class to toaster", function () {
			var spy = sinon.spy(toaster, "addClass");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs('toaster').calledOnce);
		});
		it("should set css left to parent left", function () {
			var spy = sinon.spy(toaster, "css");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs('left', left).calledOnce);
		});
		it("should set css top to parent top", function () {
			var spy = sinon.spy(toaster, "css");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs('top', top).calledOnce);
		});
		it("should set css width to parent width()", function () {
			var spy = sinon.spy(toaster, "css");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs('width', width).calledOnce);
		});
		it("should set toaster text", function () {
			var spy = sinon.spy(toaster, "text");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs(text).calledOnce);
		});
		it("should show toaster", function () {
			var spy = sinon.spy(toaster, "show");
			sut.showToaster(parent, toaster, text);
			assert(spy.calledOnce);
		});
		it("should delay hiding toaster", function () {
			var spy = sinon.spy(toaster, "delay");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs(1000).calledOnce);
		});
		it("should hide toaster slowly", function () {
			var spy = sinon.spy(toaster, "hide");
			sut.showToaster(parent, toaster, text);
			assert(spy.withArgs("slow").calledOnce);
		});
	});
});


