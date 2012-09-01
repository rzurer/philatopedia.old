"use strict";
var stampmodel, StampSchema;
function removeEmptyCurrencies(currencies) {
	if (currencies instanceof Array) {
		var index, removeArray;
		removeArray = [];
		index = 0;
		currencies.forEach(function (element) {
			if (element.name.length === 0) {
				removeArray.push(index);
			}
			index += 1;
		});
		removeArray.forEach(function (idx) {
			currencies.splice(idx, 1);
		});
	}
	return currencies;
}
stampmodel = {
	initialize : function (mongoose, Schema, ObjectId, CurrencySchema, ImageInfoSchema, IdentifierSchema, DisplayPropertySchema, imgseek) {
		StampSchema = new Schema({
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
			categories: [String],
			tags: [String],
			userId: { type: ObjectId, required: true },
			condition : String,
			conditioncomments: String,
			centering: String,
			gumstate: String,
			displayProperties : [DisplayPropertySchema],
			collections: [String],
			comments: String
		});
		this.Stamp = mongoose.model('Stamp', StampSchema);
		this.imgseek = imgseek;
		this.addImgSeekIds = function (id) {
			this.Stamp.findById(id, function (err, found) {
				if (!found) { return; }
				found.imageInfos.forEach(function (imageInfo) {
					if (!imageInfo.imgSeekId) {
						var url = imageInfo.url;
						imgseek.addImage(1, url, false, function (id, success) {
							if (success) {
								imageInfo.imgSeekId = id;
								found.save(function (err) {
									if (err) { throw err; }
								});
							} else {
								console.log("imgseek error");
							}
						});
					}
				});
			});
		};
		this.copyStamp = function (to, from) {
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
			to.currency = removeEmptyCurrencies(from.currency);
			if (!from.imageInfos) {from.imageInfos = []; }
			to.imageInfos = from.imageInfos;
			if (!from.identifiers) {from.identifiers = []; }
			to.identifiers = from.identifiers;
			if (!from.tags) {from.tags = []; }
			to.tags = from.tags;
			if (!from.categories) {from.categories = []; }
			to.categories = from.categories;
			if (!from.displayProperties) {from.displayProperties = []; }
			to.displayProperties = from.displayProperties;
			to.condition = from.condition;
			to.centering = from.centering;
			to.gumstate = from.gumstate;
			to.conditioncomments = from.conditioncomments;
			to.comments = from.comments;
			if (!from.collections) {from.collections = []; }
			to.collections = from.collections;
			to.userId = from.userId;
			return to;
		};
	},
	getMostSimilarImages : function (id, callback) {
		this.imgseek.getMostSimilarImages(id, callback);
	},
	getImagesByImgSeekId : function (ids, callback) {
		this.Stamp.find({ "imageInfos.imgSeekId" : {'$in': ids} }, {imageInfos: 1}, function (err, found) {
			callback(found);
		});
	},
	removeImageFromImgSeek : function (dbId, imgSeekId, callback) {
		this.imgseek.removeImage(dbId, imgSeekId, function (success) {
			callback(success);
		});
	},
	removeStampImage : function (dbId, stampid, currentImageId, callback) {
		var idx, imageUrl, imgSeekId, that;
		idx = -1;
		that = this;
		this.Stamp.findById(stampid, function (err, found) {
			if (found) {
				found.imageInfos.forEach(function (element, index, array) {
					if (element._id === currentImageId) {
						idx = index;
						imageUrl = element.url;
						imgSeekId = element.imgSeekId;
					}
				});
				if (idx >= 0) {
					found.imageInfos = found.imageInfos.splice(idx, 1);
					found.save(function (err) {
						if (err) {
							throw err;
						}
					});
				}
				callback({ stamp : found, imageUrl : imageUrl, imgSeekId : imgSeekId});
			}
		});
	},
	getDistinctTags : function (callback) {
		this.Stamp.collection.distinct("tags", function (err, tags) {
			if (err) {throw err; }
			callback(tags.sort());
		});
	},
	getTagCount : function (tag, callback) {
		this.Stamp.count({tags : tag}, function (err, tagCount) {
			if (err) {throw err; }
			callback({tagCount : tagCount});
		});
	},
	getCollectionCount : function (collection, callback) {
		this.Stamp.count({collections : collection}, function (err, collectionCount) {
			if (err) {throw err; }
			callback({collectionCount : collectionCount});
		});
	},
	getDistinctCollections : function (callback) {
		this.Stamp.collection.distinct("collections", function (err, collections) {
			if (err) {throw err; }
			callback(collections.sort());
		});
	},
	getStampsByKeyAndValue : function (key, value, callback) {
		this.Stamp.find({key: new RegExp(String(value), 'i')}, function (err, found) {
			if (err) {throw err; }
			callback(found);
		});
	},
	deleteStamp : function (id, callback) {
		this.Stamp.findById(id, function (err, found) {
			if (found) {
				found.remove(function (err) {
					if (err) {
						throw err;
					}
					if (callback) {
						callback({success : true});
					}
				});
				return;
			}
			if (callback) {
				callback({success : false});
			}
		});
	},
	getAllImages : function (callback) {
		this.Stamp.find({}, {'imageInfos' : 1, 'displayProperties': 1}, function (err, data) {
			if (err) {throw err; }
			callback(data);
		});
	},
	upsertStamp : function (id, stamp, callback) {
		var that = this;
		this.Stamp.findById(id, function (err, found) {
			if (!found) {
				found = new that.Stamp();
			}
			found = that.copyStamp(found, stamp);
			found.save(function (err) {
				if (err) { throw err; }
				//that.addImgSeekIds(found._id);
				if (callback) { callback(found); }
			});
		});
	},
	getStampsByCollection : function (userId, collection, callback) {
		this.Stamp.find({userId : userId, collections : collection}, function (err, docs) {
			if (err) {throw err; }
			callback(docs);
		});
	},
	getStampsByTags : function (userId, tags, callback) {
		this.Stamp.find({userId : userId, tags: { $in : tags }}, function (err, docs) {
			if (err) {throw err; }
			callback(docs);
		});
	},
	getStampsByCollectionAndTags : function (userId, collection, tags, callback) {
		this.Stamp.find({userId : userId, collections : collection, tags : { $in : tags }}, function (err, docs) {
			if (err) {throw err; }
			callback(docs);
		});
	},
	getAllStamps : function (userId, callback) {
		this.Stamp.find({userId : userId}, function (err, docs) {
			if (err) {throw err; }
			callback(docs);
		});
	},
	getStamp : function (userId, id, callback) {
		this.Stamp.findOne({userId : userId, _id: id}, function (err, found) {
			if (err) {throw err; }
			callback(found);
		});
	}
};
exports.initialize = stampmodel.initialize;
exports.removeStampImage = stampmodel.removeStampImage;
exports.getDistinctTags = stampmodel.getDistinctTags;
exports.getTagCount = stampmodel.getTagCount;
exports.getCollectionCount = stampmodel.getCollectionCount;
exports.getDistinctCollections = stampmodel.getDistinctCollections;
exports.getStampsByKeyAndValue = stampmodel.getStampsByKeyAndValue;
exports.deleteStamp = stampmodel.deleteStamp;
exports.getAllImages = stampmodel.getAllImages;
exports.upsertStamp = stampmodel.upsertStamp;
exports.getStampsByCollection = stampmodel.getStampsByCollection;
exports.getStampsByTags = stampmodel.getStampsByTags;
exports.getStampsByCollectionAndTags = stampmodel.getStampsByCollectionAndTags;
exports.getAllStamps = stampmodel.getAllStamps;
exports.getStamp = stampmodel.getStamp;
exports.getMostSimilarImages = stampmodel.getMostSimilarImages;
exports.getImagesByImgSeekId = stampmodel.getImagesByImgSeekId;
exports.removeImageFromImgSeek = stampmodel.removeImageFromImgSeek;
