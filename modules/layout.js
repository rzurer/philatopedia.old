"use strict";
exports.layout = function (loginControl, mainMenu) {
    return {
        ready : function (loginControls, menuControls, username, currentUrl) {
            loginControl.initializeControls(loginControls);
            loginControl.setClickEvents();
            mainMenu.initializeControls(menuControls);
            loginControl.setLoginControls(username);
            mainMenu.setActiveMenu(currentUrl);
        }
    };
};