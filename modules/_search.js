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
		}
	};
};