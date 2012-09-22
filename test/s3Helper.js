/*global  describe, it, beforeEach*/
"use strict";
var fs = require('fs'),
	knox = require('knox'),
	mime = require('mime'),
	sut = require('../modules/s3Helper').s3Helper(fs, knox, mime),
	assert = require('assert');
describe('s3Helper_module', function () {
	it("should save user file to amazon s3", function (done) {
		var writeCallback, filename, buffer, userId;
		filename = './misc/now_is_the_time.txt';
		buffer = 'now is the time for all good men to come to the aid of their party';
		userId = 'bob';
		writeCallback = function (req, res) {
			assert.strictEqual(200, res.statusCode)
			assert.strictEqual(req.url, "https://philatopedia.s3.amazonaws.com/bob/now_is_the_time.txt");
			console.log("message");
			done();
		} ;
		sut.saveUserFile(userId, filename, writeCallback);
	});
});