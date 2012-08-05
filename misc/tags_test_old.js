/*global  describe, it, beforeEach, afterEach*/
"use strict";
var sut  = require('../modules/tags'),
	assert = require('assert'),
	sinon = require('sinon'),
	common = require('../modules/common').Common,
	picklists = require('../modules/picklists'),
	controls,
	sampletext = '',
	key = '25ff070e-58d3-4aac-97db-bd536e3e72c6',
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
		sut.initialize(controls, picklists, common);
	},
	teardown = function () {
		delete Array.prototype.each;
	};
describe('tags', function () {
	beforeEach(setup);
	afterEach(teardown);
	describe('#deleteLocalTags', function () {
		it("should remove all local tags", function () {
			var spy = sinon.spy(controls.localTags, "remove");
			sut.deleteLocalTags();
			sinon.assert.called(spy);
		});
		describe('when there are no tags', function () {
			it("should remove border from tags container", function () {
				var spy = sinon.spy(controls.localTagsContainer, "css");
				sut.deleteLocalTags();
				sinon.assert.calledWith(spy, 'border', '');
			});
		});
	});
	describe('#leaveLocalTag', function () {
		it("call convert tagsource value to lowercase", function () {
			var spy;
			sampletext = "HELLO";
			controls.tagsource.val = function () { return sampletext; };
			spy = sinon.spy(controls.tagsource, "val");
			sut.leaveLocalTag();
			assert(spy.calledTwice);
			assert(spy.withArgs("hello").calledOnce);
		});
		it("focus add tag control", function () {
			var spy;
			controls.tagsource.val = function () { return sampletext; };
			spy = sinon.spy(controls.localTagAddControl, "focus");
			sut.leaveLocalTag();
			assert(spy.calledOnce);
		});
	});
	describe('#addLocalTag', function () {
		it("should trim tagsource value", function () {
			var spy, getTrimmedTagText, actual;
			controls.tagsource.val = function () {return "   hello   "; };
			getTrimmedTagText = sut.getPrivateMember('getTrimmedTagText');
			actual = getTrimmedTagText();
			assert.strictEqual("hello", actual);
		});
		it("should get tagsource value", function () {
			var spy;
			controls.tagsource.val = function () {return "   hello   "; };
			spy = sinon.spy(controls.tagsource, "val");
			sut.addLocalTag();
			assert(spy.calledTwice);
		});
		describe('when tagsource is empty', function () {
			var getTrimmedTagText;
			beforeEach(function () {
				getTrimmedTagText = sut.getPrivateMember('getTrimmedTagText');
				sut.setPrivateMember('getTrimmedTagText', function () {return {length : 0}; });
			});
			afterEach(function () {
				sut.setPrivateMember('getTrimmedTagText', getTrimmedTagText);
			});
			it("should clear tagsource", function () {
				var spy;
				spy = sinon.spy(controls.tagsource, "val");
				sut.addLocalTag();
				assert(spy.withArgs('').calledOnce);
			});
			it("should focus tagsource", function () {
				var spy;
				spy = sinon.spy(controls.tagsource, "focus");
				sut.addLocalTag();
				assert(spy.calledOnce);
			});
		});
		describe('when tags already exists', function () {
			var getTrimmedTagText, localTagsContain;
			beforeEach(function () {
				getTrimmedTagText = sut.getPrivateMember('getTrimmedTagText');
				sut.setPrivateMember('getTrimmedTagText', function () {return {length : 15}; });
				localTagsContain = sut.getPrivateMember('localTagsContain');
				sut.setPrivateMember('localTagsContain', function () {return true; });
			});
			afterEach(function () {
				sut.setPrivateMember('getTrimmedTagText', getTrimmedTagText);
				sut.setPrivateMember('localTagsContain', localTagsContain);
			});
			it("should clear tagsource", function () {
				var spy;
				spy = sinon.spy(controls.tagsource, "val");
				sut.addLocalTag();
				assert(spy.withArgs('').calledOnce);
			});
			it("should focus tagsource", function () {
				var spy;
				spy = sinon.spy(controls.tagsource, "focus");
				sut.addLocalTag();
				assert(spy.calledOnce);
			});
			it("should call createAndAppendlocalTag", function () {
				var spy = sinon.spy(sut, 'addLocalTag');
				sut.addLocalTag();
				assert(spy.called);
			});
		});
		describe('#createTagFromTemplate', function () {
			var createTagFromTemplate, tag;
			beforeEach(function () {
				createTagFromTemplate = sut.getPrivateMember('createTagFromTemplate');
				tag = {addClass : func, removeClass : func}
			});
			it("should clone template", function () {
				var spy;
				spy = sinon.spy(controls.template, "clone");
				createTagFromTemplate("classname");
				assert(spy.calledOnce);
			});
			it("should remove old css class", function () {
				var spy;
				sinon.stub(controls.template, "clone").returns(tag);
				spy = sinon.spy(tag, 'removeClass');
				createTagFromTemplate("classname");
				assert(spy.withArgs('taglabeltemplate').called);
			});
			it("should add css class", function () {
				var spy, classname;
				classname = 'red';
				sinon.stub(controls.template, "clone").returns(tag);
				spy = sinon.spy(tag, 'addClass');
				createTagFromTemplate(classname);
				assert(spy.withArgs(classname).called);
			});
		});
	});
});



