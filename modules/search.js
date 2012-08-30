"use strict";
exports.search = function (methods, common, router) {
	var controls;
	return {
		initializeControls : function (searchControls) {
			controls = searchControls;
			methods.initializeControls(searchControls);
		},
		filterStampListings : function (callback) {
			var query = common.getFromLocalStorage('collectionOrTagsQuery');
			if (!query) {
				query = methods.createQuery();
			}
			router.filterStampListings(query, callback);
		},
		createQueryAndSearch : function (callback) {
			methods.createQuery();
			this.filterStampListings(callback);
		},
		clearSearch : function (callback) {
			common.removeLocalStorageKey('collectionOrTagsQuery');
			this.filterStampListings(callback);
		},
		displaySearchCriteria : function () {
			var query, collection, tags, hasCollection, hasTags, searchcriteriaDisplay, tagsDisplay, shouldShow;
			query = common.getFromLocalStorage('collectionOrTagsQuery');
			collection = query.collection;
			tags = query.tags;
			hasCollection = collection && collection.length > 0;
			hasTags = tags && tags.length > 0;
			searchcriteriaDisplay = !hasCollection && !hasTags ? 'All' : '';
			controls.searchcriteria.text('Search Criteria: ' + searchcriteriaDisplay);
			if (hasCollection) {
				controls.collectioncriteria.text('Collection: ');
				controls.collectionvalue.text(collection);
			} else {
				controls.collectioncriteria.text('');
				controls.collectionvalue.text('');
			}
			if (hasTags) {
				tagsDisplay = '';
				tags.forEach(function (element) {
					tagsDisplay += element + ', ';
				});
				tagsDisplay = tagsDisplay.substring(0, tagsDisplay.lastIndexOf(','));
				controls.tagscriteria.text('Tags: ');
				controls.tagsvalue.text(tagsDisplay);
			} else {
				controls.tagscriteria.text('');
				controls.tagsvalue.text('');
			}
			if (hasCollection || hasTags) {
				controls.clearsearch.show();
				return;
			}
			controls.clearsearch.hide();
		}
	};
};