/*global  describe, it, beforeEach, afterEach*/
"use strict";
var sut = require('../modules/search').search,
	common  = require('../modules/common').Common,
	internals = require('../modules/_search').privateMembers,
	router = require('../modules/routers').SearchRouter,
	urls = require('../modules/urls').Urls,
	tags = require('../modules/tags').tags,
	tagInternals = require('../modules/_tags').internals,
	assert = require('assert'),
	sinon = require('sinon'),
	func = function () {},
	controls,
	tagControls,
	query,
	localStorage,
	window = {},
	postFunction = function () {return 'posted'; },
	setup = function () {
		Array.prototype.each = [].forEach;
		query = {collection : "gb", tags : ['a', 'b', 'c']},
		localStorage = {removeItem : func, collectionOrTagsQuery : query},
		tagControls = {localTaglabels : []};
		tags.initialize(tagControls, tagInternals);
		common.initialize(localStorage);
		router.initialize(urls, postFunction);
		controls = {
			collectionsource : {
				val : function () {return "gb"; }
			}
		};
		sut.initialize(internals, common, router, tags);
		sut.initializeControls(controls);
	},
	teardown = function () {
		delete Array.prototype.each;
	};
describe('SearchEngine', function () {
	beforeEach(setup);
	afterEach(teardown);
	describe('#createQueryAndSearch', function () {
		it("should create search criteria", function () {
			var spy;
			spy = sinon.spy(internals, 'createQuery');
			sut.createQueryAndSearch();
			assert(spy.calledOnce);
			internals.createQuery.restore();
		});
		it("should filter listings based on search criteria", function () {
			var spy;
			spy = sinon.spy(sut, 'filterStampListings');
			sut.createQueryAndSearch(func);
			assert(spy.withArgs(func).calledOnce);
			sut.filterStampListings.restore();
		});
	});
	describe('#clearSearch', function () {
		it("should remove existing search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'removeLocalStorageKey');
			sut.clearSearch();
			assert(spy.withArgs('collectionOrTagsQuery').calledOnce);
			common.removeLocalStorageKey.restore();
		});
		it("should display all listings", function () {
			var spy, callback;
			callback = func;
			spy = sinon.spy(sut, 'filterStampListings');
			sut.clearSearch(func);
			assert(spy.withArgs(func).calledOnce);
			sut.filterStampListings.restore();
		});
	});
	describe('#filterStampListings', function () {
		it("should try to get search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'getFromLocalStorage');
			sut.filterStampListings();
			assert(spy.withArgs('collectionOrTagsQuery').calledOnce);
			spy.restore();
		});
		describe('when search criteria is not found in local storage', function () {
			beforeEach(function () {
				var cmn = {
					getFromLocalStorage : function () { return null; },
					placeInLocalStorage : func
				}
				sut.initialize(internals, cmn, router, tags);
			});
			afterEach(function () {
				sut.initialize(internals, common, router, controls, tags);
			});
			it("should create search criteria", function () {
				var spy;
				spy = sinon.spy(internals, 'createQuery');
				sut.filterStampListings();
				assert(spy.calledOnce);
				internals.createQuery.restore();
			});
		});
		describe('when search criteria is found in local storage', function () {
			it("should get listings from persistence using search criteria", function () {
				var spy;
				spy = sinon.spy(router, 'filterStampListings');
				sut.filterStampListings(func);
				assert.deepEqual(query, spy.args[0][0]);
				router.filterStampListings.restore();
			});
			it("should display the new search criteria", function () {
				var routerSpy, internalsSpy;
				routerSpy = sinon.spy(router, 'filterStampListings');
				internalsSpy = sinon.spy(internals, 'displaySearchCriteria');
				sut.filterStampListings(func);
				routerSpy.args[0][1]();
				assert(internalsSpy.withArgs(func).calledOnce);
				router.filterStampListings.restore();
				internals.displaySearchCriteria.restore();
			});
		});
	});
});
