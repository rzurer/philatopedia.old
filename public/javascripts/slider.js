var Slider = function() {
	this.initialize.apply(this, arguments);
};
Slider.prototype = {
	initialize: function(slider) {
		this.currentindex = 0;
		this.prev = slider.previousSibling;
		this.next = slider.nextSibling;
		this.ul = slider.children[0];
		this.li = this.ul.children;
		if (this.li.length > 0) {
			this.ul.style.width = (this.li[0].clientWidth * this.li.length) + 'px';
		}
	},
	setIdentifiers : function (identifiers){
		this.identifiers = identifiers;
		this.gotoCallback = identifiers.gotoCallback;
	},
	getCurrentIndex : function() {
		return this.currentindex;
	},
	goTo: function(index) {
		if (index < 0 || index > this.li.length - 1) {
			return;
		}
		this.ul.style.left = '-' + (100 * index) + '%';
		this.currentindex = index;
		this.gotoCallback(this.li, this.identifiers);
		if(this.currentindex === this.li.length - 1){
			this.next.style.opacity= '0.3';
			this.next.disabled ='disabled';
		}
		if(this.currentindex < this.li.length - 1 && this.currentindex > 0){
			this.next.style.opacity= '1.0';
			this.next.removeAttribute('disabled');
			this.prev.style.opacity= '1.0';
			this.prev.removeAttribute('disabled');
		}
		if(this.currentindex === 0){
			this.prev.style.opacity= '0.3';
			this.prev.disabled ='disabled';
		}
	},
	goToPrev: function() {
		this.goTo(this.currentindex - 1);
	},
	goToNext: function() {
		this.goTo(this.currentindex + 1);
	}
}