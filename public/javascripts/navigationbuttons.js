'use strict';
var NavigationButtons = function () {
		this.initialize.apply(this, arguments);
	};
NavigationButtons.prototype = {
	initialize : function (first, previous, next, last, remove) {
		this.first = first;
		this.previous = previous;
		this.next = next;
		this.last = last;
		this.remove = remove;
		this.disable = function (buttons) {
			buttons.forEach(function (element) {
				element.css('opacity', '0.5');
				element.attr('disabled', 'disabled');
			});
		};
		this.enable = function (buttons) {
			buttons.forEach(function (element) {
				element.css('opacity', '1.0');
				element.removeAttr('disabled');
			});
		};
	},
	enableDisableButtons : function (length, index) {
		if (length === 0) {
			this.disable([this.first, this.previous, this.next, this.last, this.remove]);
			return;
		}
		if (length === 1) {
			this.disable([this.first, this.previous, this.next, this.last]);
			this.enable([this.remove]);
			return;
		}
		if (length === 2) {
			if (index === 0) {
				this.disable([this.first, this.previous, this.last]);
				this.enable([this.next, this.remove]);
				return;
			}
			if (index === 1) {
				this.disable([this.first, this.next, this.last]);
				this.enable([this.previous, this.remove]);
				return;
			}
		}
		if (length > 2) {
			this.enable([this.first, this.previous, this.next, this.last, this.remove]);
			if (index === 0) {
				this.disable([this.first, this.previous]);
				return;
			}
			if (index === length - 1) {
				this.disable([this.next, this.last]);
				return;
			}
		}
	}
};
