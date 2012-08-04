"use strict";
exports.privateMembers = {
    initialize : function (urls, loginControl, mainMenu, mainLayoutRouter) {
        this.loginControl = loginControl;
        this.mainLayoutRouter = mainLayoutRouter;
        this.mainMenu = mainMenu;
        this.urls = urls;
    },
    setLoginControls : function (username) {
        this.loginControl.setLoginControls(username);
    },
    initializeLoginControl : function (loginControls) {
        this.loginControl.initialize(loginControls, this.mainLayoutRouter);
        this.loginControl.setClickEvents();
    },
    initializeMainMenu : function (menuControls) {
        this.mainMenu.initialize(menuControls, this.urls);
    },
    setActiveMenu : function (currentUrl) {
        this.mainMenu.setActiveMenu(currentUrl);
    },
    ready : function (loginControls, menuControls, username, currentUrl) {
        this.initializeLoginControl(loginControls);
        this.initializeMainMenu(menuControls);
        this.setLoginControls(username);
        this.setActiveMenu(currentUrl);
    }
};