"use strict";
/*global  describe, beforeEach, it, afterEach*/
var assert = require('assert'),
    sinon = require('sinon'),
    $ = require('jquery'),
    func = function () {},
    localStorage = {collectionOrTagsQuery : {collection: 'foo'}, removeItem : func},
    postFunction = function (url, data, callback) {
        if (callback) {
            callback(data);
        }
    },
    window = {},
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
    sut = require('../modules/_usercollection')._usercollection(collectionCommon, urls, picklists, tags, search, common, stampRouter, $),
    controls,
    info,
    label = $('<label/>'),
    getLabel = function (argument) {
        return $('<label/>');
    },
    labelFunc = function () {return label; },
    autocompleteTarget = $('<input/>'),
    tagControls = {
        tagsource : autocompleteTarget,
        getLocalTags : function () {return {remove : func}; },
        addLocalTagControl : labelFunc(),
        getLocalTaglabels : function () {return {each : func}; },
        localTagsContainer :  {css : func},
    },
    searchControls = {
        searchcriteria : getLabel(),
        collectioncriteria : getLabel(),
        collectionvalue : getLabel(),
        tagscriteria : getLabel(),
        tagsvalue : getLabel(),
        clearsearch : getLabel()
    },
    collectionsource = autocompleteTarget,
    listings = getLabel(),
    toaster = getLabel(),
    stampImages =  [
        {stampId : 1},
        {stampId : 2},
        {stampId : 3},
        {stampId : 4}
    ],
    getStampImages =  function () {
        return stampImages;
    },
    getStampImage =  function (stampId) {
        return $(common.findFirst(stampImages, 'stampId', stampId));
    },
    label1 = getLabel().text('a rose is a rose is a rose is a rose is a rose'),
    label2 = getLabel(),
    label3 = getLabel().text('tulip'),
    label4 = getLabel().text('geranium'),
    stampLabels =  $([label1, label2, label3, label4]),
    getStampLabels =  function () {
        return stampLabels;
    },
    commonControls = {
        getStampImages : getStampImages,
        getStampImage : getStampImage,
        getStampLabels : getStampLabels
    },
    imageInfos = [
        {stampId : 1, defaultImageSrc : 'rose'},
        {stampId : 2, defaultImageSrc : ''},
        {stampId : 3, defaultImageSrc : 'tulip'},
        {stampId : 4, defaultImageSrc : 'geranium'}
    ],
    stampId = 42,
    setup = function () {
        autocompleteTarget.autocomplete = func;
        controls = {
            tagControls : tagControls,
            commonControls : commonControls,
            searchControls : searchControls,
            collectionsource : collectionsource,
            listings : listings,
            getStampId : function () {return 42; },
            getSubmitToSandboxActions : labelFunc,
            getSubmitToSandboxAction : labelFunc,
            getStampContainer : labelFunc,
            getStampIdForAction : function (obj) {return stampId; },
            getDeleteStampActions : labelFunc,
            getDeleteStampAction : labelFunc,
            getStampListings : labelFunc,
            clearSearchControl : labelFunc(),
            doSearchControl : labelFunc(),
            toaster : toaster
        };
        search.initializeControls(searchControls);
        collectionCommon.initializeControls(commonControls, imageInfos);
    };
