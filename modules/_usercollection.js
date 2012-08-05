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
	initializeControls : function (controls) {
		this.getSubmitToSandboxActions = controls.getSubmitToSandboxActions;
		this.getSubmitToSandboxAction = controls.getSubmitToSandboxAction;
		this.getDeleteStampActions = controls.getDeleteStampActions;
		this.getDeleteStampAction = controls.getDeleteStampAction;
		this.getStampContainer = controls.getStampContainer;
		this.getStampImages = controls.getStampImages;
		this.getStampLabels = controls.getStampLabels;
		this.getStampListings = controls.getStampListings;
		this.listings = controls.listings;
		this.collectionsource = controls.collectionsource;
		this.clearSearchControl = controls.clearSearchControl;
		this.doSearchControl = controls.doSearchControl;
		this.toaster = controls.toaster;
		this.window = controls.window;
		this.getStampId = controls.getStampId;
		this.getStampIdForAction = controls.getStampIdForAction;
		this.getStampImage = controls.getStampImage;
		this.nostampImage = controls.nostampImage;
		this.tagsource = controls.tagControls.tagsource;
		this.addLocalTagControl = controls.tagControls.addLocalTagControl;
		tags.initializeControls(controls.tagControls);
		arr = controls.array;
		this.search.initializeControls(controls.searchControls);
	},
	setAutoCompletes : function () {
		this.picklists.setTagsAutocomplete(this.tagsource, false);
		this.picklists.setCollectionsAutocomplete(this.collectionsource, false);
		//this.picklists.setCountriesAutocomplete(false);
	},
	clearSearchEntries : function () {
		this.collectionsource.val(null);
		this.tagsource.val(null);
	},
	setImages : function () {
		var i, k, stampId, defaultImageSrc, img, image, stampImages;
		for (i = 0; i < arr.length; i += 1) {
			stampId = arr[i].stampId;
			defaultImageSrc = arr[i].defaultImageSrc;
			img = this.getStampImage(stampId);
			img.attr('src', defaultImageSrc);
			if (img.attr('src') && img.attr('src').length === 0) {
				img.attr('src', that.nostampImage);
			}
		}
		stampImages = this.getStampImages();
		for (k = 0; k < stampImages.length; k += 1) {
			image = stampImages[k];
			if (!image.getAttribute('src') || image.getAttribute('src').length === 0) {
				image.setAttribute('src', that.nostampImage);
			}
		}
	},
	truncate : function () {
		var value, truncated, labels;
		labels = that.getStampLabels();
		labels.each(function () {
			if (this.innerText.length > 30) {
				value = this.innerText;
				truncated = value.substring(0, 25) + " ...";
				this.setAttribute('title', value);
				this.innerText = truncated;
			}
		});
	},
	cleanup : function (html) {
		that.listings.hide();
		that.listings.html(html);
		that.setImages();
		tags.deleteLocalTags();
		that.clearSearchEntries();
		that.search.displaySearchCriteria();
		that.truncate();
		that.assignEventHandlers();
		that.listings.show();
	},
	displaySubmittedToSandboxToaster : function (target) {
		that.common.showToaster(target, that.toaster, "copied");
	},
	isValid : function (stamp) {
		return stamp.issuedBy && stamp.issuedBy !== 'null';
	},
	submitToSandbox : function () {
		var stampId, callback, target;
		stampId = that.getStampIdForAction(this);
		target = that.getSubmitToSandboxAction(this);
		callback = function () {
			that.common.showToaster(target, that.toaster, "copied");
		};
		that.router.submitToSandbox(stampId, that.isValid, callback);
	},
	goToStamp : function () {
		that.router.goToStamp(that.getStampId(this));
	},
	deleteStamp : function () {
		var stampId, target, deleteStampAction, deletedStampContainer, removeContainers, delayedRemoveContainers;
		target = this;
		stampId = that.getStampIdForAction(target);
		that.router.deleteStamp(stampId, function (data) {
			if (data.success) {
				deletedStampContainer = that.getStampContainer(target);
				deleteStampAction = that.getDeleteStampAction(target);
				removeContainers =  function () {
					deletedStampContainer.remove();
					deleteStampAction.remove();
				};
				delayedRemoveContainers = function () {
					setTimeout(removeContainers, 1200);
				};
				that.common.showToaster(deleteStampAction, that.toaster, "deleting ...", delayedRemoveContainers);
			}
		});
	},
	assignEventHandlers : function (argument) {
	    this.getSubmitToSandboxActions().click(this.submitToSandbox);
		this.getDeleteStampActions().click(this.deleteStamp);
		this.getStampListings().click(this.goToStamp);
		this.clearSearchControl.click(this.clearSearch);
		this.tagsource.blur(this.leaveTag);
		this.addLocalTagControl.click(this.addLocalTag);
		this.doSearchControl.click(this.createQueryAndSearch);
	},
	setSearchControls : function () {
		var that = this,
			collectionsCallback = function (collections) {
				if (collections.length === 0) {
					that.collectionsource.attr("disabled", "disabled");
				}
			},
			tagsCallback = function (tags) {
				if (tags.length === 0) {
					that.tagsource.attr("disabled", "disabled");
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
		this.listings.hide();
		this.setSearchControls();
		this.setAutoCompletes();		
		this.search.filterStampListings(function (html) { that.cleanup(html);});
	}
};