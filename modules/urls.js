"use strict";
exports.urls = {
	home : '/',
	sandbox : '/stamps/sandbox',
	usercollection : '/stamps/usercollection',
	add : '/stamps/new',
	login : '/login',
	logout : '/logout',
	poundsign : '#',
	getDistinctTags : '/getDistinctTags',
	getDistinctCollections : '/getDistinctCollections',
	getAllCountryNames : '/getAllCountryNames',
	filterStampListings : '/filterStampListings',
	submitToSandbox : '/submitToSandbox',
	getStamp : '/getStamp',
	deleteStamp : '/deleteStamp',
	splashSrc : "/images/StampCollectionPelicanLake1960.jpg",
	noimagesrc : '/images/dropimagehere.png',
	nostampimage : '/images/nostamp.png',
	getUser : '/getUser',
	identify : '/identify',
	getStampHtml : '/stamps',
	getStampIdDefaultImageIdImageSrcArray : '/getStampIdDefaultImageIdImageSrcArray',
	upsertStamp : '/upsertStamp',
	goToStamp : function (id) {
		return '/stamps/?id=' + id;
	},
	getFullSizeImageUrl : function (src) {
		if (src === this.noimagesrc) {
			return this.noimagesrc;
		}
		return '/temp/orig_' + src.substr(src.lastIndexOf('/') + 1);
	}
};