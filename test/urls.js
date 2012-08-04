/*global  describe, it*/
"use strict";
var sut = require('../modules/urls').Urls,
	assert = require('assert');
describe('Urls', function () {
    it("should contain expected urls", function () {
        assert.strictEqual(sut.home, '/');
        assert.strictEqual(sut.sandbox, '/stamps/sandbox');
        assert.strictEqual(sut.usercollection, '/stamps/usercollection');
        assert.strictEqual(sut.add, '/stamps/new');
        assert.strictEqual(sut.login, '/login');
        assert.strictEqual(sut.logout, '/logout');
        assert.strictEqual(sut.poundsign, '#');
        assert.strictEqual(sut.getDistinctTags, '/getDistinctTags');
        assert.strictEqual(sut.getDistinctCollections, '/getDistinctCollections');
        assert.strictEqual(sut.getAllCountryNames, '/getAllCountryNames');
        assert.strictEqual(sut.filterStampListings, '/filterStampListings');
        assert.strictEqual(sut.submitToSandbox, '/submitToSandbox');
        assert.strictEqual(sut.getStamp, '/getStamp');
        assert.strictEqual(sut.deleteStamp, '/deleteStamp');
        assert.strictEqual(sut.goToStamp(42), '/stamps/?id=42');
    });
});