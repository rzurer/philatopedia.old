"use strict";
var controls,
	tags,
	common;
exports.privateMembers = {
	initialize: function (Tags, Common) {
		tags = Tags;
		common = Common;
	},
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