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
			var searchcriteriaDisplay, tagsDisplay, queryInfo;
			queryInfo = methods.getQueryInfo();
			searchcriteriaDisplay = !queryInfo.hasCollection && !queryInfo.hasTags ? 'All' : '';
			controls.searchcriteria.text('Search Criteria: ' + searchcriteriaDisplay);
			if (queryInfo.hasCollection) {
				controls.collectioncriteria.text('Collection: ');
				controls.collectionvalue.text(queryInfo.query.collection);
			} else {
				controls.collectioncriteria.text('');
				controls.collectionvalue.text('');
			}
			if (queryInfo.hasTags) {
				tagsDisplay = '';
				queryInfo.query.tags.forEach(function (element) {
					tagsDisplay += element + ', ';
				});
				tagsDisplay = tagsDisplay.substring(0, tagsDisplay.lastIndexOf(','));
				controls.tagscriteria.text('Tags: ');
				controls.tagsvalue.text(tagsDisplay);
			} else {
				controls.tagscriteria.text('');
				controls.tagsvalue.text('');
			}
			controls.clearsearch.toggle(queryInfo.hasCollection || queryInfo.hasTags);
		},
		showHideClearSearch : function () {
			var queryInfo = methods.getQueryInfo();
			controls.clearsearch.toggle(queryInfo.hasCollection || queryInfo.hasTags);
		},
		getStampIdDefaultImageIdImageSrcArray : function (callback) {
			var query = common.getFromLocalStorage('collectionOrTagsQuery');
			router.getStampIdDefaultImageIdImageSrcArray(query, callback);
		}
	};
};

