"use strict";
var internals;
exports.MainLayout = {
    initialize : function (layout) {
        internals = layout;
    },
    ready : function (loginControls, menuControls, username, currentUrl) {
        internals.ready(loginControls, menuControls, username, currentUrl);
    }
};