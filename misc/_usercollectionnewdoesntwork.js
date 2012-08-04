"use strict";
var that, picklists, tags, search, common, router,
	getSubmitToSandboxActions, getSubmitToSandboxAction, getDeleteStampActions,
	getDeleteStampAction, getStampContainer, getStampListings, getStampImages,
	getStampLabels, getStampImage, getStampId, listings, collectionsource,
	clearSearchControl, doSearchControl, toaster, nostampImage, tagsource,
	addLocalTagControl, tagControls, searchControls, arr, assignControls, disableEnable;
assignControls = function (controls) {
	getSubmitToSandboxActions = controls.getSubmitToSandboxActions;
	getSubmitToSandboxAction = controls.getSubmitToSandboxAction;
	getDeleteStampActions = controls.getDeleteStampActions;
	getDeleteStampAction = controls.getDeleteStampAction;
	getStampContainer = controls.getStampContainer;
	getStampListings = controls.getStampListings;
	getStampImages = controls.getStampImages;
	getStampLabels = controls.getStampLabels;
	getStampImage = controls.getStampImage;
	getStampId = controls.getStampId;
	listings = controls.listings;
	collectionsource = controls.collectionsource;
	clearSearchControl = controls.clearSearchControl;
	doSearchControl = controls.doSearchControl;
	toaster = controls.toaster;
	arr = controls.array;
	nostampImage = controls.nostampImage;
	tagControls = controls.tagControls;
	searchControls = controls.searchControls;
	tagsource = tagControls.tagsource;
	addLocalTagControl = tagControls.addLocalTagControl;
};
disableEnable = function (source, target) {
	if (source.length === 0) {
		target.attr("disabled", "disabled");
		return;
	}
	target.removeAttr("disabled");
};
exports.privateMembers = {
	initialize : function (Picklists, Tags, Search, Common, Router) {
		that = this;
		picklists = Picklists;
		tags = Tags;
		search = Search;
		common = Common;
		router = Router;
	},
	initializeControls : function (controls) {
		assignControls(controls);
		tags.initializeControls(tagControls);
		search.initializeControls(searchControls);
	},
	clearSearchEntries : function () {
		collectionsource.val(null);
		tagsource.val(null);
	},
	setImages : function () {
		var i, k, stampId, defaultImageSrc, img, image, stampImages;
		for (i = 0; i < arr.length; i += 1) {
			stampId = arr[i].stampId;
			defaultImageSrc = arr[i].defaultImageSrc;
			img = getStampImage(stampId);
			img.attr('src', defaultImageSrc);
			if (img.attr('src') && img.attr('src').length === 0) {
				img.attr('src', nostampImage);
			}
		}
		stampImages = getStampImages();
		for (k = 0; k < stampImages.length; k += 1) {
			image = stampImages[k];
			if (!image.getAttribute('src') || image.getAttribute('src').length === 0) {
				image.setAttribute('src', nostampImage);
			}
		}
	},
	truncate : function (callback) {
		var value, truncated, labels;
		labels = getStampLabels();
		labels.each(function () {
			if (this.innerText.length > 30) {
				value = this.innerText;
				truncated = value.substring(0, 25) + " ...";
				this.setAttribute('title', value);
				this.innerText = truncated;
			}
		});
		if (callback) {
			callback();
		}
	},
	isValid : function (stamp) {
		return stamp.issuedBy && stamp.issuedBy !== 'null';
	},
	submitToSandbox : function () {
		var stampId, callback, target;
		stampId = getStampId(this);
		console.log(this);
		console.log(stampId);
		target = getSubmitToSandboxAction(this);
		callback = function () {
			common.showToaster(target, toaster, "copied");
		};
		router.submitToSandbox(stampId, that.isValid, callback);
	},
	goToStamp : function () {
		var stampId = getStampId(this);
		console.log(this);
		console.log(stampId);
		router.goToStamp(stampId);
	},
	deleteStamp : function () {
		console.log("deleteStamp");
		var stampId, target, deleteStampAction, deletedStampContainer, removeContainers, delayedRemoveContainers;
		target = this;
		stampId = getStampId(target);
		console.log(this);
		console.log(stampId);
		router.deleteStamp(stampId, function (data) {
			if (data.success) {
				deletedStampContainer = getStampContainer(target);
				deleteStampAction = getDeleteStampAction(target);
				removeContainers =  function () {
					deletedStampContainer.remove();
					deleteStampAction.remove();
				};
				delayedRemoveContainers = function () {
					setTimeout(removeContainers, 1200);
				};
				common.showToaster(deleteStampAction, toaster, "deleting ...", delayedRemoveContainers);
			}
		});
	},
	createQueryAndSearch : function () {
		var callback = function (data) {
			if (data.collections.length === 0 && data.tags.length === 0) {
				return;
			}
			search.createQueryAndSearch(that.cleanup);
		};
		picklists.getTagsAndCollections(callback);
	},
	clearSearch : function () {
		search.clearSearch(that.cleanup);
	},
	leaveTag : function () {
		tags.leaveLocalTag(this);
	},
	addLocalTag : function () {
		tags.addLocalTag(function () {
			tags.deleteLocalTag(this);
		});
	},
	assignEventHandlers : function () {
		getStampListings().click(this.goToStamp);
		getDeleteStampActions().click(this.deleteStamp);
		getSubmitToSandboxActions().click(this.submitToSandbox);
		addLocalTagControl.click(this.addLocalTag);
		tagsource.blur(this.leaveTag);
		doSearchControl.click(this.createQueryAndSearch);
		clearSearchControl.click(this.clearSearch);
	},
	setSearchControls : function () {
		var collectionsCallback = function (collections) {
				disableEnable(collections, collectionsource);
			},
			tagsCallback = function (tags) {
				disableEnable(tags, tagsource);
			};
		picklists.getCollections(collectionsCallback);
		picklists.getTags(tagsCallback);
	},
	setAutoCompletes : function () {
		picklists.setTagsAutocomplete(tagsource, false);
		picklists.setCollectionsAutocomplete(collectionsource, false);
		//this.picklists.setCountriesAutocomplete(false);
	},
	cleanup : function (html, callback) {
		listings.html(html);
		that.setImages();
		tags.deleteLocalTags();
		that.clearSearchEntries();
		search.displaySearchCriteria();
		that.truncate(callback);
		listings.show();
	},
	ready : function () {
		listings.hide();
		this.setSearchControls();
		this.setAutoCompletes();
		this.assignEventHandlers();
		search.filterStampListings(that.cleanup);
	}
};