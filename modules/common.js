"use strict";
exports.common = function (storage) {
	var result;
	result = {
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
		},
		disableControls : function (controls, opacity) {
			controls.forEach(function (control) {
				control.unbind("click");
				control.css('opacity', opacity || '0.3');
			});
		},
		enableControl : function (control, clickCallback, opacity) {
			control.click(clickCallback);
			control.css('opacity', opacity || '1.0');
		},
		getStorage : function () {
			return storage;
		},
		setStorage : function (value) {
			storage = value;
		},
		trim : function (source) {
			if (!source || !source.length || source.length === 0) {
				return source;
			}
			return source.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		},
		findFirst : function (array, propertyname, value) {
			var i, element;
			for (i = 0; i < array.length; i += 1) {
				element = array[i];
				if (array[i][propertyname] === value) {
					return element;
				}
			}
		},
		getObjectInfo: function (obj) {
			var prop, result = [];
			if (!obj) {
				return result;
			}
			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					result.push({name : prop, value : obj[prop]});
				}
			}
			return result;
		},
		getPropertyCount: function (obj) {
			return result.getObjectInfo(obj).length;
		},
		propertiesExist: function (obj) {
			return result.getPropertyCount(obj) > 0;
		},
		showToaster : function (parent, toaster, text, callback) { //tested
			var left, top, width;
			top = parent.offset().top;
			left = parent.offset().left;
			width = parent.width();
			toaster.addClass('toaster');
			toaster.css('left', left);
			toaster.css('top', top);
			toaster.css('width', width);
			toaster.text(text);
			toaster.show();
			toaster.delay(1000).hide('slow');
			if (callback) {
				callback();
			}
		},
		removeLocalStorageKey : function (name) {
			storage.removeItem(name);
		},
		placeInLocalStorage : function (name, value) {
			storage[name] = JSON.stringify(value);
		},
		getFromLocalStorage : function (name) {
			var value;
			value = storage[name];
			try {
				return JSON.parse(value);
			} catch (ex) {
				return value;
			}
		},
		getFromOrPlaceInLocalStorage : function (name, createFunction) {
			if (!storage[name]) {
				result.placeInLocalStorage(name, createFunction());
			}
			return result.getFromLocalStorage(name);
		},
		scrutinize : function (obj, silent) {
			var property, text;
			text = '';
			for (property in obj) {
				if (obj.hasOwnProperty(property)) {
					text += property + '=' + obj[property] + "\r\n";
				}
			}
			if (!silent) {
				console.log(text);
			}
			return text;
		},

	};
	return result;
};