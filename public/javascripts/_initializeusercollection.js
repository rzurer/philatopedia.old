/*globals  $*/
"use strict";
var initializeUsercollection = function (stringifiedArray, window, userCollection) {
	$(function () {
		var controls = {
			tagControls : {
				tagsource :  $('#tagsource'),
				addLocalTagControl :  $('#addLocalTag'),
				template : $('.taglabeltemplate'),
				localTagsContainer : $('.localTaglabels'),
				getLocalTags : function () {
					return $('.localTaglabels > div');
				},
				getLocalTaglabels : function () {
					return $('.localTaglabels > .localTaglabel label');
				}
			},
			searchControls : {
				collectionsource : $('#collectionsource'),
				searchcriteria : $('#searchcriteria'),
				collectioncriteria : $('#collectioncriteria'),
				collectionvalue : $('#collectionvalue'),
				tagscriteria : $('#tagscriteria'),
				tagsvalue : $('#tagsvalue'),
				clearsearch : $('#clearsearchdetail')
			},
			array : stringifiedArray,
			collectionsource : $('#collectionsource'),
			clearSearchControl :  $('#clearsearchdetail'),
			doSearchControl :  $('#doSearch'),
			toaster :  $('#toaster'),
			//window :  $(window),
			nostampImage :  '/images/nostamp.png',
			getSubmitToSandboxActions :  function () {
				return $('.stampitem-actions > .submitToSandbox');
			},
			getDeleteStampActions :  function () {
				return $('.stampitem-actions > .deleteStamp');
			},
			getSubmitToSandboxAction:  function (target) {
				return $(target);
			},
			getDeleteStampAction :  function (target) {
				return $(target).closest('div');
			},
			getStampContainer :  function (target) {
				return $(target).closest('div').prev('div.stampitem');
			},
			getStampImages : function () {
				return $('.stampitem > .stampitem-image > img');
			},
			getStampLabels : function () {
				return $('.normal');
			},
			listings : $('.listings'),
			getStampListings : function () {
				return $('.stampitem');
			},
			getStampId :  function (target) {
				return $(target).attr('id');
			},
			getStampIdForAction :  function (target) {
				return $(target).closest('div').prev('div.stampitem').attr('id');
			},
			getStampImage : function (stampId) {
				return $('.stampitem[id="' + stampId + '"] > .stampitem-image > img');
			}
		};
		userCollection.initializeControls(controls);
		userCollection.ready();
	});
};