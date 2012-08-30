"use strict";
var controls = {};
exports._tags = function () {
	return {
		initializeControls : function (tagControls) {
			controls = tagControls;
		},
		createTagFromTemplate : function (classname) {
			var tag = controls.template.clone();
			tag.removeClass('taglabeltemplate');
			tag.addClass(classname);
			return tag;
		},
		addTagToContainer : function (tag, text, deleteCallback, container) {
			tag.children('label').text(text);
			tag.children('img').click(deleteCallback);
			tag.appendTo(container);
		},
		getLocalTagsValues : function (tagValues) {
			var labels = controls.getLocalTaglabels();
			labels.each(function (index, element) {
				tagValues.push(element.innerText);
			});
			return tagValues;
		},
		showHideLocalTagsBorder : function () {
			var tagValues = this.getLocalTagsValues([]);
			if (tagValues.length > 0) {
				controls.localTagsContainer.css('border', '3px dotted gainsboro');
				return;
			}
			controls.localTagsContainer.css('border', '');
		},
		localTagsContain : function (text) {
			var lowerText, found, tagValues;
			found = false;
			lowerText = text.toLowerCase();
			tagValues = this.getLocalTagsValues([]);
			tagValues.forEach(function (tagText) {
				if (tagText === lowerText) {
					found = true;
				}
			});
			return found;
		},
		createAndAppendlocalTag : function (text, deleteCallback) {
			var tag = this.createTagFromTemplate('localTaglabel');
			this.addTagToContainer(tag, text, deleteCallback, controls.localTagsContainer);
		}
	};
};