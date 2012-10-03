/*global  describe, beforeEach, afterEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	getInput = function () {
		return $('<input/>');
	},
	getCheckbox = function () {
		return $('<input/>').attr('type', 'checkbox');
	},
	getList = function () {
		return $('<ul/>');
	},
	getListItem = function () {
		return $('<li/>');
	},
	getImage = function () {
		return $('<img/>');
	},
	getLabel = function () {
		return $('<label/>');
	},
	localStorage = {},
	controls,
	stamp,
	sut,
	defaultCatalogId = "1234561",
	catalogNumber = "245",
	watermark = "C 3",
	func = function () {},
    postFunction = function (url, data, callback) {
        if (callback) {
            callback(data);
        }
    },
	common = require('../modules/common').common(localStorage),
	slider = require('../modules/slider').slider(common),
    displayProperties = [],
    listItem = getListItem(),
    setup = function () {
		controls = {
			catalogName : getLabel(),
			catalogNumber : getInput(),
			currentCatalogId : getInput(),
			defaultCatalogCheckbox : getCheckbox(),
			watermark : getInput(),
			getDefaultCatalogName : function (defaultCatalogId) {
				return "Scott";
			},
			getCatalogIds: function () {
				 //return $('li > input').map(function () { return this.value);});			
			},
			getCatalogId: function () {},
			sliderControls : {
				ul : getList(),
				items : [listItem],
				prev : getImage(),
				next : getImage()
			}
		};
		stamp = {
			identifiers : [
				{catalog : defaultCatalogId,  value : catalogNumber, wmk : watermark },
			],
			updateOrInsertIdentifier : func,
			displayProperties : [{name : 'defaultCatalogId', value: defaultCatalogId}],
			getCatalogIndex : function () {

				//console.log("getCatalogIndex called");
				//var catalogId, index;
				//catalogId = uicontrols.getCatalogId(); //$('li.active > input').val();//activateListItem(idx); //still used?
				//if (catalogId === undefined) {
				//return;
				//}
			}
		};
		sut = require('../modules/identifiers').identifiers(slider, common);
		sut.ready(controls, stamp);
    };
describe('indentifiers_module', function () {
	beforeEach(setup);
	describe('ready', function () {
		it("should get stamp catalog index", function () {
			var spy;
			spy = sinon.spy(stamp, 'getCatalogIndex');
			sut.ready(controls, stamp);
			stamp.getCatalogIndex.restore();
	
			sinon.assert.calledOnce(spy);
		});
		it("should get default stamp catalog id", function () {
			var spy;
			spy = sinon.spy(common, 'getPropertyValue');
			sut.ready(controls, stamp);
			common.getPropertyValue.restore();
	
			sinon.assert.calledWith(spy, stamp.displayProperties, 'defaultCatalogId');
		});
		it("should get current catalog id", function () {
			var spy;
			spy = sinon.spy(controls.currentCatalogId, 'val');
			sut.ready(controls, stamp);
			controls.currentCatalogId.val.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should get default catalog name", function () {
			var spy, defaultStub, defaultCatalogId;
			spy = sinon.spy(controls, 'getDefaultCatalogName');
			defaultCatalogId = "abcde";
			defaultStub = sinon.stub(common, 'getPropertyValue').returns(defaultCatalogId);
			sut.ready(controls, stamp);
			controls.getDefaultCatalogName.restore();
			common.getPropertyValue.restore();

			sinon.assert.calledWith(spy, defaultCatalogId);
		});
		it("should set default default catalog id checkbox title", function () {
			var spy, defaultStub, catlogNameStub, defaultCatalogId, title, defaultCatalogName;
			spy = sinon.spy(controls.defaultCatalogCheckbox, 'attr');
			defaultCatalogName = "Scott";
			defaultCatalogId = "abcde";
			title = 'The preferred catalog is ' +  defaultCatalogName;
			catlogNameStub = sinon.stub(controls, 'getDefaultCatalogName').returns(defaultCatalogName);
			defaultStub = sinon.stub(common, 'getPropertyValue').returns(defaultCatalogId);
			sut.ready(controls, stamp);
			controls.defaultCatalogCheckbox.attr.restore();
			common.getPropertyValue.restore();

			sinon.assert.calledWith(spy, 'title', title);
		});
		describe('when current catalog id equals default catalog id', function () {
			it("should check default catalog id checkbox", function () {
				var spy, defaultStub, currentStub, catalogId;
				catalogId = "abcde";
				defaultStub = sinon.stub(common, 'getPropertyValue').returns(catalogId);
				currentStub = sinon.stub(controls.currentCatalogId, 'val').returns(catalogId);
				spy = sinon.spy(controls.defaultCatalogCheckbox, 'attr');
				sut.ready(controls, stamp);
				controls.currentCatalogId.val.restore();
				controls.defaultCatalogCheckbox.attr.restore();
				common.getPropertyValue.restore();

				sinon.assert.calledWith(spy, 'checked', "checked");
			});
		});
		describe('when current catalog id does not equal default catalog id', function () {
			it("should uncheck default catalog id checkbox", function () {
				var spy, defaultStub, currentStub, defaultCatalogId, currentCatalogId;
				defaultCatalogId = "abcde";
				currentCatalogId = "fghij";
				defaultStub = sinon.stub(common, 'getPropertyValue').returns(defaultCatalogId);
				currentStub = sinon.stub(controls.currentCatalogId, 'val').returns(currentCatalogId);
				spy = sinon.spy(controls.defaultCatalogCheckbox, 'removeAttr');
				sut.ready(controls, stamp);
				controls.currentCatalogId.val.restore();
				controls.defaultCatalogCheckbox.removeAttr.restore();
				common.getPropertyValue.restore();

				sinon.assert.calledWith(spy, 'checked');
			});
		});
		describe('when index is not valid', function () {
			it("should clear catalog number", function () {
				var spy, stub;
				stub = sinon.stub(stamp, 'getCatalogIndex').returns(-1);
				spy = sinon.spy(controls.catalogNumber, 'val');
				sut.ready(controls, stamp);
				controls.catalogNumber.val.restore();
				stamp.getCatalogIndex.restore();

				sinon.assert.calledWith(spy, null);
			});	
			it("should clear catalog watermark", function () {
				var spy, stub;
				stub = sinon.stub(stamp, 'getCatalogIndex').returns(-1);
				spy = sinon.spy(controls.watermark, 'val');
				sut.ready(controls, stamp);
				controls.watermark.val.restore();
				stamp.getCatalogIndex.restore();

				sinon.assert.calledWith(spy, null);
			});		
		});
		describe('when index is valid', function () {
			it("should set catalog number to stamp catalog number", function () {
				var spy, stub, catalogNum;
				catalogNum = 42;
				stub = sinon.stub(stamp, 'getCatalogIndex').returns(1);
				stamp.identifiers.push({value : catalogNum})
				spy = sinon.spy(controls.catalogNumber, 'val');
				sut.ready(controls, stamp);
				controls.catalogNumber.val.restore();
				stamp.getCatalogIndex.restore();

				sinon.assert.calledWith(spy, catalogNum);
			});
			it("should set catalog watermark to stamp catalog watermark", function () {
				var spy, stub, wmk;
				wmk = "inverted crown";
				stub = sinon.stub(stamp, 'getCatalogIndex').returns(1);
				stamp.identifiers.push({wmk : wmk})
				spy = sinon.spy(controls.watermark, 'val');
				sut.ready(controls, stamp);
				controls.watermark.val.restore();
				stamp.getCatalogIndex.restore();

				sinon.assert.calledWith(spy, wmk);
			});
		});
	});
	describe('setDefaultCatalog', function () {
		it("should get currentCatalogId twice", function () {
			var spy;
			spy = sinon.spy(controls.currentCatalogId, 'val');
			sut.setDefaultCatalog(displayProperties);
			controls.currentCatalogId.val.restore();

			sinon.assert.calledTwice(spy);

		});
		it("should verify whether default catalog checkbox is checked", function () {
			var spy;
			spy = sinon.spy(controls.defaultCatalogCheckbox, 'is');
			sut.setDefaultCatalog(displayProperties);
			controls.defaultCatalogCheckbox.is.restore();

			sinon.assert.calledWith(spy, ':checked');
		});
		it("should not call common addOrReplaceProperty", function () {
			var spy, stub;
			spy = sinon.spy(common, 'addOrReplaceProperty');
			sut.setDefaultCatalog(displayProperties);
			common.addOrReplaceProperty.restore();

			sinon.assert.notCalled(spy);
		});
		describe('when default catalog checkbox is checked', function () {
			it("should call common addOrReplaceProperty", function () {
				var spy, stub;
				spy = sinon.spy(common, 'addOrReplaceProperty');
				stub = sinon.stub(controls.defaultCatalogCheckbox, 'is').returns(true);
				sut.setDefaultCatalog(displayProperties);
				common.addOrReplaceProperty.restore();
				controls.defaultCatalogCheckbox.is.restore();

				sinon.assert.calledOnce(spy);
			});
			it("should set currentCatalogId", function () {
				var spy, stub, value;
				value = 'foo';
				controls.currentCatalogId.val("foo");
				spy = sinon.spy(controls.currentCatalogId, 'val');
				stub = sinon.stub(controls.defaultCatalogCheckbox, 'is').returns(true);
				sut.setDefaultCatalog(displayProperties);
				controls.currentCatalogId.val.restore();
				controls.defaultCatalogCheckbox.is.restore();

				sinon.assert.calledWith(spy, value);
			});
		});
	});
	describe('addIdentifier', function () {
		it("should get catalog name control", function () {
			var spy;
			spy = sinon.spy(controls, 'getCatalogId');
			sut.addIdentifier();
			controls.getCatalogId.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should get catalog name", function () {
			var spy;
			spy = sinon.spy(controls.catalogName, 'text');
			sut.addIdentifier();
			controls.catalogName.text.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should get watermark", function () {
			var spy;
			spy = sinon.spy(controls.watermark, 'val');
			sut.addIdentifier();
			controls.watermark.val.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should get catalog number", function () {
			var spy;
			spy = sinon.spy(controls.catalogNumber, 'val');
			sut.addIdentifier();
			controls.catalogNumber.val.restore();

			sinon.assert.calledOnce(spy);
		});
		it("should call stamp updateOrInsertIdentifier", function () {
			var catalogNumber = '1425a',
				catalogId = '42',
				watermark = 'C 3',
				catalogName = 'Scott',
				identifier = {
					catalog : catalogId,
					name : catalogName,
					wmk : watermark,
					value : catalogNumber
				},
				spy = sinon.spy(stamp, 'updateOrInsertIdentifier'),
				catelogIdStub = sinon.stub(controls, 'getCatalogId').returns(catalogId),
				catalogNameStub = sinon.stub(controls.catalogName, 'text').returns(catalogName),
				watermarkStub = sinon.stub(controls.watermark, 'val').returns(watermark),
				catalogNumberStub = sinon.stub(controls.catalogNumber, 'val').returns(catalogNumber);
			sut.addIdentifier();

			stamp.updateOrInsertIdentifier.restore();
			controls.getCatalogId.restore();
			controls.catalogName.text.restore();
			controls.watermark.val.restore();
			controls.catalogNumber.val.restore();

			sinon.assert.calledWithMatch(spy, identifier);
		});
	});
	describe('setCatalogToDefault', function () {
		it("should check if slider is empty", function () {
			var spy = sinon.spy(slider, 'isEmpty'),
				stub = sinon.stub(controls, 'getCatalogIds').returns($([]));
			sut.setCatalogToDefault();
			slider.isEmpty.restore();
			controls.getCatalogIds.restore();

			sinon.assert.calledOnce(spy);
		});
		describe('when there are no catalogs', function () {
			beforeEach(function () {
				controls.sliderControls.items = [];
				slider.ready(controls.sliderControls, func);
			});
			it("should disable default catalog checkbox", function () {
				var spy;
				spy = sinon.spy(controls.defaultCatalogCheckbox, 'attr');
				sut.setCatalogToDefault();
				controls.defaultCatalogCheckbox.attr.restore();

				sinon.assert.calledWith(spy, 'disabled', 'disabled');
			});
			it("should uncheck catalog checkbox", function () {
				var spy;
				spy = sinon.spy(controls.defaultCatalogCheckbox, 'removeAttr');
				sut.setCatalogToDefault();
				controls.defaultCatalogCheckbox.removeAttr.restore();

				sinon.assert.calledWith(spy, 'checked');
			});
		});
		describe('when there are catalogs', function () {
			beforeEach(function () {
				var input, listItem,
				stub = sinon.stub(controls, 'getCatalogIds').returns($([]));
				input = getInput();
				listItem = slider.getActiveItem();
				input.val(defaultCatalogId);
				listItem.append(input);
			});
			it("should store the id of the default catalog", function () {
				var actual, expected;
				expected = defaultCatalogId;
				sut.setCatalogToDefault();
				actual = controls.currentCatalogId.val();
				assert.strictEqual(actual, expected);
			});
			it("should move slider to default catalog", function () {
				var spy;
				spy = sinon.spy(slider, 'navigateTo');
				sut.setCatalogToDefault();
				slider.navigateTo.restore();

				sinon.assert.calledWith(spy, 0);
			});
		});
    });
});