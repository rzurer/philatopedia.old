"use strict";
exports._usercollection = function (collectionCommon, urls, picklists, tags, search, common, router, jquery) {
	var uicontrols, result, $;
	uicontrols = {};
	$ = jquery;
	result =  {
		initializeControls : function (controls, imageInfos) {
			uicontrols = controls;
			collectionCommon.initializeControls(controls.commonControls, imageInfos);
			tags.initializeControls(controls.tagControls);
			search.initializeControls(controls.searchControls);
			return common.getObjectInfo(uicontrols);
		},
		setAutoCompletes : function () {
			picklists.setTagsAutocomplete(uicontrols.tagControls.tagsource, false);
			picklists.setCollectionsAutocomplete(uicontrols.collectionsource, false);
			//picklists.setCountriesAutocomplete(false);
		},
		clearSearchEntries : function () {
			uicontrols.collectionsource.val(null);
			uicontrols.tagControls.tagsource.val(null);
		},
		cleanup : function (html) {
			uicontrols.listings.hide();
			uicontrols.listings.html(html);
			collectionCommon.setImages();
			tags.deleteLocalTags();
			this.clearSearchEntries();
			search.displaySearchCriteria();
			collectionCommon.truncate();
			this.assignEventHandlers();
			uicontrols.listings.show();
		},
		displaySubmittedToSandboxToaster : function (target) {
			common.showToaster(target, uicontrols.toaster, "copied");
		},
		isValid : function (stamp) {
			if (stamp.issuedBy && stamp.issuedBy !== 'null') {
				return true;
			}
			return false;
		},
		submitToSandbox : function () {
			var stampId, callback, target;
			stampId = uicontrols.getStampIdForAction(this);
			target = uicontrols.getSubmitToSandboxAction(this);
			callback = function () {
				common.showToaster(target, uicontrols.toaster, "copied");
			};
			router.submitToSandbox(stampId, result.isValid, callback);
		},
		goToStamp : function () {
			var stampId;
			stampId = uicontrols.getStampId(this);
			router.goToStamp(stampId);
		},
		delayedRemoveContainers : function (target) {
			var toaster = uicontrols.toaster,
				deletedStampContainer = uicontrols.getStampContainer(target),
				deleteStampAction = uicontrols.getDeleteStampAction(target),
				removeContainers =  function () {
					deletedStampContainer.remove();
					deleteStampAction.remove();
				};
			setTimeout(removeContainers, 1200);
		},
		doDeleteStamp : function (target) {
			var deletedStampContainer = uicontrols.getStampContainer(target),
				toaster = uicontrols.toaster,
				callback = function () {
					result.delayedRemoveContainers(target);
				};
			common.showToaster(deletedStampContainer, toaster, "deleting ...", callback);
		},
		deleteStamp : function () {
			var stampId, target;
			target = this;
			stampId = uicontrols.getStampIdForAction(target);
			router.deleteStamp(stampId, function (data) {
				if (data.success) {
					result.doDeleteStamp(target);
				}
			});
		},
		assignEventHandlers : function () {
		    uicontrols.getSubmitToSandboxActions().click(this.submitToSandbox);
			uicontrols.getDeleteStampActions().click(this.deleteStamp);
			uicontrols.getStampListings().click(this.goToStamp);
			uicontrols.clearSearchControl.click(this.clearSearch);
			uicontrols.tagControls.tagsource.blur(this.leaveTag);
			uicontrols.tagControls.addLocalTagControl.click(this.addLocalTag);
			uicontrols.doSearchControl.click(this.createQueryAndSearch);
		},
		setSearchControls : function () {
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
		},
		createQueryAndSearch : function () {
			var callback, cleanupCallback;
			cleanupCallback = function (html) {
				result.cleanup(html);
			};
			callback = function (data) {
				if (data.collections.length === 0 && data.tags.length === 0) {
					return;
				}
				search.createQueryAndSearch(cleanupCallback);
			};
			picklists.getTagsAndCollections(callback);
		},
		clearSearch : function () {
			var cleanupCallback;
			cleanupCallback = function (html) {
				result.cleanup(html);
			};
			search.clearSearch(cleanupCallback);
		},
		leaveTag : function () {
			tags.leaveLocalTag();
		},
		addLocalTag : function () {
			tags.addLocalTag(function () {
				tags.deleteLocalTag();
			});
		},
		ready : function () {
			var callback;
			this.setSearchControls();
			this.setAutoCompletes();
			callback = function (html) {
				result.cleanup(html);
			};
			search.filterStampListings(callback);
		}
	};
	return result;
};