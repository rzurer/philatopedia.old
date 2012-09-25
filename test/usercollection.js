/*global  describe, it, beforeEach, afterEach*/
"use strict";
var assert = require('assert'),
	sinon = require('sinon'),
    $ = require('jquery'),
    localStorage = {collectionOrTagsQuery : {collection: 'foo'}, countryNames : ['France', 'Belgium']},
    postFunction = function (url, data, callback) {
        if (callback) {
            callback(data);
        }
    },
    window = {},
    func = function () {},
    controls = {
        listings : {hide : func, html : func, show : func},
        tagControls : {
            getLocalTags : function () {return {remove : func}; },
            getLocalTaglabels :  function () {return {each : func}; },
            localTagsContainer : {css: func},
            tagsource: {val : func, blur : func},
			addLocalTagControl : {click : func }
        },
        array : [],
        getStampImages : function () {return []; },
        collectionsource : {val : func},
        searchControls : {
            searchcriteria :  {text : func},
            collectioncriteria :  {text : func},
            collectionvalue :  {text : func},
            tagscriteria :  {text : func},
            tagsvalue :  {text : func},
            clearsearch :  {hide : func, show : func, toggle : func},
        },
        getStampLabels : function () { return {each : func }; },
        getSubmitToSandboxActions : function () { return {click : func }; },
        getDeleteStampActions : function () { return {click : func }; },
        getStampListings : function () { return {click : func }; },
        clearSearchControl : {click : func },
        doSearchControl : {click : func }
    },
    imageInfos = [],
    common =  require('../modules/common').common(localStorage),
    urls = require('../modules/urls').urls,
    picklistsRouter = require('../modules/routers').picklistsRouter(urls, postFunction),
    picklists = require('../modules/picklists').picklists(common, picklistsRouter),
    tagInternals = require("../modules/_tags")._tags(),
    tags = require("../modules/tags").tags(tagInternals),
    searchInternals = require('../modules/_search')._search(tags, common),
    searchRouter = require('../modules/routers').searchRouter(urls, postFunction),
    search = require('../modules/search').search(searchInternals, common, searchRouter),
    stampRouter = require('../modules/routers').stampRouter(urls, window, postFunction),
    collectionCommon = require('../modules/_collectionCommon')._collectionCommon(urls, common, $),
    methods = require('../modules/_usercollection')._usercollection(collectionCommon, urls, picklists, tags, search, common, stampRouter, $),
    sut = require('../modules/usercollection').userCollection(methods);

describe('userCollection_module', function () {
	describe('#initializeControls', function () {
		it("should initialize internal controls", function () {
			var spy;
			spy = sinon.spy(methods, "initializeControls");
			sut.initializeControls(controls, imageInfos);
			methods.initializeControls.restore();
			sinon.assert.calledWith(spy, controls);
		});
	});
	describe('#ready', function () {
		it("should call internal ready", function () {
			var spy, getCollectionsStub, getTagsStub, setImagesStub, truncateStub;
			spy = sinon.spy(methods, "ready");
			getCollectionsStub = sinon.stub(picklists, 'getCollections');
			getCollectionsStub.returns([]);
			getTagsStub = sinon.stub(picklists, 'getTags');
            getTagsStub.returns([]);
            setImagesStub = sinon.stub(collectionCommon, 'setImages');
            truncateStub = sinon.stub(collectionCommon, 'truncate');
			sut.ready();
			methods.ready.restore();
            collectionCommon.setImages.restore();
            collectionCommon.truncate.restore();
			picklists.getCollections.restore();
			picklists.getTags.restore();

			sinon.assert.calledOnce(spy);
		});
	});
});