/*global  describe, beforeEach, it*/
"use strict";
var mainLayoutRouter = require('../modules/routers').MainLayoutRouter,
	picklistsRouter = require('../modules/routers').PicklistsRouter,
	searchRouter = require('../modules/routers').SearchRouter,
	stampRouter = require('../modules/routers').StampRouter,
	urls = require('../modules/urls').Urls,
	assert = require('assert'),
	window = {},
	mainLayoutRouter,
	urlArg,
	dataArg,
	callbackArg,
	callback = function () {},
	postFunction = function (url, data, callback) {
		urlArg = url;
		dataArg = data;
		callbackArg = callback;
	},	 
	setup = function () {
		urlArg = null;
		dataArg = null;
		callbackArg = null;
		mainLayoutRouter.initialize(urls, window, postFunction);
		picklistsRouter.initialize(urls, postFunction);
		searchRouter.initialize(urls, postFunction);
		stampRouter.initialize(urls, postFunction);
	};
describe('Routers', function () {
	beforeEach(setup);
	describe('MainLayoutRouter', function () {
		describe('#home', function () {
			it("should set to window.location to urls home", function () {
				mainLayoutRouter.home();
				assert.strictEqual(window.location, urls.home);
			});
		});
		describe('#sandbox', function () {
			it("should set to window.location to urls sandbox", function () {
				mainLayoutRouter.sandbox();
				assert.strictEqual(window.location, urls.sandbox);
			});
		});
		describe('#usercollection', function () {
			it("should set to window.location to urls usercollection", function () {
				mainLayoutRouter.usercollection();
				assert.strictEqual(window.location, urls.usercollection);
			});
		});
		describe('#add', function () {
			it("should set to window.location to urls add", function () {
				mainLayoutRouter.add();
				assert.strictEqual(window.location, urls.add);
			});
		});
		describe('#login', function () {
			it("should post with expected arguments", function () {
				var username = 'wittgenstein';
				mainLayoutRouter.login(username, callback, postFunction);
				assert.strictEqual(urlArg, urls.login);
				assert.deepEqual(dataArg, {username : username});
				assert.strictEqual(callbackArg, callback);
			});
		});
		describe('#logout', function () {
			it("should post with expected arguments", function () {
				mainLayoutRouter.logout(callback, postFunction);
				assert.strictEqual(urlArg, urls.logout);
				assert.deepEqual(dataArg, {});
				assert.strictEqual(callbackArg, callback);
			});
		});
	});

	describe('PicklistsRouter', function () {
		describe('#getDistinctTags', function () {
			it("should post with expected arguments", function () {
				var data = {};
				picklistsRouter.getDistinctTags(callback);
				assert.strictEqual(urlArg, urls.getDistinctTags);
				assert.deepEqual(dataArg, data);
				assert.strictEqual(callbackArg, callback);
			});
		});
		describe('#getDistinctCollections', function () {
			it("should post with expected arguments", function () {
				var data = {};
				picklistsRouter.getDistinctCollections(callback);
				assert.strictEqual(urlArg, urls.getDistinctCollections);
				assert.deepEqual(dataArg, data);
				assert.strictEqual(callbackArg, callback);
			});
		});
		describe('#getAllCountryNames', function () {
			it("should post with expected arguments", function () {
				var data = {};
				picklistsRouter.getAllCountryNames(callback);
				assert.strictEqual(urlArg, urls.getAllCountryNames);
				assert.deepEqual(dataArg, data);
				assert.strictEqual(callbackArg, callback);
			});
		});
	});
	describe('SearchRouter', function () {
		describe('#filterStampListings', function () {
			it("should post with expected arguments", function () {
				var data, query;
				query = {collection : "foo", tags : "bar"};
				data = {
					collection: query.collection,
					tags: query.tags
				};
				searchRouter.filterStampListings(query, callback);
				assert.strictEqual(urlArg, urls.filterStampListings);
				assert.deepEqual(dataArg, data);
				assert.strictEqual(callbackArg, callback);
			});
		});
	});
	describe('StampRouter', function () {
		describe('#submitToSandbox', function () {
			var isValid;
			describe('when stamp is valid', function () {
				it("should post with expected arguments", function () {
					var expected, stamp;
					stamp = {id : 1};
					expected = {stamp : stamp};
					isValid = function (stamp) {
						return true;
					};
					stampRouter.submitToSandbox(stamp, isValid,  callback);
					assert.strictEqual(urlArg, urls.submitToSandbox);
					assert.deepEqual(dataArg, expected);
					assert.strictEqual(callbackArg, callback);
				});
			});
			describe('when stamp is not valid', function () {
				it("should not post", function () {
					var expected, stamp;
					stamp = {id : 1};
					expected = {stamp : stamp};
					isValid = function (stamp) {
						return false;
					};
					stampRouter.submitToSandbox(stamp, isValid,  callback);
					assert.strictEqual(urlArg, null);
					assert.deepEqual(dataArg, null);
					assert.strictEqual(callbackArg, null);
				});
			});
		});
	});

	describe('#goToStamp', function () {
		it("should set to window.location to urls usercollection", function () {
			var stamp = {id : 42};
			stampRouter.goToStamp(stamp);
			assert.strictEqual(window.location, urls.goToStamp(42));
		});
	});
	describe('#getStamp', function () {
		it("should post with expected arguments", function () {
			var id, expected;
			id = 42;
			expected = {id : id};
			stampRouter.getStamp(id, callback);
			assert.strictEqual(urlArg, urls.getStamp);
			assert.deepEqual(dataArg, expected);
			assert.strictEqual(callbackArg, callback);
		});
	});
	describe('#deleteStamp', function () {
		it("should post with expected arguments", function () {
			var id, expected;
			id = 42;
			expected = {id : id};
			stampRouter.deleteStamp(id, callback);
			assert.strictEqual(urlArg, urls.deleteStamp);
			assert.deepEqual(dataArg, expected);
			assert.strictEqual(callbackArg, callback);
		});
	});
});

