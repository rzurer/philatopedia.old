var picklists = {
	categories: ["Definitive", "Commemorative", "Airmail", "Semipostal", "Revenue"],	
	conditions: ["Mint", "Unused", "Used", "On Cover"],
	centerings: ["S", "XF", "VF", "F/VF", "F", "Avg", "Poor"],
	gumstates: ["OG", "RG", "NG", "NH", "LH", "HH"],
	printingmethods: ["letterpress", "offset", "lithography", "photogravure", "engraved", "embossing"], 
	papers: ["wove", "laid", "silk", "chalky", "bluish", "granite", "pelure", "phosphor", "quadrille", "art", "batonné", "cardboard", "colored", "duplex", "enameled", "glazed", "native", "ribbed", "security", "silkote", "taggant", "toned"],
	verifyInList: function(obj, arr, callback) {
		if(!arr || obj.value.length === 0) {
			$(obj).css('border', 'solid 1px #E5E5E5');
			if (callback) {
				callback(obj);
			}
			return;
		}
		if (arr.indexOf(obj.value) === -1) {
			$(obj).css('border', '2px solid red');
			$(obj).focus();
			return;
		} else {
			$(obj).css('border', 'solid 1px #E5E5E5');
			if (callback) {
				callback(obj);
			}
		}
	},
	setAutocomplete : function (target, minLength, array, callback, skipVerify) {
		target.autocomplete({
			source: array,
			minLength: minLength
		});
		target.focus(function(evt){
			if(minLength === 0){
				var element = target.get(0);
				if (!element || element.value === ''){
					$(element).autocomplete("search");
				}
			}	
		});
		if(!skipVerify) {
			var that = this;
			target.blur(function(evt){
				that.verifyInList(target.get(0), array, callback);
			});				
		} else {
			if (callback) {
				callback(target);
			}
		}
	
	},
	//countries
	getCountries : function(){
		return getFromOrPlaceInLocalStorage('countries', this.getAllCountryNames);
	},
	getAllCountryNames: function() {
		var countryNames = [];
		$.ajax({
			type: 'POST',
			url: '/getAllCountryNames',
			async: false,
			success: function(data) {
				countryNames = data;
			}
		});
		return countryNames;
	},
	verifyInCountries: function (callback) {
		var obj = $("#issuedBy").get(0);
	   	this.verifyInList(obj, this.getCountries(), callback);
	},		
	setCountriesAutocomplete : function (skipVerify, callback) {
		var target, arr, countries;
		target = $("#issuedBy");
		arr = [];
		countries = this.getCountries();
		countries.forEach(function(country){
			arr.push(country.replace("&amp;","&"));
		})
		this.setAutocomplete(target, 2, arr, callback, skipVerify);
	},
	//tags
	getDistinctTags: function(callback) {
		$.ajax({
			type: 'POST',
			url: '/getDistinctTags',
			async: false,
			success: function(data) {
				callback(data);
			}
		});
	},
	getTags: function() {
		var tags;
		this.getDistinctTags(function(data) {
			tags = data;
		})
		return tags;
	},
	setTagsAutocomplete: function(skipVerify) {
		var target;
		target = $("#tagsource");
		this.setAutocomplete(target, 0, this.getTags(), null, skipVerify);
	},
	//collections	
	getDistinctCollections: function(callback) {
		$.ajax({
			type: 'POST',
			url: '/getDistinctCollections',
			async: false,
			success: function(data) {
				callback(data);
			}
		});
	},
	getCollections: function() {
		var collections;
		this.getDistinctCollections(function(data) {
			collections = data;
		})
		return collections;
	},
	setCollectionsAutocomplete: function(skipVerify) {
		var target;
		target = $("#collectionsource");
		this.setAutocomplete(target, 0, this.getCollections(), null, skipVerify);
	},

	//categories	
	setCategoriesAutocomplete: function() {
		var target, arr;
		target = $("#categorysource");
		arr = this.categories;
		this.setAutocomplete(target, 0, arr);
	},


	//issueYears
	getIssueYears : function(){
		return getFromOrPlaceInLocalStorage('issueyears', this.createIssueYears);
	},
	createIssueYears: function() {
		var issueyears = [];
		var currentYear = new Date().getFullYear();
		for (var i = 1840; i <= currentYear; i += 1) {
			issueyears.push(i.toString());
		};
		return issueyears;
	},
	verifyInIssueYears: function (callback) {
		var obj = $("#issueYear").get(0);
	   	this.verifyInList(obj, this.getIssueYears(), callback);
	},
	setIssueYearAutocomplete: function(callback) {
		var target, arr;
		target = $("#issueYear");
		arr = this.getIssueYears();
		this.setAutocomplete(target, 1, arr, callback);
	},
	//conditions
	setConditionsAutocomplete : function (callback) {
		var target, arr;
		target = $("#condition");
		arr = this.conditions;
		this.setAutocomplete(target, 0, arr, callback);
	},
	verifyInConditions: function (callback) {
		var obj = $("#condition").get(0);
	   	this.verifyInList(obj, this.conditions, callback);
	},
	//centerings
	setCenteringsAutocomplete : function (callback) {
		var target, arr;
		target = $("#centering");
		arr = this.centerings;
		this.setAutocomplete(target, 0, arr, callback);
	},
	verifyInCenterings: function (callback) {
		var obj = $("#centering").get(0);
	   	this.verifyInList(obj, this.centerings, callback);
	},
	//gumstates
	setGumstatesAutocomplete : function (callback) {
		var target, arr;
		target = $("#gumstate");
		arr = this.gumstates;
		this.setAutocomplete(target, 0, arr, callback);
	},
	verifyInGumStates: function (callback) {
		var obj = $("#gumstate").get(0);
	   	this.verifyInList(obj, this.gumstates, callback);
	},
	//printingmethods
	setPrintingMethodsAutocomplete : function (callback) {
		var target, arr;
		target = $("#printingMethod");
		arr = this.printingmethods;
		this.setAutocomplete(target, 0, arr, callback);
	},
	//papers
	setPapersAutocomplete : function (callback) {
		var target, arr;
		target = $("#paper");
		arr = this.papers;
		this.setAutocomplete(target, 0, arr, callback);
	},
	//currency
	getCurrencyNames : function () {
		var currencyNames = [];
		$.ajax({
			type: 'POST',
			url: '/getDistinctCurrencyNames',
			async: false,
			success: function(data) {
				currencyNames = data;
			}
		});
		return currencyNames;
	},
	getCurrencySymbols: function () {
		var currencySymbols = [];
		$.ajax({
			type: 'POST',
			url: '/getDistinctCurrencySymbols',
			async: false,
			success: function(data) {
				currencySymbols = data;
			}
		});
		return currencySymbols;		
	},
	setCurrencyNamesAutocomplete : function (skipVerify, callback) {
		var target, arr;
		target = $("#currency");
		arr = this.getCurrencyNames();
		this.setAutocomplete(target, 0, arr, callback, skipVerify);
	},
	setCurrencySymbolsAutocomplete : function (skipVerify, callback) {
		var target, arr;
		target = $("#currencySymbol");
		arr = this.getCurrencySymbols();
		this.setAutocomplete(target, 0, arr, callback, skipVerify);
	}
}