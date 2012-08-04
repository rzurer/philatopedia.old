"use strict";
/*global  describe, beforeEach, it, afterEach*/
var sut = require('../modules/_usercollection').privateMembers,
	assert = require('assert'),
	sinon = require('sinon'),
	common = require('../modules/common').Common,
	controls,
	picklists,
	tags,
	search,
	common,
	router,
	func = function () {},
	returnThis = function () {
		return this;
	},
    attr = function (name, value) {
        this[name] = value;
    },
    val = function (value) {},
	click = function (func) {
		this.clickFunction = func;
    },
    textValue = '',
    text = function(){
    	if (arguments && arguments.length) {
    		textValue = arguments[0];
    	}
    	return textValue;
    },
    stampimagecontrols,
    images,
	setup = function () {
		images = [
			{stampId : 1, defaultImageSrc : 'rose'},
			{stampId : 2, defaultImageSrc : ''},
			{stampId : 3, defaultImageSrc : 'tulip'},
			{stampId : 4, defaultImageSrc : 'geranium'},
		];
		controls = {
			collectionsource : {
				val : val,
				attr : attr
			},
			tagsource : {
				val : val,
				attr : attr,
				blur : func
			},
			submitToSandboxAction :  {
				clickFunction : undefined,
				click : click,
				offset : returnThis,
				width : func
			},
			deleteStampAction :  {
				clickFunction : undefined,
				click : click,
				remove : func
			},
			stampImages :  [
				{stampId : 1, attr : attr },
				{stampId : 2, attr : attr },
				{stampId : 3, attr : attr },
				{stampId : 4, attr : attr },
			],
			stampLabels : [{text : text, attr : attr, title: func}, {text : text, attr : attr, title: func}],
			stampListings : {click : func},
			listings :  {
				hide : func,
				show : func
			},
			clearSearchControl : {
				click : click
			},
			doSearchControl : {
				click : click
			},
			toaster : {
				addClass : func,
				css : func,
				text : func,
				show : func,
				delay : returnThis,
				hide : func
			},
			window :  {
				load : func
			},
			getStampid : function () {},
			getStampImage :  function (stampId) {
				return common.findFirst(this.stampImages, 'stampId', stampId);
			},
			nostampImage : "nostamp.jpg",
			addLocalTagControl : {
				click : click
			}
		};
		picklists = {
			setTagsAutocomplete : function (skipVerify) {},
			setCollectionsAutocomplete : function (skipVerify) {},
			setCountriesAutocomplete : function (skipVerify) {},
			getCollections : function () {
				return [];
			},
			getTags : function () {
				return [];
			}
		};
		tags = {
			deleteLocalTags : func
		};
		search = {
			createQueryAndSearch : func,
			filterStampListings : func
		};
		router = {
			submitToSandbox : func,
			deleteStamp : func,
			getStamp : func
		};
	};
