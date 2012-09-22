/*global  describe, it*/
"use strict";
var sut = require('../modules/urls').urls,
	assert = require('assert');
describe('urls_module', function () {
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
        assert.strictEqual(sut.getUser, '/getUser');
        assert.strictEqual(sut.noimagesrc, '/images/dropimagehere.png');
        assert.strictEqual(sut.nostampimage, '/images/nostamp.png');
        assert.strictEqual(sut.identify, '/identify');
        assert.strictEqual(sut.getStampHtml, '/stamps');
    });
    describe('goToStamp', function () {
        it("should return expected url", function () {
            var actual = sut.goToStamp(42),
                expected = '/stamps/?id=42';
            assert.strictEqual(actual, expected);
        });
    });
    describe('getFullSizeImageUrl', function () {
        it("when image src is noimagesrc should return noimagesrc", function () {
            var actual = sut.getFullSizeImageUrl(sut.noimagesrc),
                expected = sut.noimagesrc;
            assert.strictEqual(actual, expected);
        });
        it("when image src is not noimagesrc path to original image file", function () {
            var actual = sut.getFullSizeImageUrl("/home/zurer/projects/philatopedia/public/temp/1338731403191.jpg"),
                expected = '/temp/orig_1338731403191.jpg';
            assert.strictEqual(actual, expected);
        });
    });
});