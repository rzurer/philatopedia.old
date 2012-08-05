/*global  stamp, upsertStamp, removeTagFromQuery*/
"use strict";
			this.tagsContainer = controls.tagsContainer;//.taglabels?
			this.tagAddControl = controls.tagAddControl;//#addTag


		// deleteTag : function (obj) {
		// 	var text = obj.prev().text();
		// 	obj.parent().remove();
		// 	stamp.tags.splice(stamp.tags.indexOf(text), 1);
		// 	upsertStamp(function () {
		// 		picklists.setTagsAutocomplete(true);
		// 		removeTagFromQuery(text);
		// 	});
		// },
		// createAndAppendTag : function (text) {
		// 	var tag = createTagFromTemplate('taglabel'),
		// 		deleteCallback = function () {
		// 			this.deleteTag(this);
		// 		};
		// 	addTagToContainer(tag, text, deleteCallback, this.tagsContainer)		
		// },
		// addStampTags : function (stampTags) {
		// 	stampTags.forEach(function (text) {
		// 		this.addTag(text);
		// 	});
		// },
		// saveStampTag : function (stampTags, text) {
		// 	if (this.textIsInvalid(stampTags)) {
		// 		this.clearAndFocusTagSource();
		// 		return;
		// 	}
		// 	stampTags.push(text);
		// 	upsertStamp(function () {
		// 		picklists.setTagsAutocomplete(true);
		// 		this.clearAndFocusTagSource();
		// 		this.addStampTag(text);
		// 	});
		// },
		// leaveTag : function (input) {
		// 	var text = input.val().toLowerCase(); 
		// 	input.val(text);
		// 	this.tagAddControl.focus();
		// },
		// clearAndFocusTagSource : function () {
		// 	this.tagsource.val('').focus();
		// },
		// textIsInvalid : function (stampTags) {
		// 	var text = common.trim(tagsource.val());
		// 	return text.length === 0 || stampTags.indexOf(text) >= 0;
		// },

