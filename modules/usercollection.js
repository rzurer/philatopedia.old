"use strict";
var	methods;
exports.UserCollection = {
	initialize : function (internals) {
		methods = internals;
	},
	initializeControls : function (controls) {
		methods.initializeControls(controls);
	},
	ready : function () {
		methods.ready();
	}
};
