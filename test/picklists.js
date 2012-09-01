/*global  describe, it, beforeEach*/
"use strict";
var localStorage = {},
	postFunction = function (url, obj, callback) {
		if(callback) {
			callback(data);
		}
	}, 
	assert = require('assert'),
	sinon = require('sinon'),
	common =  require('../modules/common').common(localStorage),
	urls = require('../modules/urls').urls,
	router = require('../modules/routers').picklistsRouter(urls, postFunction),
	sut = require('../modules/picklists').picklists(common, router),
	window = {},
	func = function () {},
	func1 = function (arg) {},
	data = {},
	setup = function () {
		localStorage = {};
	},
	teardown = function () {
		localStorage = {};
	};
describe('picklists', function () {
	beforeEach(setup);
	describe('#getDistinctTags', function () {
		it("should get tags from router", function () {
			var spy, callback;
			spy = sinon.spy(router, "getDistinctTags");
			sut.getTags(func);
			router.getDistinctTags.restore();

			assert(spy.calledOnce);
		});
		it("should return tags", function () {
			var  tags, actual, callback; 
			tags = ["a", "b", "c"];
			data = {tags : tags};
			callback = function (obj) {
				actual =  obj; 
			};
			sut.getTags(callback);

			assert.strictEqual(tags, actual);
		});
	});
	describe('#getCollections', function () {
		it("should get collections from router", function () {
			var spy = sinon.spy(router, "getDistinctCollections");
			sut.getCollections(func);
			router.getDistinctCollections.restore();

			assert(spy.calledOnce);
		});
		it("should return collections", function () {
			var  collections, actual, callback; 
			collections = ["a", "b", "c"];
			data = {collections : collections};
			callback = function (obj) {
				actual =  obj; 
			};
			sut.getCollections(callback);

			assert.strictEqual(collections, actual);
		});
	});
	describe('#getTagsAndCollections', function () {
		describe('when callback is undefined', function () {
			it("should not call router", function () {
				var spy = sinon.spy(router, "getDistinctTags");
				sut.getTagsAndCollections();
				router.getDistinctTags.restore();

				sinon.assert.notCalled(spy);
			});
		});
		describe('when callback is specified', function () {
			it("should call router", function () {
				var spy = sinon.spy(router, "getDistinctTags");
				sut.getTagsAndCollections(func);
				router.getDistinctTags.restore();

				sinon.assert.calledOnce(spy);
			});
		});
	});
	describe('#getCountryNames', function () {
		var temp = common.getStorage(),
			countryNames = ['France', 'Belgium'];
		describe('when country names exist in local storage', function () {
			beforeEach(function () {
				localStorage.countryNames = countryNames;
				common.setStorage(localStorage);
			});
			afterEach(function () {
				common.setStorage(temp);
			});
			it("should get country names from local storage", function () {
				var spyCommon = sinon.spy(common, "getFromOrPlaceInLocalStorage");
				sut.getCountryNames();
				common.getFromOrPlaceInLocalStorage.restore();

				assert(spyCommon.withArgs('countryNames', router.getAllCountryNames).calledOnce);
			});
			it("country names should not be fetched", function () {
				var spyRouter = sinon.spy(router, "getAllCountryNames");
				sut.getCountryNames();
				router.getAllCountryNames.restore();

				sinon.assert.notCalled(spyRouter);
			});
			it("should return country names", function () {
				var actual = sut.getCountryNames();
				assert.strictEqual(countryNames, actual);
			});
		});
		describe('when country names do not exist in local storage', function () {
			beforeEach(function () {delete localStorage.countryNames; });
			it("should fetch country names", function () {
				var routerSpy;
				routerSpy = sinon.spy(router, "getAllCountryNames");
				sut.getCountryNames();
				router.getAllCountryNames.restore();

				assert(routerSpy.calledOnce);
			});
			it("should return country names", function () {
				var stub, actual;
				stub = sinon.stub(router, "getAllCountryNames");
				stub.returns(countryNames);
				actual = sut.getCountryNames();
				router.getAllCountryNames.restore();

				assert.deepEqual(countryNames, actual);
			});
		});
	});
	describe('#setTagsAutocomplete', function () {
		var target, tags;
		beforeEach(function () {
			target = {autocomplete : func1, focus : func, blur : func, val : func};
			tags = ['blue', 'red'];
		});
		it("should get the tags to populate the autocomplete entry control", function () {
			var spy = sinon.spy(sut, "getTags");
			sut.setTagsAutocomplete(target, false);
			sut.getTags.restore();

			assert(spy.calledOnce);
		});
		it("should call entry control autocomplete with tags and a minumum length of zero", function () {
			var spy, stub;
			spy = sinon.spy(target, "autocomplete");
			stub = sinon.stub(sut, "getTags");
			stub.returns(tags);
			sut.setTagsAutocomplete(target, false);
			stub.args[0][0](tags);
			target.autocomplete.restore();
			sut.getTags.restore();

			assert(spy.withArgs({source: tags, minLength: 0}).calledOnce);
		});
		it("should set entry control focus event", function () {
			var spy, stub;
			spy = sinon.spy(target, "focus");
			stub = sinon.stub(sut, "getTags");
			sut.setTagsAutocomplete(target, false);
			stub.args[0][0](tags);
			target.focus.restore();
			sut.getTags.restore();

			assert(spy.calledOnce);

		});
	});
	describe('#setCollectionsAutocomplete', function () {
		var target, collections;
		beforeEach(function () {
			target = {autocomplete : func1, focus : func1, blur : func, val : func};
			collections = ['number ones', 'Great Britain'];
		});
		it("should get the collections to populate the autocomplete entry control", function () {
			var spy = sinon.spy(sut, "getCollections");
			sut.setCollectionsAutocomplete(target, false);
			sut.getCollections.restore();

			assert(spy.calledOnce);
		});
		it("should call entry control autocomplete with collections and a minumum length of zero", function () {
			var spy, stub;
			spy = sinon.spy(target, "autocomplete");
			stub = sinon.stub(sut, "getCollections");
			stub.returns(collections);
			sut.setCollectionsAutocomplete(target, false);
			stub.args[0][0](collections);
			target.autocomplete.restore();
			sut.getCollections.restore();

			assert(spy.withArgs({source: collections, minLength: 0}).calledOnce);
		});
		it("should set entry control focus event", function () {
			var spy, stub;
			spy = sinon.spy(target, "focus");
			stub = sinon.stub(sut, "getCollections");
			sut.setCollectionsAutocomplete(target, false);
			stub.args[0][0](collections);
			target.focus.restore();
			sut.getCollections.restore();

			assert(spy.calledOnce);
		});
	});
	describe('#setCountriesAutocomplete', function () {
		var target, countryNames, parsedCountryNames, skipVerify, callback,
			temp = common.getStorage();
		beforeEach(function () {
			target = {autocomplete : func1, focus : func, blur : func, val : func, get : func, css : func};
			countryNames = ['France', 'Belgium', 'Wallis &amp; Fortuna'];
			parsedCountryNames = ['France', 'Belgium', 'Wallis & Fortuna'];
			localStorage.countryNames = countryNames;
			common.setStorage(localStorage)
		});
		afterEach(function (){
			common.setStorage(temp)			
		});
		it("should get country names", function () {
			var spy;
			sinon.stub(router, "getAllCountryNames").returns(countryNames);
			spy = sinon.spy(sut, "getCountryNames");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			router.getAllCountryNames.restore();

			assert(spy.calledOnce);
		});
		it("should call entry control autocomplete with country names removing all ampersand escapes, and a minumum length of two", function () {
			var spy;
			spy = sinon.spy(target, "autocomplete");
			sinon.stub(router, "getAllCountryNames").returns(countryNames);
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			target.autocomplete.restore();
			router.getAllCountryNames.restore();

			assert(spy.withArgs({source: parsedCountryNames, minLength: 2 }).calledOnce);
		});
		it("should set entry control focus event", function () {
			var spy = sinon.spy(target, "focus");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			target.focus.restore();

			assert(spy.calledOnce);
		});
		it("should call target autocomplete once when entry control is empty", function () {
			var focusSpy, autocompleteSpy;
			sinon.stub(target, "val").returns('');
			sinon.stub(router, "getAllCountryNames").returns(countryNames);
			focusSpy = sinon.spy(target, "focus");
			autocompleteSpy = sinon.spy(target, "autocomplete");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			focusSpy.args[0][0]();
			router.getAllCountryNames.restore();
			target.val.restore();
			target.focus.restore();

			assert(autocompleteSpy.withArgs({source: parsedCountryNames, minLength : 2}).calledOnce);
			assert(autocompleteSpy.calledOnce);
		});
		it("should call target autocomplete only once when entry control is not empty", function () {
			var focusSpy, autocompleteSpy;
			sinon.stub(target, "val").returns('foo');
			focusSpy = sinon.spy(target, "focus");
			autocompleteSpy = sinon.spy(target, "autocomplete");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			focusSpy.args[0][0]();
			target.val.restore();
			target.autocomplete.restore();

			assert(autocompleteSpy.withArgs({source: parsedCountryNames, minLength: 2}).calledOnce);
		});
		describe('when skip verify is false', function () {
			var skipVerify = false;
			it("should set target blur event ", function () {
				var spy;
				spy = sinon.spy(target, "blur");
				sut.setCountriesAutocomplete(target, skipVerify, callback);
				target.blur.restore();

				assert(spy.calledOnce);
			});
			describe('and array is undefined', function () {
				it("should set entry control border to normal", function () {
					var blurSpy, cssSpy;
					blurSpy = sinon.spy(target, "blur");
					cssSpy = sinon.spy(target, "css");
					localStorage.countryNames = undefined;
					sinon.stub(router, "getAllCountryNames").returns(undefined);
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					router.getAllCountryNames.restore();
					target.blur.restore();
					target.css.restore();

					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
				});
			});
			describe('and array is empty', function () {
				it("should set entry control border to normal", function () {
					var blurSpy, cssSpy;
					blurSpy = sinon.spy(target, "blur");
					cssSpy = sinon.spy(target, "css");
					localStorage.countryNames = undefined;
					sinon.stub(router, "getAllCountryNames").returns([]);
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					router.getAllCountryNames.restore();
					target.blur.restore();
					target.css.restore();

					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
				});
			});
			describe('and entry text is empty', function () {
				it("should set entry control border to normal", function () {
					var blurSpy, cssSpy;
					blurSpy = sinon.spy(target, "blur");
					cssSpy = sinon.spy(target, "css");
					sinon.stub(target, "val").returns('');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.css.restore();
					target.val.restore();

					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
				});
				it("should fire callbacd", function () {
					var blurSpy, calledback;
					calledback = false;
					callback = function () {calledback = true; };
					blurSpy = sinon.spy(target, "blur");
					sinon.stub(target, "val").returns('');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.val.restore();

					assert.strictEqual(true, calledback);
				});
			});
			describe('and entry text is whitespace', function () {
				it("should set entry control border to normal", function () {
					var blurSpy, cssSpy;
					blurSpy = sinon.spy(target, "blur");
					cssSpy = sinon.spy(target, "css");
					sinon.stub(target, "val").returns('					');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.val.restore();
					target.css.restore();

					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
				});
			});
			describe('when entry text is not found in array', function () {
				it("should set entry control border to error", function () {
					var blurSpy, cssSpy;
					blurSpy = sinon.spy(target, "blur");
					cssSpy = sinon.spy(target, "css");
					sinon.stub(target, "val").returns('foo');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.val.restore();
					target.css.restore();

					assert(cssSpy.withArgs('border', '2px solid red').calledOnce);
				});
				it("should focus entry control", function () {
					var blurSpy, focusSpy;
					blurSpy = sinon.spy(target, "blur");
					focusSpy = sinon.spy(target, "focus");
					sinon.stub(target, "val").returns('foo');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.val.restore();
					target.focus.restore();

					assert(focusSpy.calledTwice);
				});
			});
			describe('when entry text is found in array', function () {
				it("should set entry control border to normal", function () {
					var blurSpy, cssSpy;
					blurSpy = sinon.spy(target, "blur");
					cssSpy = sinon.spy(target, "css");
					sinon.stub(target, "val").returns('Belgium');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.val.restore();
					target.css.restore();

					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
				});
				it("should fire the callback", function () {
					var blurSpy, calledback;
					calledback = false;
					callback = function () {calledback = true; };
					blurSpy = sinon.spy(target, "blur");
					sinon.stub(target, "val").returns('Belgium');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
					target.blur.restore();
					target.val.restore();

					assert.strictEqual(true, calledback);
				});
			});
		});
		describe('when skip verify is true', function () {
			var skipVerify = true;
			it("should not set target blur event when skip verify is true", function () {
				var spy;
				spy = sinon.spy(target, "blur");
				sut.setCountriesAutocomplete(target, true, callback);
				target.blur.restore();

				sinon.assert.notCalled(spy);
			});
			it("should fire the callback", function () {
				var calledback;
				callback = function () {calledback = true; };
				sut.setCountriesAutocomplete(target, true, callback);

				assert.strictEqual(true, calledback);
			});
		});
	});
});