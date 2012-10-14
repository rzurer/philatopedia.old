/*globals $*/
"use strict";
exports.identifiers = function (slider, common) {
	var uicontrols,
		stamp,
		defaultCatalogIdPropertyName = 'defaultcatalog',
		setCatalogNumber = function (catalogNumber) {
			uicontrols.catalogNumber.val(catalogNumber);
		},
		setWatermark = function (watermark) {
			uicontrols.watermark.val(watermark);
		},
		setCurrentCatalogId = function (value) {
			uicontrols.currentCatalogId.val(value);
		},
		getDefaultCatalogId = function () {
			return common.getPropertyValue(stamp.displayProperties, defaultCatalogIdPropertyName);
		},
		enableDisableDefaultCatalogCheckbox = function (enabled) {
			if (enabled) {
				uicontrols.defaultCatalogCheckbox.removeAttr('disabled');
				return;
			}
			uicontrols.defaultCatalogCheckbox.attr('disabled', 'disabled');
		},
		checkUncheckDefaultCatalogCheckbox = function (checked) {
			if (checked) {
				uicontrols.defaultCatalogCheckbox.attr('checked', 'checked');
				return;
			}
			uicontrols.defaultCatalogCheckbox.removeAttr('checked');
		},
		setCatalogValues = function () {
			var identifiers = stamp.getCurrentIdentifiers();
			setCatalogNumber(identifiers.value);
			setWatermark(identifiers.wmk);
			setCurrentCatalogId(identifiers.catalog);
		},
		setDefaultCatalogCheckbox = function (listItems) {
			var defaultCatalogName, input, defaultCatalogId, currentCatalogId, title;
			defaultCatalogId = getDefaultCatalogId();
			currentCatalogId = uicontrols.currentCatalogId.val();
			checkUncheckDefaultCatalogCheckbox(defaultCatalogId === currentCatalogId);
			defaultCatalogName = uicontrols.getDefaultCatalogName(defaultCatalogId);
			title = 'The preferred catalog is ' + defaultCatalogName;
			uicontrols.defaultCatalogCheckbox.attr('title', title);
		},
		getDefaultCatalogIndex = function () {
			var defaultCatalogId, catalogIds;
			catalogIds = uicontrols.getCatalogIds();
			defaultCatalogId = getDefaultCatalogId();
			catalogIds.each(function (index, element) {
				if (element === defaultCatalogId) {
					return index;
				}
			});
			return 0;
		},
		onNavigate = function (listItem) {
			setCatalogValues();
			setDefaultCatalogCheckbox();
		};
	return {
		ready : function (controls, source, callback) {
			uicontrols = controls;
			stamp = source;
			uicontrols.defaultCatalogCheckbox.change(this.setDefaultCatalog);
			slider.ready(controls.sliderControls, function () {
				if (callback) {
					callback();
				}
				onNavigate();
			});
		},
		setCatalogToDefault : function () {
			var index, identifier;
			if (slider.isEmpty()) {
				enableDisableDefaultCatalogCheckbox(false);
				checkUncheckDefaultCatalogCheckbox(false);
				return;
			}
			index = getDefaultCatalogIndex();
			if (stamp.identifiers.length > 0) {
				identifier = stamp.identifiers[index];
				if (identifier) {
					setCurrentCatalogId(identifier.catalog);
				}
			}
			slider.navigateTo(index);
		},
		addIdentifier : function (value, wmk) {
			var identifier = {
					catalog: uicontrols.getCatalogId(),
					name: uicontrols.getCatalogName().text(),
					wmk: uicontrols.watermark.val(),
					value: uicontrols.catalogNumber.val()
				};
			stamp.updateOrInsertIdentifier(identifier);
		},
		setDefaultCatalog : function (displayProperties) {
			var currentCatalogId;
			currentCatalogId = uicontrols.currentCatalogId.val();
			if (uicontrols.defaultCatalogCheckbox.is(':checked')) {
				common.addOrReplaceProperty(displayProperties, defaultCatalogIdPropertyName, currentCatalogId);
				setCurrentCatalogId(currentCatalogId);
				return;
			}
			common.removeProperty(displayProperties, defaultCatalogIdPropertyName);
			setCurrentCatalogId(currentCatalogId);
		}
	};
};