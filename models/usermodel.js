"use strict";
var usermodel, UserSchema;
function copyUser(to, from) {
	to.username = from.username;
	to.isAdmin = from.isAdmin;
	return to;
}
usermodel = {
	initialize : function (mongoose, Schema) {
		UserSchema = new Schema({
			username:  { type: String, required: true, unique: true },
			isAdmin: { type: Boolean, default: false }
		});
		this.User = mongoose.model('User', UserSchema);
	},
	getAllUsers : function (callback) {
		var arr, i;
		arr = [];
		this.User.find({}, function (err, docs) {
			if (err) {throw err; }
			for (i = docs.length - 1; i >= 0; i -= 1) {
				var doc = docs[i];
				arr.push(doc);
			}
			callback(arr);
		});
	},
	deleteUser : function (id, callback) {
		this.User.findById(id, function (err, found) {
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
	upsertUser : function (id, user) {
		var newUser = new this.User();
		this.User.findById(id, function (err, found) {
			if (!found) {
				found = copyUser(newUser, user);
			} else {
				found = copyUser(found, user);
			}
			found.save(function (err) {
				if (err) {
					throw err;
				}
			});
		});
	},
	getUser : function (username, callback) {
		var name = username.length === 0 ? '' : new RegExp(String(username), 'i');
		this.User.findOne({username : name}, function (err, user) {
			if (err) {throw err; }
			callback(user);
		});
	}
};
exports.initialize = usermodel.initialize;
exports.upsertUser = usermodel.upsertUser;
exports.getUser = usermodel.getUser;
exports.deleteUser = usermodel.deleteUser;
exports.getAllUsers = usermodel.getAllUsers;
