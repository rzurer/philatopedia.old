"use strict";
exports.Urls = {
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
	goToStamp : function (id) {
		return '/stamps/?id=' + id;
	}
};