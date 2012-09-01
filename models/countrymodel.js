"use strict";
var countrymodel, CurrencySchema, CountrySchema, that;
that = this; //TODO: Cannot read property 'arity' of undefined
function getCountryName(country) {
	return country.name;
}
function getCurrencyName(currency) {
	return currency.name;
}
function getCurrencySymbol(currency) {
	return currency.symbol;
}
countrymodel = {
	initialize : function (mongoose, Schema) {
		CurrencySchema = new Schema({
			name:  { type: String, required: true},
			symbol:  { type: String}
		});
		CountrySchema = new Schema({
			name:  { type: String, required: true, unique: true },
			currencies : [this.CurrencySchema]
		});
		this.Country = mongoose.model('Country', CountrySchema);
	},
	saveCountries : function (countries, callback) {
		if (countries.length === 0) {
			return;
		}
		countries.forEach(function (element) {
			var country;
			country = new that.Country({name : element});
			country.save(function (err) {
				if (err) {throw err; }
			});
		});
		if (callback) {
			callback();
		}
	},
	removeCountries : function (callback) {
		this.Country.remove({}, function (err) {
			if (err) {
				throw err;
			}
			if (callback) {
				callback();
			}
		});
	},
	getAllCountryNames : function (callback) {
		this.Country.find({}).sort('name', 1).execFind(function (err, countries) {
			if (err) {throw err; }
			if (callback) {
				callback(countries.map(getCountryName));
			}
		});
	},
	getAllCountries : function (callback) {
		this.Country.find({}, function (err, countries) {
			if (err) {throw err; }
			callback(countries);
		});
	},
	getAllCountriesWithCurrencies : function (callback) {
		this.Country.find().$where("(this.currencies.length > 0)").sort('name', 1).execFind(function (err, countries) {
			if (err) {throw err; }
			if (callback) {
				callback(countries);
			}
		});
	},
	getDistinctCurrencies : function (callback) {
		this.Country.collection.distinct("currencies", function (err, currencies) {
			if (err) {throw err; }
			callback(currencies);
		});
	},
	getDistinctCurrencyNames : function (callback) {
		this.getDistinctCurrencies(function (currencies) {
			callback(currencies.map(getCurrencyName));
		});
	},
	getDistinctCurrencySymbols : function (callback) {
		this.getDistinctCurrencies(function (currencies) {
			callback(currencies.map(getCurrencySymbol));
		});
	},
	getCountryCurrencies : function (countryName, callback) {
		this.Country.findOne({ name : countryName }, function (err, country) {
			if (err) {throw err; }
			if (country) {
				callback(country.currencies);
			}
		});
	},
	addCurrencyToCountry : function (countryCurrency, callback) {
		var currencyNames, countryName, currencyName;
		countryName = countryCurrency.countryName;
		currencyName = countryCurrency.name;
		this.Country.findOne({ name : countryName }, function (err, country) {
			if (err) {throw err; }
			currencyNames = country.currencies.map(function (currency) { return currency.name; });
			if (currencyName.length > 0 && currencyNames.indexOf(currencyName) === -1) {
				country.currencies.push(countryCurrency);
			}
			country.save();
			callback(country);
		});
	},
	updateCurrencies : function (id, currencies, callback) {
		this.Country.findById(id, function (err, country) {
			var allowedCurrencies, currencyNames;
			allowedCurrencies = [];
			currencies.forEach(function (currency) {
				currencyNames = allowedCurrencies.map(function (curr) { return curr.name; });
				if (currency.name.length > 0 && currencyNames.indexOf(currency.name) === -1) {
					allowedCurrencies.push(currency);
				}
			});
			country.currencies = allowedCurrencies;
			country.save(function (err) {
				if (err) {
					throw err;
				}
				if (callback) {
					callback();
				}
			});
		});
	}

};
exports.initialize = countrymodel.initialize;
exports.getCountryCurrencies = countrymodel.getCountryCurrencies;
exports.saveCountries = countrymodel.saveCountries;
exports.removeCountries = countrymodel.removeCountries;
exports.getAllCountryNames = countrymodel.getAllCountryNames;
exports.getAllCountries = countrymodel.getAllCountries;
exports.getAllCountriesWithCurrencies = countrymodel.getAllCountriesWithCurrencies;
exports.getDistinctCurrencyNames = countrymodel.getDistinctCurrencyNames;
exports.getDistinctCurrencySymbols = countrymodel.getDistinctCurrencySymbols;
exports.getCountryCurrencies = countrymodel.getCountryCurrencies;
exports.addCurrencyToCountry = countrymodel.addCurrencyToCountry;
exports.updateCurrencies = countrymodel.updateCurrencies;