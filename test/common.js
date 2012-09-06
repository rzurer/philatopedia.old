/*global  describe, it, beforeEach*/
"use strict";
var collections = {},
	localStorage = {collections : collections, removeItem : function (key) {}},
	sut = require('../modules/common').common(localStorage),
	assert = require('assert'),
	sinon = require('sinon'),
	sut,
	func,
	parent,
	toaster,
	text = 'done',
	top = 10,
	left = 20,
	width = 12.5,
	setupToaster = function () {
		func = function () { return {hide : func, top : top, left: left }; };
		parent = {offset : func,  width : function () {return width; }};
		toaster = {addClass : func, css : func, text : func, show : func, hide: func, delay : function () {return this; }};
		text = 'done';
	};
describe('common_module', function () {
	describe('findFirst', function () {
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
	describe('scrutinize', function () {
		it("should report on object", function () {
			var ford = {make : "Ford", color : "blue", vin: "4da4trafc87a"}, actual, expected;
			actual = sut.scrutinize(ford, true);
			expected = "make=Ford\r\ncolor=blue\r\nvin=4da4trafc87a\r\n";
			assert.strictEqual(expected, actual);
		});
	});
	describe('trim', function () {
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
	describe('getFromOrPlaceInLocalStorage', function () {
		it("should get object when object exists in LocalStorage", function () {
			var actual,
				name = 'collections';
			actual = sut.getFromOrPlaceInLocalStorage(name, func);
			assert.strictEqual(collections, actual);
		});
		it("should create object and place in LocalStorage when object does not exist in LocalStorage", function () {
			var actual,
				name = 'tags',
				newObj = {},
				createFunction = function () {return newObj; };
			assert.ok(!localStorage.tags);
			actual = sut.getFromOrPlaceInLocalStorage(name, createFunction);
			assert.strictEqual(JSON.stringify(newObj), localStorage.tags);
		});
	});
	describe('removeLocalStorageKey', function () {
		it("should remove item from local storage", function () {
			var spy = sinon.spy(localStorage, "removeItem");
			sut.removeLocalStorageKey("foo");
			localStorage.removeItem.restore();

			assert(spy.withArgs('foo').calledOnce);
		});
	});
	describe('placeInLocalStorage', function () {
		it("should add item to local storage as json", function () {
			var item =  {firstName : 'hello', lastName: 'kitty'};
			sut.placeInLocalStorage("cat", item);
			assert.equal(JSON.stringify(item), localStorage.cat);
		});
	});
	describe('getFromLocalStorage', function () {
		it("should retrieve item from local storage as javascript object", function () {
			var item, retrieved;
			item =  {firstName : 'hello', lastName: 'kitty'};
			sut.placeInLocalStorage("cat", item);
			retrieved = sut.getFromLocalStorage("cat");
			assert.deepEqual(item, retrieved);
		});
	});
	describe('showToaster', function () {
		beforeEach(setupToaster);
		it("should add css class to toaster", function () {
			var spy = sinon.spy(toaster, "addClass");
			sut.showToaster(parent, toaster, text);
			toaster.addClass.restore();

			assert(spy.withArgs('toaster').calledOnce);
		});
		it("should set css left to parent left", function () {
			var spy = sinon.spy(toaster, "css");
			sut.showToaster(parent, toaster, text);
			toaster.css.restore();

			assert(spy.withArgs('left', left).calledOnce);
		});
		it("should set css top to parent top", function () {
			var spy = sinon.spy(toaster, "css");
			sut.showToaster(parent, toaster, text);
			toaster.css.restore();

			assert(spy.withArgs('top', top).calledOnce);
		});
		it("should set css width to parent width()", function () {
			var spy = sinon.spy(toaster, "css");
			sut.showToaster(parent, toaster, text);
			toaster.css.restore();

			assert(spy.withArgs('width', width).calledOnce);
		});
		it("should set toaster text", function () {
			var spy = sinon.spy(toaster, "text");
			sut.showToaster(parent, toaster, text);
			toaster.text.restore();

			assert(spy.withArgs(text).calledOnce);
		});
		it("should show toaster", function () {
			var spy = sinon.spy(toaster, "show");
			sut.showToaster(parent, toaster, text);
			toaster.show.restore();

			assert(spy.calledOnce);
		});
		it("should delay hiding toaster", function () {
			var spy = sinon.spy(toaster, "delay");
			sut.showToaster(parent, toaster, text);
			toaster.delay.restore();

			assert(spy.withArgs(1000).calledOnce);
		});
		it("should hide toaster slowly", function () {
			var spy = sinon.spy(toaster, "hide");
			sut.showToaster(parent, toaster, text);
			toaster.hide.restore();

			assert(spy.withArgs("slow").calledOnce);
		});
	});
	describe('getObjectInfo', function () {
		it("should return empty array when object is undefined", function () {
			var array = sut.getObjectInfo();
			assert.ok(array);
			assert.strictEqual(0, array.length);
		});
		it("should return empty array when object has no properties", function () {
			var array = sut.getObjectInfo({});
			assert.ok(array);
			assert.strictEqual(0, array.length);
		});
		it("should return an array containing name value pairs when object has properties", function () {
			var array = sut.getObjectInfo({ a : 'foo', b : 'bar'});
			assert.strictEqual(2, array.length);
			assert.deepEqual({name : 'a', value: 'foo'}, array[0]);
			assert.deepEqual({name : 'b', value: 'bar'}, array[1]);
		});
	});
	describe('getPropertyCount', function () {
		it("should return the count of properties", function () {
			var count = sut.getPropertyCount({ a : 'foo', b : 'bar'});
			assert.strictEqual(2, count);
		});
	});
	describe('propertiesExist', function () {
		it("should return true when properties exist", function () {
			var propertiesExist = sut.propertiesExist({ a : 'foo', b : 'bar'});
			assert.ok(propertiesExist);
		});
		it("should return false when properties exist", function () {
			var propertiesExist = sut.propertiesExist({});
			assert.ok(!propertiesExist);
		});
	});
});