describe('_usercollection', function () {
	beforeEach(setup);
	describe("initialize", function () {
		it("should set collaborators", function () {
			assert.ok(picklists);
			assert.ok(tags);
			assert.ok(search);
			assert.ok(common);
			assert.ok(router);
			assert.ok(!sut.picklists);
			assert.ok(!sut.tags);
			assert.ok(!sut.search);
			assert.ok(!sut.common);
			assert.ok(!sut.router);
			sut.initialize(picklists, tags, search, common, router);
			assert.strictEqual(picklists, sut.picklists);
			assert.strictEqual(tags, sut.tags);
			assert.strictEqual(search, sut.search);
			assert.strictEqual(common, sut.common);
			assert.strictEqual(router, sut.router);
		});
	});
	describe('#initializeControls', function () {
		it("should set controls", function () {
			assert.ok(controls.collectionsource);
			assert.ok(controls.tagsource);
			assert.ok(controls.submitToSandboxAction);
			assert.ok(controls.deleteStampAction);
			assert.ok(controls.stampImages);
			assert.ok(controls.stampLabels);
			assert.ok(controls.listings);
			assert.ok(controls.clearSearchControl);
			assert.ok(controls.doSearchControl);
			assert.ok(controls.toaster);
			assert.ok(controls.window);
			assert.ok(controls.getStampid);
			assert.ok(controls.getStampImage);
			assert.ok(controls.nostampImage);
			assert.ok(controls.addLocalTagControl);
			assert.ok(!sut.collectionsource);
			assert.ok(!sut.tagsource);
			assert.ok(!sut.submitToSandboxAction);
			assert.ok(!sut.deleteStampAction);
			assert.ok(!sut.stampImages);
		    assert.ok(!sut.listings);
			assert.ok(!sut.clearSearchControl);
			assert.ok(!sut.doSearchControl);
			assert.ok(!sut.toaster);
			assert.ok(!sut.window);
			assert.ok(!sut.getStampid);
			assert.ok(!sut.getStampImage);
			assert.ok(!sut.nostampImage);
			assert.ok(!sut.addLocalTagControl);
			sut.initializeControls(controls);
			assert.strictEqual(controls.collectionsource, sut.collectionsource);
			assert.strictEqual(controls.tagsource, sut.tagsource);
			assert.strictEqual(controls.submitToSandboxAction, sut.submitToSandboxAction);
			assert.strictEqual(controls.deleteStampAction, sut.deleteStampAction);
			assert.strictEqual(controls.stampImages, sut.stampImages);
			assert.strictEqual(controls.stampLabels, sut.stampLabels);
			assert.strictEqual(controls.listings, sut.listings);
			assert.strictEqual(controls.clearSearchControl, sut.clearSearchControl);
			assert.strictEqual(controls.doSearchControl, sut.doSearchControl);
			assert.strictEqual(controls.toaster, sut.toaster);
			assert.strictEqual(controls.window, sut.window);
			assert.strictEqual(controls.getStampid, sut.getStampid);
			assert.strictEqual(controls.getStampImage, sut.getStampImage);
			assert.strictEqual(controls.nostampImage, sut.nostampImage);
			assert.strictEqual(controls.addLocalTagControl, sut.addLocalTagControl);
		});
	});
	describe('methods', function () {
		beforeEach(function () {
			sut.initialize(picklists, tags, search, common, router);
			sut.initializeControls(controls);
		});
		// describe('#truncate', function () {
		// 	it("should behave", function () {
		// 		var expected;
		// 		textValue = "now is the time for all good men to come to the aid of their party";
		// 		expected = 'now is the ...';
		// 		sut.truncate(10);
		// 		controls.stampLabels.forEach(function (stampLabel) {
		// 			assert.strictEqual(expected, stampLabel.text());				
		// 		})
		// 	});
		// });
		describe('#setAutoCompletes', function () {
			it("should populate tags autocomplete", function () {
				var spy = sinon.spy(sut.picklists, "setTagsAutocomplete");
				sut.setAutoCompletes();
				assert(spy.withArgs(sut.tagsource, false).calledOnce);
			});
			it("should populate collections autocomplete", function () {
				var spy = sinon.spy(sut.picklists, "setCollectionsAutocomplete");
				sut.setAutoCompletes();
				assert(spy.withArgs(sut.collectionsource, false).calledOnce);
			});

		});
		describe('#clearSearchEntries', function () {
			it("should remove collections from search criteria", function () {
				var spy = sinon.spy(sut.collectionsource, "val");
				sut.clearSearchEntries();
				assert(spy.withArgs(null).calledOnce);
			});
			it("should remove tags from search criteria", function () {
				var spy = sinon.spy(sut.tagsource, "val");
				sut.clearSearchEntries();
				assert(spy.withArgs(null).calledOnce);
			});
		});
		describe('#setImages', function () {
			it("should should assign src of each stamp image", function () {
				sut.setImages(images);
				assert.strictEqual(images[0].defaultImageSrc, controls.stampImages[0].src);
				assert.strictEqual(controls.nostampImage,  controls.stampImages[1].src);
				assert.strictEqual(images[2].defaultImageSrc, controls.stampImages[2].src);
				assert.strictEqual(images[3].defaultImageSrc, controls.stampImages[3].src);
			});
		});
		describe('#cleanup', function () {
			it("should reset src of stamp images", function () {
				var spy = sinon.spy(sut, "setImages");
				sut.cleanup(images);
				assert(spy.withArgs(images).calledOnce);
			});
			it("should remove local tags", function () {
				var spy = sinon.spy(tags, "deleteLocalTags");
				sut.cleanup(images);
				assert(spy.calledOnce);
			});
			it("should clear search criteria", function () {
				var spy = sinon.spy(sut, "clearSearchEntries");
				sut.cleanup(images);
				assert(spy.calledOnce);
			});
			// it("should truncate all text that is too long", function () {
			// 	var spy = sinon.spy(sut, "truncate");
			// 	sut.cleanup(images);
			// 	assert(spy.calledOnce);
			// 	sut.truncate.restore();
			// });
		});
		describe('#displaySubmittedToSandboxToaster', function () {
			it("should display 'copied' toaster message", function () {
				var spy = sinon.spy(common, "showToaster");
				sut.displaySubmittedToSandboxToaster();
				assert(spy.withArgs(sut.submitToSandboxAction, sut.toaster, "copied").calledOnce);
			});
		});
		describe('#submitToSandbox', function () {
			it("should get stamp id", function () {
				var spy = sinon.spy(sut, "getStampid");
				sut.submitToSandbox();
				assert(spy.withArgs(sut).calledOnce);
			});
			it("should submit stamp to sandbox", function () {
				var spy, stub, stampId;
				stampId = 42;
				stub = sinon.stub(sut, "getStampid");
				stub.returns(stampId);
				spy = sinon.spy(router, "submitToSandbox");
				sut.submitToSandbox();
				assert(spy.withArgs(stampId, sut.isValid, sut.displaySubmittedToSandboxToaster).calledOnce);
			});
		});
		describe('#removeDeleteStampAction', function () {
			it("should remove delete stamp control when successful", function () {
				var spy, data;
				spy = sinon.spy(sut.deleteStampAction, "remove");
				data = {
					success : true
				};
				sut.removeDeleteStampAction(data);
				assert(spy.calledOnce);
			});
			it("should not remove delete stamp control when unsuccessful", function () {
				var spy, data;
				spy = sinon.spy(sut.deleteStampAction, "remove");
				data = {
					success : false
				};
				sut.removeDeleteStampAction(data);
				sinon.assert.notCalled(spy);
			});
		});
		describe('#deleteStamp', function () {
			it("should get stamp id", function () {
				var spy = sinon.spy(sut, "getStampid");
				sut.deleteStamp();
				assert(spy.withArgs(sut).calledOnce);
			});
			it("should delete stamp", function () {
				var spy, stub, stampId;
				stampId = 42;
				stub = sinon.stub(sut, "getStampid");
				stub.returns(stampId);
				spy = sinon.spy(sut.router, "deleteStamp");
				sut.deleteStamp();
				assert(spy.withArgs(stampId, sut.removeDeleteStampAction).calledOnce);
			});
		});
		describe('#assignEventHandlers', function () {
			it("should assign submitToSandbox action", function () {
				assert.ok(!sut.submitToSandboxAction.clickFunction);
				sut.assignEventHandlers();
				assert.strictEqual(sut.submitToSandbox, sut.submitToSandboxAction.clickFunction);
			});
			it("should assign deleteStamp action", function () {
				assert.ok(!sut.deleteStampAction.clickFunction);
				sut.assignEventHandlers();
				assert.strictEqual(sut.deleteStamp, sut.deleteStampAction.clickFunction);
			});
			it("should set click event to clear search", function () {
				var spy = sinon.spy(sut.clearSearchControl, "click");
				sut.assignEventHandlers();
				assert(spy.withArgs(sut.clearSearch).calledOnce);
			});
			it("should set click event to perform search", function () {
				var spy = sinon.spy(sut.doSearchControl, "click");
				sut.assignEventHandlers();
				assert(spy.withArgs(sut.createQueryAndSearch).calledOnce);
			});
			it("should set blur event to leave tag entry", function () {
				var spy = sinon.spy(sut.tagsource, "blur");
				sut.assignEventHandlers();
				assert(spy.withArgs(sut.leaveTag).calledOnce);
			});
			it("should set click event to add a local tag", function () {
				var spy = sinon.spy(sut.addLocalTagControl, "click");
				sut.assignEventHandlers();
				assert(spy.withArgs(sut.addLocalTag).calledOnce);
			});
			it("should set click event to go to stamp", function () {
				var spy = sinon.spy(sut.stampListings, "click");
				sut.assignEventHandlers();
				assert(spy.withArgs(sut.goToStamp).calledOnce);
			});
		});
		describe('#assignEventHandlersAndTruncate', function () {
			it("should set actions", function () {
				var spy = sinon.spy(sut, "assignEventHandlers");
				sut.assignEventHandlersAndTruncate();
				assert(spy.calledOnce);
			});
			// it("should truncate all text that is too long", function () {
			// 	var spy = sinon.spy(sut, "truncate");
			// 	sut.assignEventHandlersAndTruncate(images);
			// 	assert(spy.calledOnce);
			// 	sut.truncate.restore();
			// });
		});
		describe('#setSearchControls', function () {
			it("should get collections in search criteria", function () {
				var spy = sinon.spy(sut.picklists, "getCollections");
				sut.setSearchControls();
				assert(spy.calledOnce);
			});
			it("should get tags in search criteria", function () {
				var spy = sinon.spy(sut.picklists, "getTags");
				sut.setSearchControls();
				assert(spy.calledOnce);
			});
			it("should should disable collection source when there are no collections", function () {
				var picklistsSpy, picklistsCallback, collectionsourceSpy, collections;
				picklistsSpy = sinon.spy(sut.picklists, "getCollections");
			    collectionsourceSpy = sinon.spy(sut.collectionsource, "attr");

				sut.setSearchControls();
				picklistsCallback = picklistsSpy.args[0][0];
				collections = [];
				picklistsCallback(collections)

				assert(collectionsourceSpy.withArgs("disabled", "disabled").calledOnce);

				sut.picklists.getCollections.restore();
				sut.collectionsource.attr.restore();

			});
			it("should should not disable collection source when collections exist", function () {
				var picklistsSpy, picklistsCallback, collectionsourceSpy, collections;
				picklistsSpy = sinon.spy(sut.picklists, "getCollections");
			    collectionsourceSpy = sinon.spy(sut.collectionsource, "attr");

				sut.setSearchControls();
				picklistsCallback = picklistsSpy.args[0][0];
				collections = ["a", "b", "c"];
				picklistsCallback(collections)

				sinon.assert.notCalled(collectionsourceSpy);

				sut.picklists.getCollections.restore();
				sut.collectionsource.attr.restore();				
			});

			it("should should disable tag source when there are no tags", function () {
				var picklistsSpy, tagsourceSpy, tags, picklistsCallback;
				picklistsSpy = sinon.stub(sut.picklists, "getTags");
			    tagsourceSpy = sinon.spy(sut.tagsource, "attr");

				sut.setSearchControls();
				picklistsCallback = picklistsSpy.args[0][0];
				tags = [];
				picklistsCallback(tags)

				assert(tagsourceSpy.withArgs("disabled", "disabled").calledOnce);

				sut.picklists.getTags.restore();
				sut.tagsource.attr.restore();

			});
			it("should should not disabled tag source when tags exist", function () {
				var picklistsSpy, tagsourceSpy, tags, picklistsCallback;
				picklistsSpy = sinon.stub(sut.picklists, "getTags");
			    tagsourceSpy = sinon.spy(sut.tagsource, "attr");

				sut.setSearchControls();
				picklistsCallback = picklistsSpy.args[0][0];
				tags = ["a", "b", "c"];
				picklistsCallback(tags)

				sinon.assert.notCalled(tagsourceSpy);

				sut.picklists.getTags.restore();
				sut.tagsource.attr.restore();
			});
		});
		describe('#createQueryAndSearch', function () {
			it("should do nothing when there are no collections or tags", function () {
				var collectionStub, tagsStub, spy;
				spy = sinon.spy(sut.search, "createQueryAndSearch");
				collectionStub = sinon.stub(sut.picklists, "getCollections");
				tagsStub = sinon.stub(sut.picklists, "getTags");
				collectionStub.returns([]);
				tagsStub.returns([]);
				sut.createQueryAndSearch();
				sinon.assert.notCalled(spy);
			});
			it("should Create query and search when there are both collections and tags", function () {
				var collectionStub, tagsStub, spy;
				spy = sinon.spy(sut.search, "createQueryAndSearch");
				collectionStub = sinon.stub(sut.picklists, "getCollections");
				tagsStub = sinon.stub(sut.picklists, "getTags");
				collectionStub.returns([42]);
				tagsStub.returns([42]);
				sut.createQueryAndSearch();
				assert(spy.withArgs(sut.cleanup).calledOnce);
			});
		});
		describe('#ready', function () {
			it("should hide listings", function () {
				var spy = sinon.spy(sut.listings, "hide");
				sut.ready();
				assert(spy.calledOnce);
			});
			it("should show listings", function () {
				var spy = sinon.spy(sut.listings, "hide");
				sut.ready();
				assert(spy.calledOnce);
			});
			it("should set search controls", function () {
				var spy = sinon.spy(sut, "setSearchControls");
				sut.ready();
				assert(spy.calledOnce);
			});
			it("should filter listings based on search criteria", function () {
				var spy = sinon.spy(sut.search, "filterStampListings");
				sut.ready();
				assert(spy.withArgs(sut.cleanup).calledOnce);
			});
			it("should fill the autocompletes", function () {
				var spy = sinon.spy(sut, "setAutoCompletes");
				sut.ready();
				assert(spy.calledOnce);
			});
		});
	});
});