/*global  describe, it, beforeEach, afterEach*/
"use strict";
var controls,
	tagControls,
	query = {collection : "gb", tags : ['a', 'b', 'c']},
	window = {},
	func = function () {},
	localStorage = {removeItem : func},
	postFunction = function () {return 'posted'; },
	$ = require('jquery'),
	assert = require('assert'),
	sinon = require('sinon'),
	common =  require('../modules/common').common(localStorage),
    _tags = require("../modules/_tags")._tags(),
    tags = require("../modules/tags").tags(_tags),
    methods = require('../modules/_search')._search(tags, common),
    urls = require('../modules/urls').urls,
    router = require('../modules/routers').searchRouter(urls, postFunction),
    sut = require('../modules/search').search(methods, common, router),
	setup = function () {
		localStorage.collectionOrTagsQuery =  query;
		tagControls = {
			getLocalTaglabels : function (tagValues) {
				return $([{innerText : 'birds'}, {innerText : 'bees'}]);
			}
		};
		tags.initializeControls(tagControls);
		controls = {
			collectionsource : {
				val : function () {return "gb"; }
			}
		};
		sut.initializeControls(controls);
	};
describe('SearchEngine', function () {
	beforeEach(setup);
	describe('#createQueryAndSearch', function () {
		it("should create search criteria", function () {
			var spy;
			spy = sinon.spy(methods, 'createQuery');
			sut.createQueryAndSearch();
			methods.createQuery.restore();

			assert(spy.calledOnce);
		});
		it("should filter listings based on search criteria", function () {
			var spy;
			spy = sinon.spy(sut, 'filterStampListings');
			sut.createQueryAndSearch(func);
			sut.filterStampListings.restore();

			assert(spy.withArgs(func).calledOnce);
		});
	});
	describe('#clearSearch', function () {
		it("should remove existing search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'removeLocalStorageKey');
			sut.clearSearch();
			common.removeLocalStorageKey.restore();

			assert(spy.withArgs('collectionOrTagsQuery').calledOnce);
		});
		it("should display all listings", function () {
			var spy, callback;
			callback = func;
			spy = sinon.spy(sut, 'filterStampListings');
			sut.clearSearch(func);
			sut.filterStampListings.restore();

			assert(spy.withArgs(func).calledOnce);
		});
	});
	describe('#filterStampListings', function () {
		it("should try to get search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'getFromLocalStorage');
			sut.filterStampListings();
			common.getFromLocalStorage.restore();

			assert(spy.withArgs('collectionOrTagsQuery').calledOnce);

		});
		describe('when search criteria is not found in local storage', function () {
			var temp = common.getFromLocalStorage;
			beforeEach(function () {
				common.getFromLocalStorage = function () { return null; };
			});
			afterEach(function () {
				common.getFromLocalStorage = temp;
			});
			it("should create search criteria", function () {
				var spy;
				spy = sinon.spy(methods, 'createQuery');
				sut.filterStampListings();
				methods.createQuery.restore();

				assert(spy.calledOnce);
			});
		});
		describe('when search criteria is found in local storage', function () {
			it("should get listings from persistence using search criteria", function () {
				var spy;
				spy = sinon.spy(router, 'filterStampListings');
				sut.filterStampListings(func);
				router.filterStampListings.restore();

				assert.deepEqual(query, spy.args[0][0]);
			});
			it("should display the new search criteria", function () {
				var spy, stub;
				spy = sinon.spy(router, 'filterStampListings');
				stub = sinon.stub(common, 'getFromLocalStorage');
				stub.returns(query);
				sut.filterStampListings(func);
				router.filterStampListings.restore();
			    common.getFromLocalStorage.restore();

				sinon.assert.calledWith(spy, query, func);
			});
		});
	});
});
