/*global  describe, it, beforeEach*/
"use strict";
var assert = require('assert'),
    sinon = require('sinon'),
    $ = require('jquery'),
    urls = require('../modules/urls').urls,
    constants = require('../modules/constants').constants,
    window = {},
    postFunction = function () {},
    router = require('../modules/routers').mainLayoutRouter(urls, window, postFunction),
    sut = require('../modules/home').home(urls, constants, router),
    splash = $('<img/>'),
    loggedOutTitle = 'logged out',
    loggedInTitle = 'logged in';
describe('home_module', function () {
    it("should set splash image src", function () {
        sut.ready(splash);

        assert.strictEqual(urls.splashSrc, splash.attr('src'));
    });
    describe('when use is not logged in', function () {
        var userIsLoggedIn = false;
        it("should set title of splash to logged out title", function () {
            sut.ready(splash, userIsLoggedIn);

            assert.strictEqual(constants.loggedOutSplashTitle, splash.attr('title'));
        });
    });
    describe('when use is logged in', function () {
        var userIsLoggedIn = true;
        it("should set title of splash to logged in title", function () {
            sut.ready(splash, userIsLoggedIn);

            assert.strictEqual(constants.loggedInSplashTitle, splash.attr('title'));
        });
        it("should set splash click to navigate to usercollection", function () {
            var spy = sinon.spy(router, "usercollection");
            sut.ready(splash, userIsLoggedIn);
            splash.click();
            router.usercollection.restore();

            sinon.assert.calledOnce(spy);
        });
        it("should set splash image mouseover and  mouseout to add and remove dashed border and set cursor to pointer and auto", function () {
            sut.ready(splash, userIsLoggedIn);
            splash.mouseover();

            assert.strictEqual("hoverImage", splash.attr('class'));
            assert.strictEqual("pointer", splash.css('cursor'));

            splash.mouseout();

            assert.strictEqual("", splash.attr('class'));
            assert.strictEqual("auto", splash.css('cursor'));
        });

    });
});

