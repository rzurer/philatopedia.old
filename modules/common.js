"use strict";
var storage;
exports.Common = {
	initialize : function (localStorage) {
		storage = localStorage;
	},
	trim : function (source) {
		if (!source || !source.length || source.length === 0) {
			return source;
		}
		return source.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	},
	inspect : function (obj, silent) {
		var property, text = '';
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
		return this.getObjectInfo(obj).length;
	},
	propertiesExist: function (obj) {
		var prop;
		if (!obj) {
			return false;
		}
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return true;
			}
		}
		return false;
	},
	showToaster : function (parent, toaster, text, callback) {
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
			this.placeInLocalStorage(name, createFunction());
		}
		return this.getFromLocalStorage(name);
	}
};
