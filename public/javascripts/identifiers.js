'use strict';
/*node browser:true*/
/*global $*/
var Identifiers = function () {
		this.initialize.apply(this, arguments);
	};

Identifiers.prototype = {
	initialize: function (propertyManager, stamp, slider, cataloglistings) {
		this.propertyManager = propertyManager;
		this.stamp = stamp;
		this.slider = slider;
		this.slider.setIdentifiers(this);
		this.cataloglistings = cataloglistings;
		this.setCatalogNumber = function (value) {
			$('#catalognumber').val(value);
		};
		this.setWatermark = function (wmk) {
			$('#wmk').val(wmk);
		};
		this.getCatalogId = function () {
			return $('li.active > input').val();
		};
		this.getCatalogIds = function () {
			var result = [];
			$('li > input').each(function () {
				result.push(this.value);
			});
			return result;
		};
		this.getCatalogName = function () {
			return $('li.active > label').text();
		};
		this.setCurrentCatalogId = function (value) {
			$('#currentCatalogId').val(value);
		};
		this.getCurrentCatalogId = function () {
			return $('#currentCatalogId').val();
		};
		this.enableDisableDefaultCatalog = function (enabled) {
			if (enabled) {
				$('#defaultcatalog').removeAttr('disabled');
				return;
			}
			$('#defaultcatalog').attr('disabled', 'disabled');
		};
		this.checkUncheckDefaultCatalog = function (checked) {
			if (checked) {
				$('#defaultcatalog').attr('checked', 'checked');
				return;
			}
			$('#defaultcatalog').removeAttr('checked');
		};
		this.defaultCatalogIsChecked = function () {
			return $('#defaultcatalog').is(':checked');
		};
		this.setDefaultCatalogTitle = function (title) {
			$('#defaultcatalog').attr('title', title);
		};
		this.getSlider = function () {
			return $('#catalogSlider').get(0);
		};
		this.getListItems = function () {
			return $('#catalogSlider').children('li');
		};
		this.activateListItem = function (index) {
			this.getListItems().removeClass('active');
			$(this.getListItems().get(index)).addClass('active');
		};
		this.goToListItem = function (listItems, index) {
			if (index < 0 || index > listItems.length - 1) {
				return;
			}
			this.slider.ul.style.left = '-' + (100 * index) + '%';
			this.activateListItem(index);
			this.setCatalogValue();
			this.setDefaultCatalogCheckbox();
		};
		this.setCatalogValue = function () {
			var idx, value, wmk
			idx = this.getIndexOfCatalog(this.getCatalogId());
			if (idx === -1) {
				this.setCatalogNumber(null);
				this.setWatermark(null);
				this.setCurrentCatalogId(this.getCatalogId());
				return;
			}
			value = this.stamp.identifiers[idx].value;
			wmk = this.stamp.identifiers[idx].wmk;			
			this.setCatalogNumber(value);
			this.setWatermark(wmk);
			this.setCurrentCatalogId(this.getCatalogId());
		};
		this.setDefaultCatalogCheckbox = function () {
			var  defaultCatalogId, currentCatalogId, catalogName, input;
			defaultCatalogId = this.getDefaultCatalogId();
			currentCatalogId = this.getCurrentCatalogId();
			this.checkUncheckDefaultCatalog(defaultCatalogId === currentCatalogId);
			input = $('#catalogSlider > li > input[value="' + defaultCatalogId + '"]');
			catalogName = input.next('label').text();
			this.setDefaultCatalogTitle('The preferred catalog is ' + catalogName);
		};
		this.getDefaultCatalogIndex = function () {
			var result, defaultCatalogId, catalogIds;
			result = 0;
			catalogIds = this.getCatalogIds();
			defaultCatalogId = this.getDefaultCatalogId();
			catalogIds.forEach(function (element, idx) {
				if (element === defaultCatalogId) {
					result = idx;
				}
			});
			return result;
		};
		this.getDefaultCatalogId = function () {
			return this.propertyManager.getPropertyValue(this.stamp.displayProperties, 'defaultcatalog');
		};
		this.getIndexOfCatalog = function (catalog) {
			var catalogs, index;
			catalogs = this.stamp.identifiers.map(function (item) {
				return item.catalog;
			});
			index = catalogs.indexOf(catalog);
			return index;
		};
	},
	gotoCallback: function (listItems, that) {
		var idx;
		idx = that.slider.getCurrentIndex();
		that.activateListItem(idx);
		that.setCatalogValue();
		that.setDefaultCatalogCheckbox();
	},
	setCatalogToDefault: function () {
		var idx;
		if (this.cataloglistings.length === 0) {
			this.enableDisableDefaultCatalog(false);
			this.checkUncheckDefaultCatalog(false);
			return;
		}
		idx = this.getDefaultCatalogIndex();
		if (this.stamp.identifiers.length > 0) {
			var identifier = this.stamp.identifiers[idx];
			if(identifier){
				this.setCurrentCatalogId(identifier.catalog);
			}
			this.goToListItem(this.slider, this.getListItems(), idx);
		}
		this.slider.goTo(idx);
	},
	addIdentifier: function (value, wmk) {
		var idx, name;
		name = this.getCatalogName();
		idx = this.getIndexOfCatalog(this.getCatalogId());
		if (idx === -1) {
			this.stamp.identifiers.push({
				catalog: this.getCatalogId(),
				name: name,
				wmk: wmk,
				value: value
			});
			return;
		}
		this.stamp.identifiers[idx].value = value;
		this.stamp.identifiers[idx].wmk = wmk;
	},
	setDefaultCatalog : function () {
		var array, propertyname, value;
		array = this.stamp.displayProperties;
		propertyname = 'defaultcatalog';
		value = this.getCurrentCatalogId();
		if (this.defaultCatalogIsChecked()) {
			this.propertyManager.addOrReplaceProperty(array, propertyname, value);
			this.setCurrentCatalogId(value);
			return;
		}
		this.propertyManager.removeProperty(array, propertyname);
		this.setCurrentCatalogId(value);
		this.conditionalSave();
	}
};