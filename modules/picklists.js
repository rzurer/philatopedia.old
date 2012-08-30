"use strict";
exports.picklists = function (common, router) {
	var focusEvent = function (target, minLength) {
			if (minLength === 0) {
				if (!target || target.val() === '') {
					target.autocomplete("search");
				}
			}
		},
		setNormalBorderAndCallback = function (target, callback) {
			target.css('border', 'solid 1px #E5E5E5');
			if (callback) {
				callback(target);
			}
		},
		setErrorBorderAndFocus = function (target) {
			target.focus();
			target.css('border', '2px solid red');
		},
		blurEvent = function (target, array, callback) {
			var verifyInList = function () {
				if (!array || array.length === 0 || common.trim(target.val()).length === 0) {
					setNormalBorderAndCallback(target, callback);
					return;
				}
				if (array.indexOf(target.val()) === -1) {
					setErrorBorderAndFocus(target);
				} else {
					setNormalBorderAndCallback(target, callback);
				}
			};
			verifyInList(target, array, callback);
		},
		setAutocomplete = function (target, minLength, array, callback, skipVerify) {
			target.autocomplete({
				source: array,
				minLength: minLength
			});
			target.focus(function () {
				focusEvent(target, minLength);
			});
			if (!skipVerify) {
				target.blur(function () {
					blurEvent(target, array, callback);
				});
			} else {
				if (callback) {
					callback(target);
				}
			}
		};
	return {
		initialize : function (PicklistsRouter, Common) {
			router = PicklistsRouter;
			common = Common;
		},
		getTagsAndCollections : function (callback) {
			var obj = {};
			if (callback) {
				router.getDistinctTags(function (data) {
					obj.tags = data.tags;
					router.getDistinctCollections(function (data) {
						obj.collections = data.collections;
						callback(obj);
					});
				});
			}
		},
		getTags : function (callback) {
			router.getDistinctTags(function (data) {
				callback(data.tags);
			});
		},
		getCollections : function (callback) {
			router.getDistinctCollections(function (data) {
				callback(data.collections);
			});
		},
		getCountryNames : function () {
			return common.getFromOrPlaceInLocalStorage('countryNames', router.getAllCountryNames);
		},
		setTagsAutocomplete : function (target, skipVerify) {
			this.getTags(function (tags) {
				setAutocomplete(target, 0, tags, null, skipVerify);
			});
		},
		setCollectionsAutocomplete : function (target, skipVerify) {
			this.getCollections(function (collections) {
				setAutocomplete(target, 0, collections, null, skipVerify);
			});
		},
		setCountriesAutocomplete : function (target, skipVerify, callback) {
			var arr, countries;
			countries = this.getCountryNames();
			arr = [];
			if (countries) {
				countries.forEach(function (country) {
					arr.push(country.replace("&amp;", "&"));
				});
			}
			setAutocomplete(target, 2, arr, callback, skipVerify);
		}
	};
};