"use strict";
exports._usercollection = function (picklists, tags, search, common, router, jquery) {
	var uicontrols, result, $;
	uicontrols = {};
	$ = jquery;
	result =  {
		initializeControls : function (controls) {
			uicontrols = controls;
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
		setImages : function () {
			var i, k, imageElement, stampId, defaultImageSrc, stampImage, stampImages, src;
			for (i = 0; i < uicontrols.array.length; i += 1) {
				imageElement = uicontrols.array[i];
				stampId = imageElement.stampId;
				defaultImageSrc = imageElement.defaultImageSrc;
				stampImage = $(uicontrols.getStampImage(stampId));
				if (defaultImageSrc && defaultImageSrc.length === 0) {
					stampImage.attr('src', uicontrols.nostampImage);
				} else {
					stampImage.attr('src', defaultImageSrc);
				}
			}
			stampImages = uicontrols.getStampImages();
			for (k = 0; k < stampImages.length; k += 1) {
				imageElement = $(stampImages[k]);
				src = imageElement.attr('src');
				if (!imageElement || src.length === 0) {
					imageElement.attr('src', uicontrols.nostampImage);
				}
			}
		},
		truncate : function () {
			var value, truncated, labels;
			labels = uicontrols.getStampLabels();
			labels.each(function () {
				if ($(this).text().length > 30) {
					value = $(this).text();
					truncated = value.substring(0, 25) + " ...";
					$(this).attr('title', value);
					$(this).text(truncated);
				}
			});
		},
		cleanup : function (html) {
			uicontrols.listings.hide();
			uicontrols.listings.html(html);
			this.setImages();
			tags.deleteLocalTags();
			this.clearSearchEntries();
			search.displaySearchCriteria();
			this.truncate();
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
		deleteStamp : function () {
			var stampId, target, deleteStampAction, deletedStampContainer, removeContainers, delayedRemoveContainers;
			target = this;
			stampId = uicontrols.getStampIdForAction(target);
			router.deleteStamp(stampId, function (data) {
				if (data.success) {
					deletedStampContainer = uicontrols.getStampContainer(target);
					deleteStampAction = uicontrols.getDeleteStampAction(target);
					removeContainers =  function () {
						deletedStampContainer.remove();
						deleteStampAction.remove();
					};
					delayedRemoveContainers = function () {
						setTimeout(removeContainers, 1200);
					};
					common.showToaster(deleteStampAction, uicontrols.toaster, "deleting ...", delayedRemoveContainers);
				}
			});
		},
		assignEventHandlers : function (argument) {
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