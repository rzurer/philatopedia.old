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
	sut = require('../modules/imageCarousel').identifiers(methods, search);
describe('indentifiers_module', function () {
	describe('displayThumbnails', function () {
		it("should ", function () {

		});
	});
});