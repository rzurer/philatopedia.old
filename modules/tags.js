"use strict";
var picklists,
	controls = {},
	methods;
exports.tags = {
	initialize : function (internals) {
		methods = internals;
	},
	initializeControls : function (tagControls) {
		controls.tagsource = tagControls.tagsource;
		controls.getLocalTags = tagControls.getLocalTags;
		controls.addLocalTagControl = tagControls.addLocalTagControl;
		methods.initialize(tagControls);
	},
	deleteLocalTag  : function () {
		var parent;
		parent = this.parentNode;
		parent.parentNode.removeChild(parent);
		methods.showHideLocalTagsBorder();
	},
	leaveLocalTag : function () {
		var text = controls.tagsource.val();
		text = text.toLowerCase();
		controls.tagsource.val(text);
		controls.addLocalTagControl.focus();
	},
	deleteLocalTags : function () {
		controls.getLocalTags().remove();
		methods.showHideLocalTagsBorder();
	},
	addLocalTag : function () {
		var text;
		text = controls.tagsource.val();
		text = text.trim();
		if (text.length > 0 && !methods.localTagsContain(text)) {
			methods.createAndAppendlocalTag(text, this.deleteLocalTag);
			methods.showHideLocalTagsBorder();
		}
		controls.tagsource.val('');
		controls.tagsource.focus();
	},
	getLocalTagsValues : function (tagValues) {
		return methods.getLocalTagsValues(tagValues);
	},
};