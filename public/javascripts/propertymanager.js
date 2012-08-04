'use strict';
var PropertyManager = {
	getPropertyValue: function (array, propertyName) {
		var value;
		array.forEach(function (element, index) {
			if (element.name === propertyName) {
				value = element.value;
			}
		});
		return value;
	},
	removeProperty: function (array, propertyName) {
		array.forEach(function (element, index) {
			if (element.name === propertyName) {
				array = array.splice(index, 1);
			}
		});
	},
	addOrReplaceProperty: function (array, propertyName, value) {
		var index;
		index = -1;
		if (array.length === 0) {
			array.push({
				name: propertyName,
				value: value
			});
			return;
		}
		array.forEach(function (element, idx) {
			if (element.name === propertyName) {
				index = idx;
			}
		});
		if (index >= 0) {
			array[index].value = value;
			return;
		}
		array.push({
			name: propertyName,
			value: value
		});
	}
};
