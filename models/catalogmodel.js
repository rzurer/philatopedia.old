"use strict";
var catalogmodel, CatalogSchema;
function copyCatalog(to, from) {
	to.name = from.name;
	to.description  = from.description;
	return to;
}
catalogmodel = {
	initialize : function (mongoose, Schema) {
		CatalogSchema = new Schema({
			name:  { type: String, required: true, unique: true },
			description: String
		});
		this.Catalog = mongoose.model('Catalog', CatalogSchema);
	},
	getAllCatalogs : function (callback) {
		var arr, i;
		arr = [];
		this.Catalog.find({}, function (err, docs) {
			if (err) {throw err; }
			for (i = docs.length - 1; i >= 0; i -= 1) {
				var doc = docs[i];
				arr.push(doc);
			}
			callback(arr);
		});
	},
	deleteCatalog : function (id, callback) {
		this.Catalog.findById(id, function (err, found) {
			if (found) {
				found.remove(function (err) {
					if (err) {
						throw err;
					}
				});
			}
			callback();
		});
	},
	upsertCatalog : function (catalog) {
		var newCatalog = new this.Catalog();
		this.Catalog.findById(catalog._id, function (err, found) {
			if (!found) {
				found = copyCatalog(newCatalog, catalog);
			} else {
				found = copyCatalog(found, catalog);
			}
			found.save(function (err) {
				if (err) {
					throw err;
				}
			});
		});
	}
};
exports.initialize = catalogmodel.initialize;
exports.getAllCatalogs = catalogmodel.getAllCatalogs;
exports.upsertCatalog = catalogmodel.upsertCatalog;
exports.deleteCatalog = catalogmodel.deleteCatalog;
