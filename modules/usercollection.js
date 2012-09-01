"use strict";
exports.userCollection = function (methods) {
	return {
		initializeControls : function (controls) {
			methods.initializeControls(controls);
		},
		ready : function () {
			methods.ready();
		}
	};
};
