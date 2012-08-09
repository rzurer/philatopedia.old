/*global  describe, it, beforeEach*/
"use strict";
var sut = require('../modules/_layout').privateMembers,
    assert = require('assert'),
    urls = require('../modules/urls').Urls,
    sinon = require('sinon'),
    loginControl,
    mainMenu,
    controls,
    window,
    postFunction,
    mainLayoutRouter,
    username = 'username',
    func = function () {},
    setup = function () {
        window = {};
        postFunction = {};
        controls = {};
        mainLayoutRouter = {
            postFunction : func,
            initialize : func
        };
        loginControl = {
            setClickEvents : func,
            setLoginControls : func,
            initialize : func
        };
        mainMenu = {
            initialize : func,
            setActiveMenu : func
        };
    };
describe('_layout', function () {
    beforeEach(setup);
    describe('#initialize', function () {
        it("should set controls", function () {
            assert.ok(!sut.loginControl);
            assert.ok(!sut.mainLayoutRouter);
            assert.ok(!sut.mainMenu);
            assert.ok(!sut.urls);
            sut.initialize(urls, loginControl, mainMenu, mainLayoutRouter);
            assert.strictEqual(loginControl, sut.loginControl);
            assert.strictEqual(mainLayoutRouter, sut.mainLayoutRouter);
            assert.strictEqual(mainMenu, sut.mainMenu);
            assert.strictEqual(urls, sut.urls);
        });
    });
    describe('#methods', function () {
        beforeEach(function () {
            sut.initialize(urls, loginControl, mainMenu, mainLayoutRouter);
        });
        describe('#setLoginControls', function () {
            it("should set LoginControls with username", function () {
                var spy, username;
                username = "ben the rat";
                spy = sinon.spy(loginControl, "setLoginControls");
                sut.setLoginControls(username);
                assert(spy.withArgs(username).calledOnce);
            });
        });
        describe('#initializeLoginControl', function () {
            it("should initialize loginControl", function () {
                var spy, loginControls;
                loginControls = {};
                spy = sinon.spy(sut.loginControl, "initialize");
                sut.initializeLoginControl(loginControls, sut.mainLayoutRouter);
                assert(spy.withArgs(loginControls, sut.mainLayoutRouter).calledOnce);
            });
            it("should set ClickEvents for loginControl", function () {
                var spy, loginControls;
                loginControls = {};
                spy = sinon.spy(sut.loginControl, "setClickEvents");
                sut.initializeLoginControl(loginControls, sut.mainLayoutRouter);
                assert(spy.calledOnce);
            });
        });
        describe('#initializeMainMenu', function () {
            it("should initialize mainMenu", function () {
                var spy, menuControls;
                spy = sinon.spy(sut.mainMenu, "initialize");
                menuControls = {};
                sut.initializeMainMenu(menuControls, sut.urls);
                assert(spy.withArgs(menuControls, sut.urls).calledOnce);
            });
        });
        describe('#setActiveMenu', function () {
            it("should set active menu", function () {
                var spy, currentUrl;
                currentUrl = "google";
                spy = sinon.spy(sut.mainMenu, "setActiveMenu");
                sut.setActiveMenu(currentUrl);
                assert(spy.withArgs(currentUrl).calledOnce);
            });
        });
        describe('#ready', function () {
            it("should initialize loginControls", function () {
                var spy, loginControls, menuControls, username, currentUrl;
                loginControls = {};
                spy = sinon.spy(sut, "initializeLoginControl");
                sut.ready(loginControls, menuControls, username, currentUrl);
                assert(spy.withArgs(loginControls).calledOnce);
            });
            it("should initialize mainMenu", function () {
                var spy, loginControls, menuControls, username, currentUrl;
                menuControls = {};
                spy = sinon.spy(sut, "initializeMainMenu");
                sut.ready(loginControls, menuControls, username, currentUrl);
                assert(spy.withArgs(menuControls).calledOnce);
            });
            it("should set LoginControls", function () {
                var spy, loginControls, menuControls, username, currentUrl;
                menuControls = {};
                spy = sinon.spy(sut, "setLoginControls");
                sut.ready(loginControls, menuControls, username, currentUrl);
                assert(spy.withArgs(username).calledOnce);
            });
            it("should set ActiveMenu", function () {
                var spy, loginControls, menuControls, username, currentUrl;
                currentUrl = "google";
                spy = sinon.spy(sut, "setActiveMenu");
                sut.ready(loginControls, menuControls, username, currentUrl);
                assert(spy.withArgs(currentUrl).calledOnce);
            });
        });
    });
});