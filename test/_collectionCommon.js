/*global  describe, beforeEach, it, afterEach*/
"use strict";
var assert = require('assert'),
    sinon = require('sinon'),
    $ = require('jquery'),
    localStorage = {},
    common =  require('../modules/common').common(localStorage),
    urls = require('../modules/urls').urls,
    sut = require('../modules/_collectionCommon')._collectionCommon(urls, common, $),
    getLabel = function (argument) {
        return $('<label/>');
    },
    labelFunc = function () {return getLabel(); },
    label1 = getLabel().text('a rose is a rose is a rose is a rose is a rose'),
    label2 = getLabel(),
    label3 = getLabel().text('tulip'),
    label4 = getLabel().text('geranium'),
    stampLabels =  $([label1, label2, label3, label4]),
    getStampLabels =  function () {
        return stampLabels;
    },
    stampImages =  [
        {stampId : 1},
        {stampId : 2},
        {stampId : 3},
        {stampId : 4}
    ],
    getStampImage =  function (stampId) {
        return $(common.findFirst(stampImages, 'stampId', stampId));
    },
    controls,
    info,
    getStampImages =  function () {
        return stampImages;
    },
    imageInfos = [
        {stampId : 1, defaultImageSrc : 'rose'},
        {stampId : 2, defaultImageSrc : ''},
        {stampId : 3, defaultImageSrc : 'tulip'},
        {stampId : 4, defaultImageSrc : 'geranium'}
    ],
    setup = function () {
        controls = {
            getStampImages : getStampImages,
            getStampImage : getStampImage,
            getStampLabels : getStampLabels
        };
    };
describe('_collectionCommon_module', function () {
    beforeEach(setup);
	describe("initializeControls", function () {
		it("should assign controls", function () {
            info = sut.initializeControls(controls, imageInfos);
            assert.equal(common.getPropertyCount(controls), info.length);
		});
	});
    describe('methods', function () {
	    beforeEach(function () {
	        info = sut.initializeControls(controls, imageInfos);
	    });
        describe("setImages", function () {
            it("should should assign src of each stamp image", function () {
                sut.setImages();
                assert.strictEqual(imageInfos[0].defaultImageSrc, stampImages[0].src);
                assert.strictEqual(urls.nostampimage,  stampImages[1].src);
                assert.strictEqual(imageInfos[2].defaultImageSrc, stampImages[2].src);
                assert.strictEqual(imageInfos[3].defaultImageSrc, stampImages[3].src);
            });
        });
        describe("truncate", function () {
            it("should truncate labels", function () {
                sut.truncate();

                assert.equal("a rose is a rose is a rose is a rose is a rose", stampLabels[0].attr('title'));
                assert.equal("a rose is a rose is a ros ...", stampLabels[0].text());
            });
        });
	});
});