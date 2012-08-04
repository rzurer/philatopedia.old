"use strict";
var tags, that, arr;
exports.privateMembers = {
	initialize : function (picklists, Tags, search, common, router) {
		that = this;
		this.picklists = picklists;
		tags = Tags;
		this.search = search;
		this.common = common;
		this.router = router;
	},
	initializeControls : function (Controls) {
		this.controls = Controls;
		// this.getSubmitToSandboxActions = controls.getSubmitToSandboxActions;
		// this.getSubmitToSandboxAction = controls.getSubmitToSandboxAction;
		// this.getDeleteStampActions = controls.getDeleteStampActions;
		// this.getDeleteStampAction = controls.getDeleteStampAction;
		// this.getStampContainer = controls.getStampContainer;
		// this.getStampImages = controls.getStampImages;
		// this.getStampLabels = controls.getStampLabels;
		// this.getStampListings = controls.getStampListings;
		// this.listings = controls.listings;
		// this.collectionsource = controls.collectionsource;
		// this.clearSearchControl = controls.clearSearchControl;
		// this.doSearchControl = controls.doSearchControl;
		// this.toaster = controls.toaster;
		// this.window = controls.window;
		// this.getStampId = controls.getStampId;
		// this.getStampIdForAction = controls.getStampIdForAction;
		// this.getStampImage = controls.getStampImage;
		// this.nostampImage = controls.nostampImage;
		// this.tagsource = controls.tagControls.tagsource;
		// this.addLocalTagControl = controls.tagControls.addLocalTagControl;
		// tags.initializeControls(controls.tagControls);
		// arr = controls.array;
		// this.search.initializeControls(controls.searchControls);
	},
	setAutoCompletes : function () {
		this.picklists.setTagsAutocomplete(this.controls.tagsource, false);
		this.picklists.setCollectionsAutocomplete(this.controls.collectionsource, false);
		//this.picklists.setCountriesAutocomplete(false);
	},
	clearSearchEntries : function () {
		this.controls.collectionsource.val(null);
		this.controls.tagsource.val(null);
	},
	setImages : function () {
		var i, k, stampId, defaultImageSrc, img, image, stampImages;
		for (i = 0; i < arr.length; i += 1) {
			stampId = arr[i].stampId;
			defaultImageSrc = arr[i].defaultImageSrc;
			img = this.controls.getStampImage(stampId);
			img.attr('src', defaultImageSrc);
			if (img.attr('src') && img.attr('src').length === 0) {
				img.attr('src', that.controls.nostampImage);
			}
		}
		stampImages = this.getStampImages();
		for (k = 0; k < stampImages.length; k += 1) {
			image = stampImages[k];
			if (!image.getAttribute('src') || image.getAttribute('src').length === 0) {
				image.setAttribute('src', that.controls.nostampImage);
			}
		}
	},
	truncate : function (callback) {
		var value, truncated, labels;
		labels = that.controls.getStampLabels();
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
	cleanup : function (html, callback) {
		that.controls.listings.html(html);
		that.setImages();
		tags.deleteLocalTags();
		that.clearSearchEntries();
		that.search.displaySearchCriteria();
		that.truncate(callback);
	},
	displaySubmittedToSandboxToaster : function (target) {
		that.common.showToaster(target, that.toaster, "copied");
	},
	isValid : function (stamp) {
		return stamp.issuedBy && stamp.issuedBy !== 'null';
	},
	submitToSandbox : function () {
		var stampId, callback, target;
		stampId = that.controls.getStampIdForAction(this);
		target = that.controls.getSubmitToSandboxAction(this);
		callback = function () {
			that.common.showToaster(target, that.controls.toaster, "copied");
		};
		that.router.submitToSandbox(stampId, that.isValid, callback);
	},
	goToStamp : function () {
		that.router.goToStamp(that.controls.getStampId(this));
	},
	deleteStamp : function () {
		var stampId, target, deleteStampAction, deletedStampContainer, removeContainers, delayedRemoveContainers;
		target = this;
		stampId = that.controls.getStampIdForAction(target);
		that.router.deleteStamp(stampId, function (data) {
			if (data.success) {
				deletedStampContainer = that.controls.getStampContainer(target);
				deleteStampAction = that.controls.getDeleteStampAction(target);
				removeContainers =  function () {
					deletedStampContainer.remove();
					deleteStampAction.remove();
				};
				delayedRemoveContainers = function () {
					setTimeout(removeContainers, 1200);
				};
				that.common.showToaster(deleteStampAction, that.controls.toaster, "deleting ...", delayedRemoveContainers);
			}
		});
	},
	assignEventHandlers : function (argument) {
		this.controls.getSubmitToSandboxActions().click(this.submitToSandbox);
		this.controls.getDeleteStampActions().click(this.deleteStamp);
		this.controls.getStampListings().click(this.goToStamp);
		this.controls.clearSearchControl.click(this.clearSearch);
		this.controls.tagsource.blur(this.leaveTag);
		this.controls.addLocalTagControl.click(this.addLocalTag);
		this.controls.doSearchControl.click(this.createQueryAndSearch);
	},
	setSearchControls : function () {
		var that = this,
			collectionsCallback = function (collections) {
				if (collections.length === 0) {
					that.controls.collectionsource.attr("disabled", "disabled");
				}
			},
			tagsCallback = function (tags) {
				if (tags.length === 0) {
					that.controls.tagsource.attr("disabled", "disabled");
				}
			};
		this.picklists.getCollections(collectionsCallback);
		this.picklists.getTags(tagsCallback);
	},
	createQueryAndSearch : function () {
		var callback = function (data) {
			if (data.collections.length === 0 && data.tags.length === 0) {
				return;
			}
			that.search.createQueryAndSearch(that.cleanup);
		};
		that.picklists.getTagsAndCollections(callback);
	},
	clearSearch : function () {
		that.search.clearSearch(that.cleanup);
	},
	leaveTag : function () {
		tags.leaveLocalTag(this);
	},
	addLocalTag : function () {
		tags.addLocalTag(function () {
			tags.deleteLocalTag(this);
		});
	},
	ready : function () {
		this.controls.listings.hide();
		this.setSearchControls();
		this.setAutoCompletes();
		this.assignEventHandlers();
		this.search.filterStampListings(function () {
			that.cleanup(function () {
				that.controls.listings.show();
			});
		});
	}
};