"use strict";
/*global  describe, beforeEach, it, afterEach*/
var assert = require('assert'),
	sinon = require('sinon'),
	$ = require('jquery'),
	func = function () {},
	localStorage = {removeItem : func, collectionOrTagsQuery : {}, getLocalTagsValues : func},
    common =  require('../modules/common').common(localStorage),
    _tags = require("../modules/_tags")._tags(),
    tags = require("../modules/tags").tags(_tags),
    sut = require('../modules/_search')._search(tags, common),
	controls,
	tagControls,
	localStorage,
	setup = function () {
		tagControls = {
			getLocalTaglabels : function (tagValues) {
				return $([{innerText : 'birds'}, {innerText : 'bees'}]);
			}
		};
		tags.initializeControls(tagControls);
		controls = {
			collectionsource : {val : function () {return 'animals and insects'; }}
		};
		sut.initializeControls(controls);
	};
describe('_search_module', function () {
	beforeEach(setup);
	describe('#createQuery', function () {
		it("should get collection from collection entry control) ", function () {
			var spy;
			spy = sinon.spy(controls.collectionsource, 'val');
			sut.createQuery();
			assert(spy.calledOnce);
			controls.collectionsource.val.restore();
		});
		it("should place query in local storage) ", function () {
			var spy;
			spy = sinon.spy(common, 'placeInLocalStorage');
			sut.createQuery();
			assert(spy.calledOnce);
			common.placeInLocalStorage.restore();
		});
		it("should return query with collection from collection text entry and tags from tag labels) ", function () {
			var query, expected;
			query = sut.createQuery();
			assert.strictEqual('animals and insects', query.collection);
			assert.deepEqual(['birds', 'bees'], query.tags);
		});
	});
	describe('#getQueryInfo', function () {
		it("should try to get search criteria from local storage", function () {
			var spy;
			spy = sinon.spy(common, 'getFromLocalStorage');
			sut.getQueryInfo();
			assert(spy.calledOnce);
			common.getFromLocalStorage.restore();
		});
		describe('when query is undefined', function () {
			it("should return expected", function () {
				var stub, actual;
				stub = sinon.stub(common, 'getFromLocalStorage').returns();
				actual = sut.getQueryInfo();
				common.getFromLocalStorage.restore();
				assert.deepEqual(actual, { hasTags : false, hasCollection: false });
			});
		});
		describe('when query is defined', function () {
			it("should return expected", function () {
				var stub, actual, query, expected;
				query = { tags : ['arks', 'covenants'], collection: 'bible stories' };
				expected = { hasTags : true, hasCollection: true, query : query};
				stub = sinon.stub(common, 'getFromLocalStorage').returns(query);
				actual = sut.getQueryInfo();
				common.getFromLocalStorage.restore();
				assert.deepEqual(actual, expected);
			});
		});
	});
});