describe('_usercollection_module', function () {
    beforeEach(setup);
	describe("initializeControls", function () {
		it("should assign controls", function () {
            info = sut.initializeControls(controls, imageInfos);
            assert.equal(common.getPropertyCount(controls), info.length);
		});
        it("should initialize tag controls", function () {
            var spy;
            spy = sinon.spy(tags, 'initializeControls');
            sut.initializeControls(controls);
            tags.initializeControls.restore();

            sinon.assert.calledWith(spy, controls.tagControls);
        });
        it("should initialize search controls", function () {
            var spy;
            spy = sinon.spy(search, 'initializeControls');
            sut.initializeControls(controls);
            search.initializeControls.restore();

            sinon.assert.calledWith(spy, controls.searchControls);
        });
	});
    describe('methods', function () {
        beforeEach(function () {
            info = sut.initializeControls(controls, imageInfos);
        });
        describe("setAutoCompletes", function () {
            it("should set tags autocomplete", function () {
                var spy;
                spy = sinon.spy(picklists, 'setTagsAutocomplete');
                sut.setAutoCompletes();
                picklists.setTagsAutocomplete.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should set collections autocomplete", function () {
                var spy;
                spy = sinon.spy(picklists, 'setCollectionsAutocomplete');
                sut.setAutoCompletes();
                picklists.setCollectionsAutocomplete.restore();

                sinon.assert.calledOnce(spy);
            });
        });
        describe("clearSearchEntries", function () {
            it("should clear collection source", function () {
                var spy;
                spy = sinon.spy(collectionsource, 'val');
                sut.clearSearchEntries();
                collectionsource.val.restore();

                sinon.assert.calledWith(spy, null);
            });
            it("should clear tags source", function () {
                var spy;
                spy = sinon.spy(tagControls.tagsource, 'val');
                sut.clearSearchEntries();
                tagControls.tagsource.val.restore();

                sinon.assert.calledWith(spy, null);
            });
        });
        describe("cleanup", function () {
            it("should hide listings", function () {
                var spy;
                spy = sinon.spy(listings, 'hide');
                sut.cleanup();
                listings.hide.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should fill listings", function () {
                var spy, html;
                spy = sinon.spy(listings, 'html');
                html = 'this is the html';
                sut.cleanup(html);
                listings.html.restore();

                sinon.assert.calledWith(spy, html);
            });
            it("should set images", function () {
                var spy;
                spy = sinon.spy(collectionCommon, 'setImages');
                sut.cleanup();
                collectionCommon.setImages.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should delete local tags", function () {
                var spy;
                spy = sinon.spy(tags, 'deleteLocalTags');
                sut.cleanup();
                tags.deleteLocalTags.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should clear search entries", function () {
                var spy;
                spy = sinon.spy(sut, 'clearSearchEntries');
                sut.cleanup();
                sut.clearSearchEntries.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should display the current search criteria", function () {
                var spy;
                spy = sinon.spy(search, 'displaySearchCriteria');
                sut.cleanup();
                search.displaySearchCriteria.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should truncate text labels", function () {
                var spy;
                spy = sinon.spy(collectionCommon, 'truncate');
                sut.cleanup();
                collectionCommon.truncate.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should assign event handlers", function () {
                var spy;
                spy = sinon.spy(sut, 'assignEventHandlers');
                sut.cleanup();
                sut.assignEventHandlers.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should show listings", function () {
                var spy;
                spy = sinon.spy(listings, 'show');
                sut.cleanup();
                listings.show.restore();

                sinon.assert.calledOnce(spy);
            });
        });
        describe("displaySubmittedToSandboxToaster", function () {
            it("should show toaster when a stamp is submitted to sandbox", function () {
                var spy, target;
                spy = sinon.spy(common, 'showToaster');
                target = getLabel();
                sut.displaySubmittedToSandboxToaster(target);
                common.showToaster.restore();

                sinon.assert.calledWith(spy, target, toaster, "copied");
            });
        });
        describe("isValid", function () {
            it("should return false if stamp issued by is undefined", function () {
                var stamp, isValid;
                stamp = {};
                isValid = sut.isValid(stamp);

                assert.equal(false, isValid);
            });
            it("should return false if stamp issued by is null", function () {
                var stamp, isValid;
                stamp = {issuedBy : null};
                isValid = sut.isValid(stamp);

                assert.equal(false, isValid);
            });
            it("should return false if stamp issued by is 'null'", function () {
                var stamp, isValid;
                stamp = {issuedBy : 'null'};
                isValid = sut.isValid(stamp);

                assert.equal(false, isValid);
            });
            it("should return false when stamp issued by is empty", function () {
                var stamp, isValid;
                stamp = {issuedBy : ''};
                isValid = sut.isValid(stamp);

                assert.equal(false, isValid);
            });
            it("should return true when stamp issued by is not empty", function () {
                var stamp, isValid;
                stamp = {issuedBy : 'Angola'};
                isValid = sut.isValid(stamp);

                assert.equal(true, isValid);
            });
        });
        describe("submitToSandbox", function () {
            it("should get the stamp id", function () {
                var spy;
                spy = sinon.spy(controls, 'getStampIdForAction');
                sut.submitToSandbox(this);
                controls.getStampIdForAction.restore();

                sinon.assert.calledWith(spy, sut);
            });
        });
        describe("goToStamp", function () {
            it("should get the stamp id", function () {
                var spy;
                spy = sinon.spy(stampRouter, 'goToStamp');
                sut.goToStamp();
                stampRouter.goToStamp.restore();

                sinon.assert.calledWith(spy, stampId);
            });
        });
        describe("deleteStamp", function () {
            it("should get the stamp id", function () {
                var spy;
                spy = sinon.spy(controls, 'getStampIdForAction');
                sut.deleteStamp();
                controls.getStampIdForAction.restore();

                sinon.assert.calledOnce(spy);
            });
            it("should call router deleteStamp", function () {
                var spy;
                spy = sinon.spy(stampRouter, 'deleteStamp');
                sut.deleteStamp();
                stampRouter.deleteStamp.restore();

                sinon.assert.calledWith(spy, stampId);
            });
            it("when delete is successful should call doDeleteStamp", function () {
                var spy, stub;
                spy = sinon.spy(sut, 'doDeleteStamp');
                stub = sinon.stub(stampRouter, "deleteStamp");
                stub.yields({success :  true});
                sut.deleteStamp();
                stampRouter.deleteStamp.restore();
                sut.doDeleteStamp.restore();

                sinon.assert.calledOnce(spy);
            });
            it("when delete is successful should not call doDeleteStamp", function () {
                var spy, stub;
                spy = sinon.spy(sut, 'doDeleteStamp');
                stub = sinon.stub(stampRouter, "deleteStamp");
                stub.yields({success :  false});
                sut.deleteStamp();
                stampRouter.deleteStamp.restore();
                sut.doDeleteStamp.restore();

                assert.strictEqual(spy.callCount, 0);
            });
        });
        describe("doDeleteStamp", function () {
            it("should get the stamp container control", function () {
                var spy, target;
                target = getLabel();
                spy = sinon.spy(controls, 'getStampContainer');
                sut.doDeleteStamp(target);
                controls.getStampContainer.restore();

                sinon.assert.calledWith(spy, target);
            });
            it("should get the delete stamp action control", function () {
                var spy, target;
                target = getLabel();
                spy = sinon.spy(controls, 'getDeleteStampAction');
                sut.doDeleteStamp(target);
                controls.getDeleteStampAction.restore();

                sinon.assert.calledWith(spy, target);
            });
            it("should show toaster", function () {
                var spy = sinon.spy(common, 'showToaster'),
                    target = getLabel();
                sut.doDeleteStamp(target);
                common.showToaster.restore();

                sinon.assert.calledOnce(spy);
            });
        });
        describe("assignEventHandlers", function () {
            var getDistinctTagsStub, getDistinctCollectionsStub;
            beforeEach(function () {
                getDistinctTagsStub = sinon.stub(picklistsRouter, 'getDistinctTags').yields({tags: []});
                getDistinctCollectionsStub = sinon.stub(picklistsRouter, 'getDistinctCollections').yields({collections: []});
            });
            afterEach(function () {
                getDistinctTagsStub.restore();
                getDistinctCollectionsStub.restore();
            });
            it("should set getSubmitToSandboxActions click to submitToSandbox", function () {
                var spy;
                spy = sinon.spy(sut, 'submitToSandbox');
                sut.assignEventHandlers();
                sut.submitToSandbox.restore();
                label.click();
                label.unbind('click');

                sinon.assert.calledOnce(spy);
            });
             it("should set getDeleteStampActions click to deleteStamp", function () {
                var spy;
                spy = sinon.spy(sut, 'deleteStamp');
                sut.assignEventHandlers();
                sut.deleteStamp.restore();
                label.click();
                label.unbind('click');

                sinon.assert.calledOnce(spy);
            });
            it("should set getStampListings click to goToStamp", function () {
                var spy;
                spy = sinon.spy(sut, 'goToStamp');
                sut.assignEventHandlers();
                sut.goToStamp.restore();
                label.click();
                label.unbind('click');

                sinon.assert.calledOnce(spy);
            });
            it("should set clearSearchControl click to clearSearch", function () {
                var spy;
                controls.clearSearchControl = label;
                spy = sinon.spy(sut, 'clearSearch');
                sut.assignEventHandlers();
                sut.clearSearch.restore();
                label.click();
                label.unbind('click');

                sinon.assert.calledOnce(spy);
            });
            it("should set tagControls.tagsource blur to leaveTag", function () {
                var spy;
                spy = sinon.spy(sut, 'leaveTag');
                sut.assignEventHandlers();
                sut.leaveTag.restore();
                autocompleteTarget.blur();
                autocompleteTarget.unbind('click');

                sinon.assert.calledOnce(spy);
            });
            it("should se tagControls.addLocalTagControl click to addLocalTag", function () {
                var spy;
                spy = sinon.spy(sut, 'addLocalTag');
                sut.assignEventHandlers();
                sut.addLocalTag.restore();
                label.click();

                sinon.assert.calledOnce(spy);
            });
            it("should set doSearchControl click to createQueryAndSearch", function () {
                var spy, stub1, stub2;
                spy = sinon.spy(sut, 'createQueryAndSearch');
                sut.assignEventHandlers();
                label.click();

                sut.createQueryAndSearch.restore();

                sinon.assert.calledOnce(spy);
            });
        });
        describe('setSearchControls', function () {

        });
        describe('createQueryAndSearch', function () {

        });
        describe('clearSearch', function () {

        });
        describe('leaveTag', function () {

        });
        describe('addLocalTag', function () {

        });
        describe('ready', function () {

        });
    });
});

/*          setSearchControls : function () {
            var collectionsCallback = function (collections) {
                    if (collections.length === 0) {
                        uicontrols.collectionsource.attr("disabled", "disabled");
                    }
                },
                tagsCallback = function (tags) {
                    if (tags.length === 0) {
                        uicontrols.tagControls.tagsource.attr("disabled", "disabled");
                    }
                };
            picklists.getCollections(collectionsCallback);
            picklists.getTags(tagsCallback);
        },*/