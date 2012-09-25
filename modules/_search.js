"use strict";
var controls;
exports._search = function (tags, common) {
	return {
		initializeControls : function (searchControls) {
			controls = searchControls;
		},
		createQuery : function () {
			var query;
			query = {};
			query.collection = controls.collectionsource.val();
			query.tags = tags.getLocalTagsValues([]);
			common.placeInLocalStorage('collectionOrTagsQuery', query);
			return query;
		},
		getQueryInfo : function () {
			var query, collection, tags, hasCollection, hasTags;
			query = common.getFromLocalStorage('collectionOrTagsQuery');
			if (!query) {
				return { hasTags : false, hasCollection: false };
			}
			collection = query.collection;
			tags = query.tags;
			hasCollection = collection && collection.length > 0;
			hasTags = tags && tags.length > 0;
			return { hasTags : hasTags, hasCollection: hasCollection, query : query};
		}
	};
};