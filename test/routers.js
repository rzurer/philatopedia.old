/*global  describe, beforeEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	urls = require('../modules/urls').urls,
	window = {},
	urlArg,
	dataArg,
	callbackArg,
	postFunction = function (url, data, callback) {
		urlArg = url;
		dataArg = data;
		callbackArg = callback;
	},
	mainLayoutRouter = require('../modules/routers').mainLayoutRouter(urls, window, postFunction),
	picklistsRouter = require('../modules/routers').picklistsRouter(urls, postFunction),
	searchRouter = require('../modules/routers').searchRouter(urls, postFunction),
	stampRouter = require('../modules/routers').stampRouter(urls, window, postFunction),
	callback = function () {},
	setup = function () {
		urlArg = null;
		dataArg = null;
		callbackArg = null;
	};
describe('routers_module', function () {
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
			it("should get stamp", function () {
				var spy, stampId;
				stampId = 42;
				spy = sinon.spy(stampRouter, 'getStamp');
				stampRouter.submitToSandbox(stampId, null,  null);
				sinon.assert.calledWith(spy, stampId);
				stampRouter.getStamp.restore();
			});
			describe('when stamp is valid', function () {
				it("should post with expected arguments", function () {
					var stub, stamp, isValid, stampId, expected;
					stub = sinon.stub(stampRouter, 'getStamp');
					stampId = 42;
					stamp = {stamp : stampId};
					isValid = function (stamp) {
						return true;
					};
					stub.yields(stampId);
					stampRouter.submitToSandbox(stampId, isValid,  callback);
					assert.strictEqual(urlArg, urls.submitToSandbox);
					assert.deepEqual(dataArg, stamp);
					assert.strictEqual(callbackArg, callback);
					stampRouter.getStamp.restore();
				});
			});
			describe('when stamp is not valid', function () {
				it("should not post", function () {
					var stub, stamp, isValid, stampId, expected;
					stub = sinon.stub(stampRouter, 'getStamp');
					stampId = 42;
					stamp = {stamp : stampId};
					isValid = function (stamp) {
						return false;
					};
					stub.yields(stampId);
					stampRouter.submitToSandbox(stampId, isValid,  callback);
					assert.strictEqual(urlArg, null);
					assert.deepEqual(dataArg, null);
					assert.strictEqual(callbackArg, null);
					stampRouter.getStamp.restore();
				});
			});
		});
		describe('#goToStamp', function () {
			it("should set to window.location to urls usercollection", function () {
				var id = 42;
				stampRouter.goToStamp(id);
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
		describe('#identify', function () {
			it("should post with expected arguments", function () {
				var url, expected;
				url = "foo";
				expected = {url : url};
				stampRouter.identify(url, callback);
				assert.strictEqual(urlArg, urls.identify);
				assert.deepEqual(dataArg, expected);
				assert.strictEqual(callbackArg, callback);
			});
		});
	});
});

