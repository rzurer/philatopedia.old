/*global  describe, it, beforeEach*/
"use strict";
var sut = require('../modules/picklists').Picklists,
	router = require('../modules/routers').PicklistsRouter,
	common = require('../modules/common').Common,
	urls = require('../modules/urls').Urls,
	assert = require('assert'),
	sinon = require('sinon'),
	window = {},
	func = function () {},
	func1 = function (arg) {},
	postFunction = function (url, obj, callback) {
		//callback();
	}, 
	localStorage,
	setup = function () {
		localStorage = {};
		common.initialize(localStorage);
		router.initialize(urls, postFunction);
		sut.initialize(router, common);
	},
	teardown = function () {
		localStorage = {};
	};
describe('Picklists', function () {
	beforeEach(setup);
	describe('#getDistinctTags', function () {
		it("should get tags from router", function () {
			var spy = sinon.spy(router, "getDistinctTags");
			sut.getTags();
			assert(spy.calledOnce);
			router.getDistinctTags.restore();
		});
		it("should return tags", function () {
			var stub = sinon.stub(router, "getDistinctTags"),
				tags = {tags:["a", "b", "c"]},
				actual,
				callback = function (data) {actual = data; };
			stub.yields(tags); 
			sut.getTags(callback);
			assert.strictEqual(tags, actual);
			router.getDistinctTags.restore();
		});
	});
	describe('#getCollections', function () {
		it("should get collections from router", function () {
			var spy = sinon.spy(router, "getDistinctCollections");
			sut.getCollections();
			assert(spy.calledOnce);
			router.getDistinctCollections.restore();
		});
		it("should return collections", function () {
			var stub = sinon.stub(router, "getDistinctCollections"),
				data = {collections : ["a", "b", "c"]},
				actual,
				callback = function (data) {actual = data; };
			stub.yields(data);
			sut.getCollections(callback);
			assert.strictEqual(data.collections, actual.collections);
			router.getDistinctCollections.restore();
		});
	});
	describe('#getCountryNames', function () {
		var countryNames = ['France', 'Belgium'];
		describe('when country names exist in local storage', function () {
			beforeEach(function () {localStorage.countryNames = countryNames; });
			it("should get country names from local storage", function () {
				var spyCommon = sinon.spy(common, "getFromOrPlaceInLocalStorage");
				sut.getCountryNames();
				assert(spyCommon.withArgs('countryNames', router.getAllCountryNames).calledOnce);
				common.getFromOrPlaceInLocalStorage.restore();
			});
			it("country names should not be fetched", function () {
				var spyRouter = sinon.spy(router, "getAllCountryNames");
				sut.getCountryNames();
				sinon.assert.notCalled(spyRouter);
				router.getAllCountryNames.restore();
			});
			it("should return country names", function () {
				var actual = sut.getCountryNames();
				assert.strictEqual(countryNames, actual);
			});
		});
		describe('when country names do not exist in local storage', function () {
			beforeEach(function () {delete localStorage.countryNames; });
			it("should fetch country names", function () {
				var commonSpy, routerSpy;
				routerSpy = sinon.spy(router, "getAllCountryNames");

				sut.getCountryNames();
				assert(routerSpy.calledOnce);

				router.getAllCountryNames.restore();
			});
			it("should return country names", function () {
				var stub, actual;
				stub = sinon.stub(router, "getAllCountryNames");
				stub.returns(countryNames);
				actual = sut.getCountryNames();
				assert.deepEqual(countryNames, actual);
				router.getAllCountryNames.restore();
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
			assert(spy.calledOnce);
			sut.getTags.restore();
		});
		it("should call entry control autocomplete with tags and a minumum length of zero", function () {
			var spy, stub;
			spy = sinon.spy(target, "autocomplete");
			stub = sinon.stub(sut, "getTags");
			stub.returns(tags);

			sut.setTagsAutocomplete(target, false);
			stub.args[0][0](tags);

			assert(spy.withArgs({source: tags, minLength: 0}).calledOnce);
			target.autocomplete.restore();
			sut.getTags.restore();
		});

		it("should set entry control focus event", function () {
			var spy, stub;
			spy = sinon.spy(target, "focus");
			stub = sinon.stub(sut, "getTags");

			sut.setTagsAutocomplete(target, false);
			stub.args[0][0](tags);

			assert(spy.calledOnce);

			target.focus.restore();
			sut.getTags.restore();
		});
		// it("should call target autocomplete twice when entry control is empty", function () {
		// 	var focusSpy, autocompleteSpy, valStub, getTagsStub;
		// 	focusSpy = sinon.spy(target, "focus");
		// 	autocompleteSpy = sinon.spy(target, "autocomplete");
		// 	valStub = sinon.stub(target, "val");
		// 	getTagsStub = sinon.stub(sut, "getTags");
		// 	getTagsStub.returns(tags);
		// 	valStub.returns('');

		// 	sut.setTagsAutocomplete(target, false);
		// 	//focusSpy.args[0][0]();
		// 	getTagsStub.args[0][0](tags);

		// 	assert(autocompleteSpy.withArgs({source: tags, minLength: 0}).calledOnce);
		// 	assert(autocompleteSpy.withArgs("search").calledOnce);
		// 	//assert(autocompleteSpy.calledTwice);

		// 	target.focus.restore();
		// 	target.autocomplete.restore();
		// 	target.val.restore();
		// 	sut.getTags.restore();
		// });
		// it("should call target autocomplete only once when entry control is not empty", function () {
		// 	var focusSpy, autocompleteSpy;
		// 	sinon.stub(target, "val").returns('foo');
		// 	focusSpy = sinon.spy(target, "focus");
		// 	autocompleteSpy = sinon.spy(target, "autocomplete");
		// 	sut.setTagsAutocomplete(target, false);
		// 	focusSpy.args[0][0]();
		// 	sinon.assert.calledOnce(autocompleteSpy);
		// });
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
			assert(spy.calledOnce);
			sut.getCollections.restore();
		});
	// 		setCollectionsAutocomplete : function (target, skipVerify) {
	// 	this.getCollections(function (collections) {
	// 		setAutocomplete(target, 0, collections, null, skipVerify);
	// 	});
	// },
		it("should call entry control autocomplete with collections and a minumum length of zero", function () {

			var spy, stub;
			spy = sinon.spy(target, "autocomplete");
			stub = sinon.stub(sut, "getCollections");
			stub.returns(collections);

			sut.setCollectionsAutocomplete(target, false);
			stub.args[0][0](collections);

			assert(spy.withArgs({source: collections, minLength: 0}).calledOnce);
			target.autocomplete.restore();
			sut.getCollections.restore();
		});
		it("should set entry control focus event", function () {

			var spy, stub;
			spy = sinon.spy(target, "focus");
			stub = sinon.stub(sut, "getCollections");

			sut.setCollectionsAutocomplete(target, false);
			stub.args[0][0](collections);

			assert(spy.calledOnce);

			target.focus.restore();
			sut.getCollections.restore();
		});
		// it("should call target autocomplete twice when entry control is empty", function () {
		// 	var focusSpy, autocompleteSpy;
		// 	sut.getCollections.restore();
		// 	sinon.stub(target, "val").returns('');
		// 	sinon.stub(sut, "getCollections").returns(collections);
		// 	focusSpy = sinon.spy(target, "focus");
		// 	autocompleteSpy = sinon.spy(target, "autocomplete");
		// 	sut.setCollectionsAutocomplete(target, false);
		// 	focusSpy.args[0][0]();
		// 	assert(autocompleteSpy.withArgs({source: collections, minLength: 0}).calledOnce);
		// 	assert(autocompleteSpy.withArgs("search").calledOnce);
		// 	assert(autocompleteSpy.calledTwice);
		// });
		// it("should call target autocomplete only once when entry control is not empty", function () {
		// 	var focusSpy, autocompleteSpy;
		// 	sinon.stub(target, "val").returns('foo');
		// 	focusSpy = sinon.spy(target, "focus");
		// 	autocompleteSpy = sinon.spy(target, "autocomplete");
		// 	sut.setCollectionsAutocomplete(target, false);
		// 	focusSpy.args[0][0]();
		// 	sinon.assert.calledOnce(autocompleteSpy);
		// });
	});
	describe('#setCountriesAutocomplete', function () {
		var target, countryNames, parsedCountryNames, skipVerify, callback;
		beforeEach(function () {
			target = {autocomplete : func1, focus : func, blur : func, val : func, get : func, css : func};
			countryNames = ['France', 'Belgium', 'Wallis &amp; Fortuna'];
			parsedCountryNames = ['France', 'Belgium', 'Wallis & Fortuna'];
			localStorage.countryNames = countryNames;
		});
		it("should get country names", function () {
			var spy;
			sinon.stub(router, "getAllCountryNames").returns(countryNames);
			spy = sinon.spy(sut, "getCountryNames");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			assert(spy.calledOnce);
			router.getAllCountryNames.restore();

		});
		it("should call entry control autocomplete with country names removing all ampersand escapes, and a minumum length of two", function () {
			var spy;
			spy = sinon.spy(target, "autocomplete");
			sinon.stub(router, "getAllCountryNames").returns(countryNames);
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			assert(spy.withArgs({source: parsedCountryNames, minLength: 2 }).calledOnce);
			target.autocomplete.restore();
			router.getAllCountryNames.restore();
		});
		it("should set entry control focus event", function () {
			var spy = sinon.spy(target, "focus");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
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
			assert(autocompleteSpy.withArgs({source: parsedCountryNames, minLength : 2}).calledOnce);
			assert(autocompleteSpy.calledOnce);
			router.getAllCountryNames.restore();
			target.val.restore();
			target.focus.restore();
		});
		it("should call target autocomplete only once when entry control is not empty", function () {
			var focusSpy, autocompleteSpy;
			sinon.stub(target, "val").returns('foo');
			focusSpy = sinon.spy(target, "focus");
			autocompleteSpy = sinon.spy(target, "autocomplete");
			sut.setCountriesAutocomplete(target, skipVerify, callback);
			focusSpy.args[0][0]();
			assert(autocompleteSpy.withArgs({source: parsedCountryNames, minLength: 2}).calledOnce);
		});
		describe('when skip verify is false', function () {
			var skipVerify = false;
			it("should set target blur event ", function () {
				var spy;
				spy = sinon.spy(target, "blur");
				sut.setCountriesAutocomplete(target, skipVerify, callback);
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
					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
					router.getAllCountryNames.restore();
					target.blur.restore();
					target.css.restore();
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
					assert(cssSpy.withArgs('border', 'solid 1px #E5E5E5').calledOnce);
					router.getAllCountryNames.restore();
					target.blur.restore();
					target.css.restore();
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
					assert(cssSpy.withArgs('border', '2px solid red').calledOnce);
				});
				it("should focus entry control", function () {
					var blurSpy, focusSpy;
					blurSpy = sinon.spy(target, "blur");
					focusSpy = sinon.spy(target, "focus");
					sinon.stub(target, "val").returns('foo');
					sut.setCountriesAutocomplete(target, skipVerify, callback);
					blurSpy.args[0][0]();
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