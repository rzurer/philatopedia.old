/*global  $,  stamp, upsertStamp, picklists, removeTagFromQuery*/
"use strict";
function addStampTag(tag) {
	var cloned = $('.taglabeltemplate').clone();
	cloned.removeClass('taglabeltemplate').addClass('taglabel');
	cloned.children('label').text(tag);
	cloned.appendTo('.taglabels');
}
function addlocalStampTag(tag) {
	var cloned = $('.taglabeltemplate').clone();
	cloned.removeClass('taglabeltemplate').addClass('localTaglabel');
	cloned.children('label').text(tag);
	cloned.children('img').click(function () {deleteLocalTag(this)});
	cloned.appendTo('.localTaglabels');
}
function addStampTags(tags) {
	tags.forEach(addStampTag);
}

function tagsContain(source) {
	return stamp.tags.indexOf(source) >= 0;
}

function addTag() {
	var tag, cloned;
	tag = $('#tagsource').val().trim();
	if (tag.length === 0 || tagsContain(tag)) {
		$('#tagsource').val('').focus();
		return;
	}
	addStampTag(tag);
	stamp.tags.push(tag);
	upsertStamp(function () {
		picklists.setTagsAutocomplete(true);
		$('#tagsource').val('').focus();
	});
}

function deleteTag(obj, callback) {
	var tag;
	tag = $(obj).prev().text();
	$(obj).parent().remove();
	stamp.tags.splice(stamp.tags.indexOf(tag), 1);
	upsertStamp(function () {
		picklists.setTagsAutocomplete(true);
		removeTagFromQuery(tag);
	});
}

function leaveTag(obj) {
	$(obj).val($(obj).val().toLowerCase());
	$('#addTag').focus();
}
function getLocalTags() {
	var tags = [];
	$('.localTaglabels > .localTaglabel label').each(function () {
		tags.push($(this).text());
	});
	return tags;
}

function getLocalTagsContainer() {
	return $('.localTaglabels');
}
function localTagsExist() {
	return getLocalTags().length > 0;
}
function showHideTagsBorder() {
	var container;
	container = getLocalTagsContainer();
	if (localTagsExist()) {
		container.css('border', '3px dotted gainsboro');
		return;
	}
	container.css('border', '3px dotted transparent');
}

function deleteLocalTags() {
	$('.localTaglabels > div').remove(); //'.localTaglabels > .localTaglabel' ?
	showHideTagsBorder();
}
function localTagsContain(source) {
	var text, lowerSource, found;
	found = false;
	lowerSource = source.toLowerCase();
	getLocalTags().forEach(function (element) {
		if (element === lowerSource) {
			found = true;
		}
	});
	return found;
}
function deleteLocalTag(obj) {
	var source;
	source = $(obj).prev().text();
	$(obj).parent().remove();
	showHideTagsBorder();
}

function addLocalTag() {
	var tag, cloned;
	tag = $('#tagsource').val().trim();
	if (tag.length === 0 || localTagsContain(tag)) {
		$('#tagsource').val('').focus();
		return;
	}
	addlocalStampTag(tag);
	showHideTagsBorder();
	$('#tagsource').val('').focus();
}




