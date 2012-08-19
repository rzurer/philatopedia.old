"use strict";
/*global  describe, beforeEach, it, afterEach*/
var assert = require('assert'),
	sinon = require('sinon'),
	$ = require('jquery'),
	sut = require('../modules/_search').privateMembers,
	tags = require('../modules/tags').tags,
	tagsInternals = require('../modules/_tags').internals,
	common  = require('../modules/common').Common,
	controls,
	tagControls,
	localStorage,
	func = function () {},
	setup = function () {
		tagControls = {
			getLocalTaglabels : function (tagValues) {
				return $([{innerText : 'birds'}, {innerText : 'bees'}]);
			}
		};
		tags.initialize(tagsInternals);
		tags.initializeControls(tagControls);
		controls = {
			collectionsource : {val : function () {return 'animals and insects'; }}
		};
		localStorage = {removeItem : func, collectionOrTagsQuery : {}, getLocalTagsValues : func},
		common.initialize(localStorage);
		sut.initialize(tags, common);
		sut.initializeControls(controls);
	};
describe('SearchInternals', function () {
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
});
