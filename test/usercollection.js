/*global  describe, it, beforeEach, afterEach*/
"use strict";
var assert = require('assert'),
	sinon = require('sinon'),
	sut = require('../modules/usercollection').UserCollection,
    internals = require('../modules/_usercollection').privateMembers,
    setup = function () {
		sut.initialize(internals);
    };
describe('UserCollection', function () {
	beforeEach(setup);
	describe('#initializeControls', function () {
		it("should initialize internal controls", function () {
			var controls, spy;
			controls = {value : 1};
			spy = sinon.spy(internals, "initializeControls");
			sut.initializeControls(controls);
			assert(spy.withArgs(controls).calledOnce);
			internals.initializeControls.restore();
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