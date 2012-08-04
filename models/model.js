"use strict";
var catalogmodel, countrymodel, stampmodel, referencestampmodel, usermodel, xmlrpc, imgseek, 
	model, Schema, ObjectId, IdentifierSchema, DisplayPropertySchema, ImageInfoSchema, mongoose, url;
mongoose = require('mongoose');
catalogmodel = require('./catalogmodel');
countrymodel = require('./countrymodel');
stampmodel = require('./stampmodel');
referencestampmodel = require('./referencestampmodel');
usermodel = require('./usermodel');
xmlrpc = require('xmlrpc'),
imgseek = require('./imgseek'),
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
IdentifierSchema = new Schema({
	catalog: { type: ObjectId, required: true },
	name: { type: String, required: true },
	wmk: { type: String},
	value: { type: String}
});
DisplayPropertySchema = new Schema({
	name: { type: String, required: true },
	value: { type: String, required: true }
});
ImageInfoSchema = new Schema({
	_id :  { type: String, required: true },
	stampId: { type: ObjectId, required: true },
	imgSeekId : Number,
	originalUrl : String,
	url: { type: String, required: true },
	width: { type: String, min: 0 },
	height: { type: String, min: 0 },
	caption: String
});
imgseek.initialize(xmlrpc);
catalogmodel.initialize(mongoose, Schema);
countrymodel.initialize(mongoose, Schema);
stampmodel.initialize(mongoose, Schema, ObjectId, countrymodel.CurrencySchema, ImageInfoSchema, IdentifierSchema, DisplayPropertySchema, imgseek);
referencestampmodel.initialize(mongoose, Schema, countrymodel.CurrencySchema, ImageInfoSchema, IdentifierSchema, DisplayPropertySchema);
usermodel.initialize(mongoose, Schema);
model = {
	initialize : function (url) {
		var mongoUrl, defaultUrl;
		defaultUrl = 'mongodb://localhost/philatopedia';
		mongoUrl = url || defaultUrl;
		mongoose.connect(mongoUrl);
	},
	catalog : catalogmodel,
	country : countrymodel,
	stamp : stampmodel,
	referencestamp : referencestampmodel,
	user : usermodel
};
exports.initialize = model.initialize;
exports.catalog = model.catalog;
exports.stamp = model.stamp;
exports.referencestamp = model.referencestamp;
exports.user = model.user;
exports.country = model.country;
