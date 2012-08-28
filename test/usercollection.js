/*global  describe, it, beforeEach, afterEach*/
"use strict";
var assert = require('assert'),
	sinon = require('sinon'),
	sut = require('../modules/usercollection').UserCollection,
    internals = require('../modules/_usercollection'),
    common = require('../modules/common').Common,
    methods,
    setup = function () {
    	var tags = {initializeControls : function () {}},
			search = {initializeControls : function () {}};
        methods = internals.privateMembers(null, tags, search, common, null);
		sut.initialize(methods);
    };
describe('UserCollection', function () {
	beforeEach(setup);
	describe('#initializeControls', function () {
		it("should initialize internal controls", function () {
			var controls, spy;
			spy = sinon.spy(methods, "initializeControls");
    		controls = {tagControls : {}};
			sut.initializeControls(controls);
			methods.initializeControls.restore();
			
			assert(spy.withArgs(controls).calledOnce);
		});
	});
	describe('#reader', function () {
		it("should call internal ready", function () {
			var mock = sinon.mock(methods);
			sinon.mock(methods).expects("ready").once();
			sut.ready();
			mock.verify();
			mock.restore();
		});
	});
});