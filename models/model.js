"use strict";
var catalogmodel = require('./catalogmodel'),
	countrymodel = require('./countrymodel'),
	stampmodel = require('./stampmodel'),
	imgseek = require('./imgseek'),
	referencestampmodel = require('./referencestampmodel'),
	usermodel = require('./usermodel'),
	initialize = function (mongoose, xmlrpc, url) {
		var Schema = mongoose.Schema,
			ObjectId = Schema.ObjectId,
			ImageInfoSchema = new Schema({
				_id :  { type: String, required: true },
				stampId: { type: ObjectId, required: true },
				imgSeekId : Number,
				originalUrl : String,
				url: { type: String, required: true },
				width: { type: String, min: 0 },
				height: { type: String, min: 0 },
				caption: String
			}),
			IdentifierSchema = new Schema({
				catalog: { type: ObjectId, required: true },
				name: { type: String, required: true },
				wmk: { type: String},
				value: { type: String}
			}),
			DisplayPropertySchema = new Schema({
				name: { type: String, required: true },
				value: { type: String, required: true }
			});
		usermodel.initialize(mongoose, Schema);
		catalogmodel.initialize(mongoose, Schema);
		countrymodel.initialize(mongoose, Schema);
		imgseek.initialize(xmlrpc);
		stampmodel.initialize(mongoose, Schema, ObjectId, countrymodel.CurrencySchema, ImageInfoSchema, IdentifierSchema, DisplayPropertySchema, imgseek);
		referencestampmodel.initialize(mongoose, Schema, countrymodel.CurrencySchema, ImageInfoSchema, IdentifierSchema, DisplayPropertySchema);
	    mongoose.connect(url);
	};
exports.initialize = initialize;
exports.catalog = catalogmodel;
exports.stamp = stampmodel;
exports.referencestamp = referencestampmodel;
exports.user = usermodel;
exports.country = countrymodel;
