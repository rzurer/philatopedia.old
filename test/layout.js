/*global  describe, it, beforeEach*/
"use strict";
var assert = require('assert'),
	sinon = require('sinon'),
    sut = require('../modules/layout').MainLayout,
    func = function () {},
    layout = {initialize : func, ready : func},
    loginControls = {},
    menuControls = {},
    username = 'ralph',
    currentUrl = '/home',
    window = {},
    postFunction = {},
    urls = {},
    loginControl = {},
    mainMenu = {},
    mainLayoutRouter = {};
describe('MainLayout', function () {
	describe('#ready', function () {
		it("should call layout ready", function () {
			var spy = sinon.spy(layout, "ready");
			sut.initialize(layout);
			sut.ready(loginControls, menuControls, username, currentUrl);
			assert(spy.withArgs(loginControls, menuControls, username, currentUrl).calledOnce);
		});
	});
});
