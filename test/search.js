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
	getLabel = function () {
		return $("<label/>");
	},
	assert = require('assert'),
	sinon = require('sinon'),
	common =  require('../modules/common').common(localStorage),
    tagsInternals = require("../modules/_tags")._tags(),
    tags = require("../modules/tags").tags(tagsInternals),
    searchInternals = require('../modules/_search')._search(tags, common),
    urls = require('../modules/urls').urls,
    router = require('../modules/routers').searchRouter(urls, postFunction),
    sut = require('../modules/search').search(searchInternals, common, router),
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
			},
			searchcriteria : getLabel(),
			collectioncriteria : getLabel(),
			collectionvalue : getLabel(),
			tagscriteria : getLabel(),
			tagsvalue : getLabel(),
			clearsearch : getLabel()
		};
		sut.initializeControls(controls);
	};
describe('search_module', function () {
	beforeEach(setup);
	describe('#createQueryAndSearch', function () {
		it("should create search criteria", function () {
			var spy;
			spy = sinon.spy(searchInternals, 'createQuery');
			sut.createQueryAndSearch();
			searchInternals.createQuery.restore();

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
	describe('#showHideClearSearch', function () {
		it("should get query info from internals", function () {
			var spy;
			spy = sinon.spy(searchInternals, "getQueryInfo");
			sut.showHideClearSearch();
			searchInternals.getQueryInfo.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should toggle clearsearch visibility", function () {
			var spy, stub;
			spy = sinon.spy(controls.clearsearch, 'toggle');
			stub = sinon.stub(searchInternals, "getQueryInfo").returns({
				hasCollection : false,
				hasTags : false
			});
			sut.showHideClearSearch();

			controls.clearsearch.toggle.restore();
			searchInternals.getQueryInfo.restore();

			sinon.assert.calledWith(spy, false);
		});
	});
	describe('#getStampIdDefaultImageIdImageSrcArray', function () {
		it("should try to get search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'getFromLocalStorage');
			sut.getStampIdDefaultImageIdImageSrcArray();
			common.getFromLocalStorage.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should call search router getStampIdDefaultImageIdImageSrcArray with query and callback", function () {
			var spy, stub, query;
			query = {};
			stub = sinon.stub(common, 'getFromLocalStorage').returns(query);
			spy = sinon.spy(router, 'getStampIdDefaultImageIdImageSrcArray');
			sut.getStampIdDefaultImageIdImageSrcArray(func);

			router.getStampIdDefaultImageIdImageSrcArray.restore();
			common.getFromLocalStorage.restore();

			sinon.assert.calledWith(spy, query, func);
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
				spy = sinon.spy(searchInternals, 'createQuery');
				sut.filterStampListings();
				searchInternals.createQuery.restore();

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
	describe('#displaySearchCriteria', function () {
		it("should try to get search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'getFromLocalStorage');
			sut.displaySearchCriteria();
			common.getFromLocalStorage.restore();

			assert(spy.withArgs('collectionOrTagsQuery').calledOnce);
		});
		it("should toggle clearsearch visibility", function () {
			var spy, stub;
			spy = sinon.spy(controls.clearsearch, 'toggle');
			stub = sinon.stub(searchInternals, "getQueryInfo").returns({
				hasCollection : false,
				hasTags : false
			});
			sut.displaySearchCriteria();

			controls.clearsearch.toggle.restore();
			searchInternals.getQueryInfo.restore();

			sinon.assert.calledWith(spy, false);
		});
		describe('when collection exists', function () {
			it("should display collection label and value", function () {
				var collectionLabelSpy, collectionValueSpy, stub, collection;
				collection = "airplanes";
				stub = sinon.stub(searchInternals, "getQueryInfo").returns({
					hasCollection : true,
					query : {collection : collection}
				});
				collectionLabelSpy = sinon.spy(controls.collectioncriteria, 'text');
				collectionValueSpy = sinon.spy(controls.collectionvalue, "text");
				sut.displaySearchCriteria();

				searchInternals.getQueryInfo.restore();
				controls.collectioncriteria.text.restore();
				controls.collectionvalue.text.restore();

				sinon.assert.calledWith(collectionLabelSpy, 'Collection: ');
				sinon.assert.calledWith(collectionValueSpy, collection);
			});
		});
		describe('when tags exists', function () {
			it("should display tag label and tags", function () {
				var tagsLabelSpy, tagsValueSpy, stub, tags;
				tags = ["airplanes", "horses", "saints"];
				stub = sinon.stub(searchInternals, "getQueryInfo").returns({
					hasTags : true,
					query : {tags : tags}
				});
				tagsLabelSpy = sinon.spy(controls.tagscriteria, 'text');
				tagsValueSpy = sinon.spy(controls.tagsvalue, "text");
				sut.displaySearchCriteria();

				searchInternals.getQueryInfo.restore();
				controls.tagscriteria.text.restore();
				controls.tagsvalue.text.restore();

				sinon.assert.calledWith(tagsLabelSpy, 'Tags: ');
				sinon.assert.calledWith(tagsValueSpy, "airplanes, horses, saints");
			});
		});
	});
});
