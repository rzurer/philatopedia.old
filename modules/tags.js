"use strict";
var controls;
exports.tags = function (methods) {
	return {
		initializeControls : function (tagControls) {
			controls = tagControls;
			methods.initializeControls(tagControls);
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
		}
	};
};