"use strict";
var referencestampmodel, ReferenceStampSchema;
function copyReferenceStamp(to, from) {
	to.issuedBy = from.issuedBy;
	if (from.issueYear && from.issueYear !== 'null') {
		to.issueYear  =  from.issueYear;
	}
	to.issueDate  = from.issueDate;
	to.series = from.series;
	to.faceValue = from.faceValue;
	to.color = from.color;
	to.perf = from.perf;
	to.paper = from.paper;
	to.paperColor = from.paperColor;
	to.design = from.design;
	to.printingMethod = from.printingMethod;
	if (!from.currency) {from.currency = []; }
	to.currency = from.currency;
	if (!from.imageInfos) {from.imageInfos = []; }
	to.imageInfos = from.imageInfos;
	if (!from.identifiers) {from.identifiers = []; }
	to.identifiers = from.identifiers;
	if (!from.categories) {from.categories = []; }
	to.categories = from.categories;
	if (!from.tags) {from.tags = []; }
	to.tags = from.tags;
	if (!from.displayProperties) {from.displayProperties = []; }
	to.displayProperties = from.displayProperties;
	if (!from.comments) {from.comments = []; }
	to.comments = from.comments;
	return to;
}
referencestampmodel = {
	initialize : function (mongoose, Schema, CurrencySchema, ImageInfoSchema, IdentifierSchema, DisplayPropertySchema) {
		ReferenceStampSchema = new Schema({
			issuedBy: { type: String, required: true },
			issueYear: { type: Number},
			issueDate: String,
			series: String,
			faceValue: String,
			color: String,
			perf: String,
			paper: String,
			paperColor: String,
			design: String,
			currency: [CurrencySchema],
			printingMethod: String,
			imageInfos: [ImageInfoSchema],
			identifiers: [IdentifierSchema],
			displayProperties : [DisplayPropertySchema],
			categories: [String],
			tags: [String],
			comments: [String],
			inSandbox : { type: String, required: true, default : true}
		});
		this.ReferenceStamp = mongoose.model('ReferenceStamp', ReferenceStampSchema);
	},
	submitToReferenceCollection : function (referenceStamp, callback) {
		referenceStamp.inSandbox = false;
		referenceStamp.save(function (err) {
			if (err) {
				throw err;
			}
			if (callback) {
				callback();
			}
		});
	},
	submitToSandbox : function (stamp, callback) {
		var referenceStamp;
		referenceStamp = new this.ReferenceStamp();
		referenceStamp = copyReferenceStamp(referenceStamp, stamp);
		referenceStamp.save(function (err) {
			if (err) {
				throw err;
			}
			if (callback) {
				callback();
			}
		});
	},
	upsertReferenceStamp : function (id, referenceStamp, callback) {
		var newReferenceStamp =  new this.ReferenceStamp();
		this.ReferenceStamp.findById(id, function (err, found) {
			if (!found) {
				found = copyReferenceStamp(newReferenceStamp, referenceStamp);
			} else {
				found = copyReferenceStamp(found, referenceStamp);
			}
			found.save(function (err) {
				if (err) {
					throw err;
				}
			});
			if (callback) {
				callback(found);
			}
		});
	},
	getAllReferenceStamps : function (callback) {
		this.ReferenceStamp.find({inSandbox : false}, function (err, docs) {
			if (err) {throw err; }
			callback(docs);
		});
	},
	getAllSandboxStamps : function (callback) {
		this.ReferenceStamp.find({inSandbox : true}, function (err, docs) {
			if (err) {throw err; }
			callback(docs);
		});
	}
};
exports.initialize = referencestampmodel.initialize;
exports.submitToSandbox = referencestampmodel.submitToSandbox;
exports.submitToReferenceCollection = referencestampmodel.submitToReferenceCollection;
exports.getAllSandboxStamps = referencestampmodel.getAllSandboxStamps;
