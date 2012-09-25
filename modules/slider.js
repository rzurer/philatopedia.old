"use strict";
exports.slider = function (slider, goToCallback) {
	var currentindex = 0,
		prev = slider.previousSibling,
		next = slider.nextSibling,
		ul = slider.children[0],
		listItems = ul.children,
		goTo =  function (index) {
			if (index < 0 || index > listItems.length - 1) {
				return;
			}
			ul.style.left = '-' + (100 * index) + '%';
			currentindex = index;
			goToCallback(listItems);
			if (currentindex === listItems.length - 1) {
				next.style.opacity = '0.3';
				next.disabled = 'disabled';
			}
			if (currentindex < listItems.length - 1 && currentindex > 0) {
				next.style.opacity = '1.0';
				next.removeAttribute('disabled');
				prev.style.opacity = '1.0';
				prev.removeAttribute('disabled');
			}
			if (currentindex === 0) {
				prev.style.opacity = '0.3';
				prev.disabled = 'disabled';
			}
		};
	if (listItems.length > 0) {
		ul.style.width = (listItems[0].clientWidth * listItems.length) + 'px';
	}
	return {
		goToListItem : function (index, callback) {
			if (index < 0 || index > listItems.length - 1) {
				return;
			}
			ul.style.left = '-' + (100 * index) + '%';
			listItems.removeClass('active');
			listItems.get(index).addClass('active');
			if (callback) {
				callback();
			}
		},
		getCurrentIndex : function () {
			return currentindex;
		},
		goToPrev: function () {
			goTo(currentindex - 1);
		},
		goToNext: function () {
			goTo(currentindex + 1);
		}
	};
};



