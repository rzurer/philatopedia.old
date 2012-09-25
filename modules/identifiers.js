/*globals $*/
"use strict";
exports.identifiers = function (common, stamp, slider, cataloglistings) {
	var uicontrols,
		setCatalogNumber = function (value) {
			uicontrols.catalognumber.val(value);
		},
		setWatermark = function (wmk) {
			uicontrols.wmk.val(wmk);
		},
		getCatalogId = function () {
			return uicontrols.getActiveCatalogId().val();
		},
		getCatalogIds = function () {
			var result = [];
			uicontrols.getCatalogIds().each(function () {
				result.push(value);
			});
			return result;
		},
		getCatalogName = function () {
			return uicontrols.getActiveCatalogName().text();
		};
		setCurrentCatalogId = function (value) {
			uicontrols.currentCatalogId.val(value);
		};
		getCurrentCatalogId = function () {
			return uicontrols.currentCatalogId..val();
		};
		enableDisableDefaultCatalog = function (enabled) {
			if (enabled) {
				uicontrols.defaultcatalog.removeAttr('disabled');
				return;
			}
			uicontrols.defaultcatalog.attr('disabled', 'disabled');
		};
		checkUncheckDefaultCatalog = function (checked) {
			if (checked) {
				uicontrols.defaultcatalog.attr('checked', 'checked');
				return;
			}
			uicontrols.defaultcatalog.removeAttr('checked');
		};
		defaultCatalogIsChecked = function () {
			return uicontrols.defaultcatalog.is(':checked');
		};
		setDefaultCatalogTitle = function (title) {
			uicontrols.defaultcatalog.attr('title', title);
		};
		getListItems = function () {
			return slider.children('li');
		};
		activateListItem = function (index) {
			getListItems().removeClass('active');
			$(getListItems().get(index)).addClass('active');
		};
		goToListItem = function (listItems, index) {
			if (index < 0 || index > listItems.length - 1) {
				return;
			}
			slider.ul.style.left = '-' + (100 * index) + '%';
			activateListItem(index);
			setCatalogValue();
			setDefaultCatalogCheckbox();
		};
		setCatalogValue = function () {
			var idx, value, wmk
			idx = getIndexOfCatalog(getCatalogId());
			if (idx === -1) {
				setCatalogNumber(null);
				setWatermark(null);
				setCurrentCatalogId(getCatalogId());
				return;
			}
			value = stamp.identifiers[idx].value;
			wmk = stamp.identifiers[idx].wmk;			
			setCatalogNumber(value);
			setWatermark(wmk);
			setCurrentCatalogId(getCatalogId());
		};
		setDefaultCatalogCheckbox = function () {
			var  defaultCatalogId, currentCatalogId, catalogName, input;
			defaultCatalogId = getDefaultCatalogId();
			currentCatalogId = getCurrentCatalogId();
			checkUncheckDefaultCatalog(defaultCatalogId === currentCatalogId);
			input = $('#catalogSlider > li > input[value="' + defaultCatalogId + '"]');
			catalogName = input.next('label').text();
			setDefaultCatalogTitle('The preferred catalog is ' + catalogName);
		};
		getDefaultCatalogIndex = function () {
			var result, defaultCatalogId, catalogIds;
			result = 0;
			catalogIds = getCatalogIds();
			defaultCatalogId = getDefaultCatalogId();
			catalogIds.forEach(function (element, idx) {
				if (element === defaultCatalogId) {
					result = idx;
				}
			});
			return result;
		};
		getDefaultCatalogId = function () {
			return propertyManager.getPropertyValue(stamp.displayProperties, 'defaultcatalog');
		};
		getIndexOfCatalog = function (catalog) {
			var catalogs, index;
			catalogs = stamp.identifiers.map(function (item) {
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
		if (cataloglistings.length === 0) {
			enableDisableDefaultCatalog(false);
			checkUncheckDefaultCatalog(false);
			return;
		}
		idx = getDefaultCatalogIndex();
		if (stamp.identifiers.length > 0) {
			var identifier = stamp.identifiers[idx];
			if(identifier){
				setCurrentCatalogId(identifier.catalog);
			}
			goToListItem(slider, getListItems(), idx);
		}
		slider.goTo(idx);
	},
	addIdentifier: function (value, wmk) {
		var idx, name;
		name = getCatalogName();
		idx = getIndexOfCatalog(getCatalogId());
		if (idx === -1) {
			stamp.identifiers.push({
				catalog: getCatalogId(),
				name: name,
				wmk: wmk,
				value: value
			});
			return;
		}
		stamp.identifiers[idx].value = value;
		stamp.identifiers[idx].wmk = wmk;
	},
	setDefaultCatalog : function () {
		var array, propertyname, value;
		array = stamp.displayProperties;
		propertyname = 'defaultcatalog';
		value = getCurrentCatalogId();
		if (defaultCatalogIsChecked()) {
			propertyManager.addOrReplaceProperty(array, propertyname, value);
			setCurrentCatalogId(value);
			return;
		}
		propertyManager.removeProperty(array, propertyname);
		setCurrentCatalogId(value);
		conditionalSave();
	}
};