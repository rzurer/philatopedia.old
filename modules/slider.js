"use strict";
exports.slider = function (common) {
	var list, items, prev, next, currentindex, goToCallback,
		initializeControls = function (controls) {
			list = controls.ul;
			items = controls.items;
			prev = controls.prev;
			next = controls.next;
		},
		getItemCount = function () {
			return items ? items.length : 0;
		},
		getItemClientWidth = function () {
			return getItemCount() === 0 ? 0 : items[0].clientWidth;
		},
		goToItem = function () {
			list.css('left', '-' + (100 * currentindex) + '%');
		},
		setListWidth = function () {
			var width =  (getItemClientWidth() * getItemCount()) + 'px';
			list.css('width', width);
		},
		goTo = function () {
			var goToPrev = function () {
					currentindex -= 1;
					goTo();
				},
				goToNext = function () {
					currentindex += 1;
					goTo();
				};
			common.disableControls([prev, next]);
			if (currentindex === getItemCount() - 1) {
				common.enableControl(prev, goToPrev);
			}
			if (currentindex < getItemCount() - 1 && currentindex > 0) {
				common.enableControl(next, goToNext);
				common.enableControl(prev, goToPrev);
			}
			if (currentindex === 0) {
				common.enableControl(next, goToNext);
			}
			goToItem();
			if (goToCallback) {
				goToCallback();
			}
		},
		result = {
			ready : function (controls, callback) {
				initializeControls(controls);
				goToCallback = callback;
				currentindex = 0;
				setListWidth();
				goTo();
			},
			getCurrentIndex : function () {
				return currentindex;
			},
			isEmpty : function () {
				return !items || items.length === 0;
			},
			navigateTo : function (index) {
				currentindex = index;
				goTo();
			}
		};
	return result;
};