/*global  describe, it, beforeEach, afterEach*/
"use strict";
var sut = require("../modules/_tags")._tags(),
	$ = require('jquery'),
	assert = require('assert'),
	sinon = require('sinon'),
	controls,
	func = function () {},
	setup = function () {
		controls = {
			template : {clone : function () { return { removeClass : func, addClass : func, children : function () {return {text : func, click : func}; }, appendTo : func }; }},
			localTagsContainer : {css : func},
			getLocalTaglabels : function (tagValues) {
				return $([{innerText : 'a'}, {innerText : 'b'}, {innerText : 'c'}]);
			},
		};
		sut.initializeControls(controls);
	},
	teardown = function () {
		controls = null;
	};
describe('LocalTagsInternals', function () {
	beforeEach(setup);
	afterEach(teardown);
	describe('#createTagFromTemplate', function () {
		it("should create new tag from template", function () {
			var spy = sinon.spy(controls.template, "clone");
			sut.createTagFromTemplate();
			sinon.assert.called(spy);
		});
		it("should remove template css class from tag", function () {
			var tag, spy;
			tag = {addClass : func, removeClass: func};
			controls.template.clone = function () {return tag; };
			spy = sinon.spy(tag, "removeClass");
			sut.createTagFromTemplate();
			assert(spy.withArgs("taglabeltemplate").calledOnce);
		});
		it("should add css class to tag", function () {
			var tag, spy, classname;
			tag = {addClass : func, removeClass: func};
			classname = "reddish-pinkish";
			controls.template.clone = function () {return tag; };
			spy = sinon.spy(tag, "addClass");
			sut.createTagFromTemplate(classname);
			assert(spy.withArgs(classname).calledOnce);
		});
	});
	describe('#addTagToContainer', function () {
		var label, tag, img;
		beforeEach(function () {
			label = {text : func};
			img = {click : func};
			tag = {children : function (selector) {
				if (selector === 'label') {
					return label;
				}
				return img;
			}, appendTo : func};
		});
		it("should locate tag label and image controls", function () {
			var spy;
			spy = sinon.spy(tag, "children");
			sut.addTagToContainer(tag, null, null, null);
			assert(spy.withArgs("label").calledOnce);
			assert(spy.withArgs("img").calledOnce);
		});
		it("should set label text", function () {
			var spy, text;
			text = "the text";
			spy = sinon.spy(label, "text");
			sut.addTagToContainer(tag, text, null, null);
			assert(spy.withArgs(text).calledOnce);
		});
		it("should set delete image click event", function () {
			var spy, text, deleteCallback;
			spy = sinon.spy(img, "click");
			deleteCallback = function () {};
			sut.addTagToContainer(tag, null, deleteCallback, null);
			assert(spy.withArgs(deleteCallback).calledOnce);
		});
		it("should add tag to tags container", function () {
			var spy, text, container;
			container = {};
			spy = sinon.spy(tag, "appendTo");
			sut.addTagToContainer(tag, null, null, container);
			assert(spy.withArgs(container).calledOnce);
		});
	});
	describe('#getLocalTagsValues', function () {
		it("should create an array of tags text", function () {
			var tagvalues;
			tagvalues = [];
			tagvalues = sut.getLocalTagsValues(tagvalues);
			assert.deepEqual(['a', 'b', 'c'], tagvalues);
		});
	});
	describe('#showHideLocalTagsBorder', function () {
		describe('when tags exist', function () {
			it("should show container border", function () {
				var spy;
				sinon.stub(sut, "getLocalTagsValues").returns(['d', 'e', 'f']);
				spy = sinon.spy(controls.localTagsContainer, 'css');
				sut.showHideLocalTagsBorder();
				assert(spy.withArgs('border', '3px dotted gainsboro').calledOnce);
				sut.getLocalTagsValues.restore();
			});
		});
		describe('when tags do not exist', function () {
			it("should hide container border", function () {
				var spy;
				sinon.stub(sut, "getLocalTagsValues").returns([]);
				spy = sinon.spy(controls.localTagsContainer, 'css');
				sut.showHideLocalTagsBorder();
				assert(spy.withArgs('border', '').calledOnce);
				sut.getLocalTagsValues.restore();
			});
		});
	});
	describe('#localTagsContain', function () {
		describe('when tag exists in tags', function () {
			it("should return true", function () {
				var text, result;
				text = 'little sparrows';
				sinon.stub(sut, "getLocalTagsValues").returns(['d', text, 'f']);
				result = sut.localTagsContain(text);
				assert.strictEqual(true, result);
				sut.getLocalTagsValues.restore();
			});
		});
		describe('when tag does not exist in tags', function () {
			it("should return false", function () {
				var text, result;
				text = 'little sparrows';
				sinon.stub(sut, "getLocalTagsValues").returns(['d', 'e', 'f']);
				result = sut.localTagsContain(text);
				assert.strictEqual(false, result);
				sut.getLocalTagsValues.restore();
			});
		});
	});
	describe('#createAndAppendlocalTag', function () {
		it("should create tag and assign css", function () {
			var spy;
			spy = sinon.spy(sut, 'createTagFromTemplate');
			sut.createAndAppendlocalTag();
			assert(spy.withArgs('localTaglabel').calledOnce);
			sut.createTagFromTemplate.restore();
		});
		it("should add tag to container", function () {
			var spy, text, tag, deleteCallback;
			text = 'little sparrows';
			deleteCallback = func;
			spy = sinon.spy(sut, 'addTagToContainer');
			sut.createAndAppendlocalTag(text);
			tag = controls.template.clone();
			assert(spy.withArgs(tag, text, deleteCallback, controls.localTagsContainer));
		});
	});
});