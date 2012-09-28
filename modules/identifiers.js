/*globals $*/
"use strict";
exports.identifiers = function (slider, stamp, cataloglistings, propertyManager) {
	var uicontrols;
	return {
		setCatalogNumber : function (value) {
			uicontrols.catalognumber.val(value);
		},
		setWatermark : function (wmk) {
			uicontrols.wmk.val(wmk);
		},
		getCatalogId : function () {
			return uicontrols.getActiveCatalogId().val();
		},
		getCatalogIds : function () {
			var result = [];
			uicontrols.getCatalogIds().each(function () {
				result.push(this.value);
			});
			return result;
		},
		getCatalogName : function () {
			return uicontrols.getActiveCatalogName().text();
		},
		setCurrentCatalogId : function (value) {
			uicontrols.currentCatalogId.val(value);
		},
		getCurrentCatalogId : function () {
			return uicontrols.currentCatalogId.val();
		},
		enableDisableDefaultCatalog : function (enabled) {
			if (enabled) {
				uicontrols.defaultcatalog.removeAttr('disabled');
				return;
			}
			uicontrols.defaultcatalog.attr('disabled', 'disabled');
		},
		checkUncheckDefaultCatalog : function (checked) {
			if (checked) {
				uicontrols.defaultcatalog.attr('checked', 'checked');
				return;
			}
			uicontrols.defaultcatalog.removeAttr('checked');
		},
		defaultCatalogIsChecked : function () {
			return uicontrols.defaultcatalog.is(':checked');
		},
		setDefaultCatalogTitle : function (title) {
			uicontrols.defaultcatalog.attr('title', title);
		},
		getListItems : function () {
			return slider.children('li');
		},
		goToListItem : function (listItems, index) {
			if (index < 0 || index > listItems.length - 1) {
				return;
			}
			slider.ul.style.left = '-' + (100 * index) + '%';
			this.setCatalogValue();
			this.setDefaultCatalogCheckbox();
		},
		setCatalogValue : function () {
			var idx, value, wmk;
			idx = this.getIndexOfCatalog(this.getCatalogId());
			if (idx === -1) {
				this.setCatalogNumber(null);
				this.setWatermark(null);
				this.setCurrentCatalogId(this.getCatalogId());
				return;
			}
			value = stamp.identifiers[idx].value;
			wmk = stamp.identifiers[idx].wmk;
			this.setCatalogNumber(value);
			this.setWatermark(wmk);
			this.setCurrentCatalogId(this.getCatalogId());
		},
		setDefaultCatalogCheckbox : function () {
			var  defaultCatalogId, currentCatalogId, catalogName, input;
			defaultCatalogId = this.getDefaultCatalogId();
			currentCatalogId = this.getCurrentCatalogId();
			this.checkUncheckDefaultCatalog(defaultCatalogId === currentCatalogId);
			input = $('#catalogSlider > li > input[value="' + defaultCatalogId + '"]');
			catalogName = input.next('label').text();
			this.setDefaultCatalogTitle('The preferred catalog is ' + catalogName);
		},
		getDefaultCatalogIndex : function () {
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
		},
		getDefaultCatalogId : function () {
			return propertyManager.getPropertyValue(stamp.displayProperties, 'defaultcatalog');
		},
		getIndexOfCatalog : function (catalog) {
			var catalogs, index;
			catalogs = stamp.identifiers.map(function (item) {
				return item.catalog;
			});
			index = catalogs.indexOf(catalog);
			return index;
		},
		gotoCallback : function (listItems, that) {
			var idx;
			idx = that.slider.getCurrentIndex();
			that.activateListItem(idx);
			that.setCatalogValue();
			that.setDefaultCatalogCheckbox();
		},
		setCatalogToDefault : function () {
			var idx, identifier;
			if (cataloglistings.length === 0) {
				this.enableDisableDefaultCatalog(false);
				this.checkUncheckDefaultCatalog(false);
				return;
			}
			idx = this.getDefaultCatalogIndex();
			if (stamp.identifiers.length > 0) {
				identifier = stamp.identifiers[idx];
				if (identifier) {
					this.setCurrentCatalogId(identifier.catalog);
				}
				this.goToListItem(slider, this.getListItems(), idx);
			}
			slider.goTo(idx);
		},
		addIdentifier : function (value, wmk) {
			var idx, name;
			name = this.getCatalogName();
			idx = this.getIndexOfCatalog(this.getCatalogId());
			if (idx === -1) {
				stamp.identifiers.push({
					catalog: this.getCatalogId(),
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
			value = this.getCurrentCatalogId();
			if (this.defaultCatalogIsChecked()) {
				propertyManager.addOrReplaceProperty(array, propertyname, value);
				this.setCurrentCatalogId(value);
				return;
			}
			propertyManager.removeProperty(array, propertyname);
			this.setCurrentCatalogId(value);
			this.conditionalSave();
		}
	};
};