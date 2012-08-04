"use strict";
exports.MainLayout = function MainLayout() {
    this.initialize = function (window, postFunction, urls, loginControl, mainMenu, mainLayoutRouter) {
        this.loginControlInitialized = false;
        this.postFunction =  postFunction;
        this.urls =  urls;
        this.loginControl = loginControl;
        this.mainMenu =  mainMenu;
        this.mainLayoutRouter =  mainLayoutRouter;
        this.mainLayoutRouter.initialize(this.urls, window, this.postFunction);
        window.mainlayout = this;
    };
    this.setLoginControls = function (username) {
        this.loginControl.setLoginControls(username);
    };
    this.initializeLoginControl = function (controls) {
        if (this.loginControlInitialized === false) {
            this.loginControl.initialize(controls, this.mainLayoutRouter);
            this.loginControl.setClickEvents(this.postFunction);
            this.loginControlInitialized = true;
        }
    };
    this.initializeMainMenu = function (controls) {
        this.mainMenu.initialize(controls, this.urls);
    };
    this.setActiveMenu = function (currentUrl) {
        this.mainMenu.setActiveMenu(currentUrl);
    };
    this.ready = function (loginControls, menuControls, username, currentUrl) {
        this.initializeLoginControl(loginControls);
        this.initializeMainMenu(menuControls);
        this.setLoginControls(username);
        this.setActiveMenu(currentUrl);
    };
};
