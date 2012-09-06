/*global  describe, it, beforeEach*/
"use strict";
var assert = require('assert'),
    sinon = require('sinon'),
    window = {},
    postFunction = {},
    urls = require('../modules/urls').urls,
    mainLayoutRouter = require('../modules/routers').mainLayoutRouter(urls, window, postFunction),
    loginControl = require('../modules/logincontrol').loginControl(mainLayoutRouter),
    mainMenu = require('../modules/mainMenu').mainMenu(urls),
    sut = require("../modules/layout").layout(loginControl, mainMenu),
    func = function () {},
    loginControls = {
        loginMenu : {click : func, hide : func},
        logoutMenu : {click : func, show : func},
        body : {click : func},
        usernameInput : {click : func},
        loginButton : {click : func},
        logincontainer : {slideUp : func},
        welcome : {hide : func, text : func, show : func}
    },
    menuControls = {
        homeLink : {attr : func},
        sandboxLink : {attr : func},
        usercollectionLink : {attr : func},
        addLink : {attr : func},
        signinLink : {attr : func},
        signoutLink : {attr : func},
        menu : {
            children : function () { return { removeClass : func }; },
            find : function () { return { parent : function () { return {addClass : func}; }}; }
        }
    },
    username = "amy winehouse",
    currentUrl = "www.google.com";
describe('layout_module', function () {
    describe('ready', function () {
        it("should initialize login controls", function () {
            var spy = sinon.spy(loginControl, "initializeControls");
            sut.ready(loginControls, menuControls, username, currentUrl);
            loginControl.initializeControls.restore();

            sinon.assert.calledWith(spy, loginControls);
        });
        it("should set click events on logincontrol ", function () {
            var spy = sinon.spy(loginControl, "setClickEvents");
            sut.ready(loginControls, menuControls, username, currentUrl);
            loginControl.setClickEvents.restore();

            sinon.assert.calledOnce(spy);
        });
        it("should initialize menu controls", function () {
            var spy = sinon.spy(mainMenu, "initializeControls");
            sut.ready(loginControls, menuControls, username, currentUrl);
            mainMenu.initializeControls.restore();

            sinon.assert.calledWith(spy, menuControls);
        });
        it("should pass username to login controls", function () {
            var spy = sinon.spy(loginControl, "setLoginControls");
            sut.ready(loginControls, menuControls, username, currentUrl);
            loginControl.setLoginControls.restore();

            sinon.assert.calledWith(spy, username);
        });
        it("should set active menu to current url", function () {
            var spy = sinon.spy(mainMenu, "setActiveMenu");
            sut.ready(loginControls, menuControls, username, currentUrl);
            mainMenu.setActiveMenu.restore();

            sinon.assert.calledWith(spy, currentUrl);
        });
    });
});