/*global  describe, it, beforeEach, afterEach*/
"use strict";
var assert = require('assert'),
	sinon = require('sinon'),
	sut = require('../modules/usercollection').UserCollection,
    internals = require('../modules/_usercollection').privateMembers,
    setup = function () {
    	var tags = {initializeControls : function () {}},
			search = {initializeControls : function () {}};
		sut.initialize(internals);
		internals.initialize(null, tags, search)
    };
describe('UserCollection', function () {
	beforeEach(setup);
	describe('#initializeControls', function () {
		it("should initialize internal controls", function () {
			var controls, spy;
			spy = sinon.spy(internals, "initializeControls");
    		controls = {tagControls : {}};
			sut.initializeControls(controls);
			internals.initializeControls.restore();
			
			assert(spy.withArgs(controls).calledOnce);
		});
	});
	describe('#reader', function () {
		it("should call internal ready", function () {
			var mock = sinon.mock(internals);
			sinon.mock(internals).expects("ready").once();
			sut.ready();
			mock.verify();
			mock.restore();
		});
	});
});