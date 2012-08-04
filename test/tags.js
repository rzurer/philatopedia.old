/*global  describe, it, beforeEach, afterEach*/
"use strict";
var sut = require('../modules/tags').tags,
	internals = require('../modules/_tags').internals,
	assert = require('assert'),
	sinon = require('sinon'),
	controls,
	func = function () {},
	setup = function () {
		Array.prototype.each = [].forEach;
		controls = {
			template : {clone : function () { return { removeClass : func, addClass : func, children : function () {return {text : func, click : func}; }, appendTo : func }; }},
			tagsource : {val : func, focus : func},
			localTagAddControl : {focus : func},
			localTagsContainer : {css : func},
			localTags : {remove : func},
			localTaglabels : []
		};
		sut.initialize(controls, internals);
	},
	teardown = function () {
		delete Array.prototype.each;
	};
describe('LocalTags', function () {
	beforeEach(setup);
	describe('#deleteLocalTags', function () {
		it("should remove all local tags", function () {
			var spy = sinon.spy(controls.localTags, "remove");
			sut.deleteLocalTags();
			sinon.assert.called(spy);
		});
		it("should adjust tags container border", function () {
			var spy = sinon.spy(internals, "showHideLocalTagsBorder");
			sut.deleteLocalTags();
			sinon.assert.calledOnce(spy);
			internals.showHideLocalTagsBorder.restore();
		});
	});
	describe('#leaveLocalTag', function () {
		var sampletext;
		beforeEach(function () {
			sampletext = "HELLO";
			controls.tagsource.val = function () { return sampletext; };
		});
		it("should convert tag entry value to lowercase", function () {
			var spy;
			spy = sinon.spy(controls.tagsource, "val");
			sut.leaveLocalTag();
			assert(spy.calledTwice);
			assert(spy.withArgs("hello").calledOnce);
		});
		it("should focus add tag control", function () {
			var spy;
			spy = sinon.spy(controls.localTagAddControl, "focus");
			sut.leaveLocalTag();
			assert(spy.calledOnce);
		});
	});
	describe('#addLocalTag', function () {
		it("should check if tags contain trimmed tagsource value", function () {
			var spy;
			controls.tagsource.val = function () {return "   hello   "; };
			spy = sinon.spy(internals, "localTagsContain");
			sut.addLocalTag();
			assert(spy.withArgs('hello').calledOnce);
			internals.localTagsContain.restore();
		});
		it("should clear tag entry value", function () {
			var spy;
			controls.tagsource.val = function () {return "foo"; };
			spy = sinon.spy(controls.tagsource, "val");
			sut.addLocalTag();
			assert(spy.withArgs('').calledOnce);
			controls.tagsource.val.restore();
		});
		it("should focus tag entry control", function () {
			var spy;
			controls.tagsource.val = function () {return "foo"; };
			spy = sinon.spy(controls.tagsource, "focus");
			sut.addLocalTag();
			assert(spy.calledOnce);
			controls.tagsource.focus.restore();
		});
		describe('when tagsource is empty', function () {
			beforeEach(function () {
				sinon.stub(internals, "localTagsContain").returns(false);
				controls.tagsource.val = function () {return ""; };
			});
			afterEach(function () {
				internals.localTagsContain.restore();
			});
			it("should not create and append tag", function () {
				var spy, actual;
				spy = sinon.spy(internals, "createAndAppendlocalTag");
				sut.addLocalTag();
				sinon.assert.notCalled(spy);
				internals.createAndAppendlocalTag.restore();
			});
			it("should not adjust tags container border", function () {
				var spy, actual;
				spy = sinon.spy(internals, "showHideLocalTagsBorder");
				sut.addLocalTag();
				sinon.assert.notCalled(spy);
				internals.showHideLocalTagsBorder.restore();
			});
		});
		describe('when tag already exists', function () {
			beforeEach(function () {
				sinon.stub(internals, "localTagsContain").returns(true);
				controls.tagsource.val = function () {return "pennies from heaven"; };
			});
			afterEach(function () {
				internals.localTagsContain.restore();
			});
			it("should not create and append tag", function () {
				var spy, actual;
				spy = sinon.spy(internals, "createAndAppendlocalTag");
				sut.addLocalTag();
				sinon.assert.notCalled(spy);
				internals.createAndAppendlocalTag.restore();
			});
			it("should not adjust tags container border", function () {
				var spy, actual;
				spy = sinon.spy(internals, "showHideLocalTagsBorder");
				sut.addLocalTag();
				sinon.assert.notCalled(spy);
				internals.showHideLocalTagsBorder.restore();
			});
		});
		describe('when tage entry text is not empty and the tag does not exist', function () {
			beforeEach(function () {
				sinon.stub(internals, "localTagsContain").returns(false);
				controls.tagsource.val = function () {return "pennies from heaven"; };
			});
			afterEach(function () {
				internals.localTagsContain.restore();
			});
			it("should create and append tag", function () {
				var spy, actual;
				spy = sinon.spy(internals, "createAndAppendlocalTag");
				sut.addLocalTag();
				sinon.assert.calledOnce(spy);
			});
			it("should adjust tags container border", function () {
				var spy, actual;
				spy = sinon.spy(internals, "showHideLocalTagsBorder");
				sut.addLocalTag();
				sinon.assert.calledOnce(spy);
				internals.showHideLocalTagsBorder.restore();
			});
		});
	});
	describe('#deleteLocalTag', function () {
		var tag, parent;
		beforeEach(function () {
			parent = {remove : func};
			tag = {parent : function () {return parent; }};
		});
		it("should remove tag", function () {
			var spy = sinon.spy(parent, "remove");
			sut.deleteLocalTag(tag);
			sinon.assert.called(spy);
		});
		it("should adjust tags container border", function () {
			var spy = sinon.spy(internals, "showHideLocalTagsBorder");
			sut.deleteLocalTag(tag);
			sinon.assert.called(spy);
			internals.showHideLocalTagsBorder.restore();
		});
	});
	describe('#getLocalTagsValues', function () {
		it("should call internal methos", function () {
			var spy, tagvalues;
			spy = sinon.spy(internals, "getLocalTagsValues");
			tagvalues = ["a", "b"];
			sut.getLocalTagsValues(tagvalues);
			sinon.assert.calledWith(spy, tagvalues);
			internals.getLocalTagsValues.restore();
		});
	});
});



