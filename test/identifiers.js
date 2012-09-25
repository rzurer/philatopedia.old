/*global  describe, beforeEach, afterEach, it*/
"use strict";
var localStorage = {},
    postFunction = function (url, data, callback) {
        if (callback) {
            callback(data);
        }
    },
	sinon = require('sinon'),
	assert = require('assert'),
	common =  require('../modules/common').common(localStorage),
	tagInternals = require("../modules/_tags")._tags(),
	tags = require("../modules/tags").tags(tagInternals),
	searchInternals = require('../modules/_search')._search(tags, common),
	urls = require('../modules/urls').urls,
	searchRouter = require('../modules/routers').searchRouter(urls, postFunction),
	search = require('../modules/search').search(searchInternals, common, searchRouter),
	methods = require('../modules/_imageCarousel')._imageCarousel(),
	sut = require('../modules/imageCarousel').imageCarousel(methods, search);
describe('imageCarousel_module', function () {
	describe('displayThumbnails', function () {
		it("should call search getStampIdDefaultImageIdImageSrcArray with callback", function () {
			var spy;
			spy = sinon.spy(search, 'getStampIdDefaultImageIdImageSrcArray');
			sut.displayThumbnails();
			search.getStampIdDefaultImageIdImageSrcArray.restore();

			sinon.assert.calledWith(spy, methods.createThumbnails);
		});
	});
});