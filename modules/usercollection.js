"use strict";
exports.userCollection = function (methods) {
	return {
		initializeControls : function (controls, imageInfos) {
			methods.initializeControls(controls, imageInfos);
		},
		ready : function () {
			methods.ready();
		}
	};
};
