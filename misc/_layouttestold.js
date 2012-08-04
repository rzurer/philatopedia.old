/*global  describe, it, beforeEach*/
"use strict";
var sut = require('../modules/_layout').privateMembers,
    assert = require('assert'),
    urls = require('../modules/urls'),
    loginControl,
    mainMenu,
    controls,
    window,
    postFunction,
    mainLayoutRouter,
    username = 'username',
    setup = function () {
        window = {};
        postFunction = {};
        controls = {};
        mainLayoutRouter = {
            urls : undefined,
            window : undefined,
            postFunction : undefined,
            initialize : function (urls, window, postFunction) {
                this.urls = urls;
                this.window = window;
                this.postFunction = postFunction;
            }
        };
        loginControl = {
            controls : undefined,
            mainLayoutRouter : undefined,
            username : '',
            setClickEventsCalled : false,
            setClickEvents : function () {
                this.setClickEventsCalled = true;
            },
            setLoginControls : function (username) {
                this.username = username;
            },
            initialize : function (controls, mainLayoutRouter) {
                this.controls = controls;
                this.mainLayoutRouter = mainLayoutRouter;
            }
        };
        mainMenu = {
            controls : undefined,
            urls : undefined,
            setActiveMenuCalled : false,
            initialize : function (controls, urls) {
                this.controls = controls;
                this.urls = urls;
            },
            setActiveMenu : function () {
                this.setActiveMenuCalled = true;
            }
        };
        sut.initialize(window, postFunction, urls, loginControl, mainMenu, mainLayoutRouter);
    };
describe('MainLayout', function () {
    beforeEach(setup);
    describe('#initialize', function () {
        it("should call mainLayoutRouter initialize", function () {
            assert.strictEqual(urls, mainLayoutRouter.urls);
            assert.strictEqual(window, mainLayoutRouter.window);
            assert.strictEqual(postFunction, mainLayoutRouter.postFunction);
        });
    });
    describe('#setLoginControls', function () {
        it("should call loginControl setLoginControls with username", function () {
            assert.strictEqual('', loginControl.username);
            sut.setLoginControls(username);
            assert.strictEqual(username, loginControl.username);
        });
    });
    describe('#initializeLoginControl', function () {
        it("should call loginControl initialize", function () {
            assert.ok(!loginControl.controls);
            assert.ok(!loginControl.mainLayoutRouter);
            sut.initializeLoginControl(controls, mainLayoutRouter);
            assert.ok(loginControl.controls);
            assert.ok(loginControl.mainLayoutRouter);
       });
    });
    describe('#initializeMainMenu', function () {
        it("should call mainMenu initialize", function () {
            assert.ok(!mainMenu.controls);
            assert.ok(!mainMenu.urls);
            sut.initializeMainMenu(controls, urls);
            assert.ok(mainMenu.controls);
            assert.ok(mainMenu.urls);
        });
    });
    describe('#setActiveMenu', function () {
        it("should call mainMenu setActiveMenu", function () {
            assert.strictEqual(false, mainMenu.setActiveMenuCalled);
            sut.setActiveMenu();
            assert.strictEqual(true, mainMenu.setActiveMenuCalled);
        });
    });
});