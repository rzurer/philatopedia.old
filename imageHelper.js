'use strict';
var saveTempFile,
	getFeatures,
	imagemagick,
	getTempPath,
	pub = '/home/zurer/projects/philatopedia/public',
	localPath = '/images/',
	localTempPath = '/temp/',
	uploadLocation = pub + localPath,
	tempLocation = pub + localTempPath,
	localHostName = 'localhost:3000',
	thumbnailSize = '300',
	smallThumbnailSize = '100',
	initialize = function (Imagemagick) {
		imagemagick = Imagemagick;
		imagemagick.identify.path = '/usr/bin/identify';
		imagemagick.convert.path = "/usr/bin/convert";
	},
	getLocalImagePath = function (filename) {
		return localPath + filename;
	},
	getFeatures = function (url, callback) {
		var result;
		imagemagick.identify(url, function (err, features) {
			if (err) {
				throw err;
			}
			callback(features);
		});
	},
	getTempPath = function (filename) {
		return tempLocation + filename;
	},
	getHostname = function (str) {
		var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
		if (str.match(re)) {
			return str.match(re)[1].toString();
		}
		return null;
	},
	getThumbnailFilename = function (filename) {
		return 'th_' + filename;
	},
	getThumbnailPath = function (filename) {
		return tempLocation + getThumbnailFilename(filename);
	},
	getLocalThumbnailPath = function (filename) {
		return localTempPath + getThumbnailFilename(filename);
	},
	addDateToFilenames = function (urlFilenames) {
		var i, urlFilename;
		for (i = 0; i < urlFilenames.length; i += 1) {
			urlFilename = urlFilenames[i];
			urlFilename.filename = (new Date().getTime() + i) + '_' + urlFilename.filename;
		}
		return urlFilenames;
	},
	getImagePath = function (filename) {
		return uploadLocation + filename;
	},
	throwIfError = function (err) {
		if (err) {
			throw err;
		}
	},
	createImagesAndThumbnails = function (urlFilenames) {
		var i, urlFilename, thumbnailPaths, localThumbnailPath;
		urlFilenames = addDateToFilenames(urlFilenames);
		thumbnailPaths = [];
		for (i = 0; i < urlFilenames.length; i += 1) {
			urlFilename = urlFilenames[i];
			localThumbnailPath = getLocalThumbnailPath(urlFilename.filename);
			imagemagick.resize({
				srcPath: urlFilename.url,
				dstPath: getImagePath(urlFilename.filename),
				width: '100%'
			}, throwIfError);
			imagemagick.resize({
				srcPath: urlFilename.url,
				dstPath: getThumbnailPath(urlFilename.filename),
				width: smallThumbnailSize
			}, throwIfError);
			thumbnailPaths.push(localThumbnailPath);
		}
		return thumbnailPaths;
	},
	saveImagesAndThumbnails = function (urlFilenames, callback) {
		var thumbnailPaths = [];
		thumbnailPaths = createImagesAndThumbnails(urlFilenames);
		callback(thumbnailPaths);
	},
	saveFileAndThumbnail = function (url, filename, callback) {
		var imagePath, thumbnailPath;
		imagePath = getTempPath(filename);
		thumbnailPath = getThumbnailPath(filename);
		if (getHostname(url) === null) {
			url = pub + url;
		}
		imagemagick.resize({
			srcPath: url,
			dstPath: imagePath,
			width: '100%'
		}, function (err, stdout, stderr) {
			if (err) {
				throw err;
			}
			saveTempFile(url, callback);
		});
	},
	getLocalTempPath = function (filename) {
		return localTempPath + filename;
	},
	getFeaturesAndCallback = function (tempPath, filename, callback) {
		getFeatures(tempPath, function (features) {
			var localTempPath, height, width;
			localTempPath = getLocalTempPath(filename);
			height = features.height;
			width = features.width;
			callback(localTempPath, height, width);
		});
	},
	resize = function (url, callback, filename, height, width, tempPath) {
		if (height > width) {
			height = Math.min(thumbnailSize, height);
			imagemagick.resize({
				srcPath: url,
				dstPath: tempPath,
				height: height
			}, function (err, stdout, stderr) {
				if (err) {
					throw err;
				}
				getFeaturesAndCallback(tempPath, filename, callback);
			});
		} else {
			width = Math.min(thumbnailSize, width);
			imagemagick.resize({
				srcPath: url,
				dstPath: tempPath,
				width: width
			}, function (err, stdout, stderr) {
				if (err) {
					throw err;
				}
				getFeaturesAndCallback(tempPath, filename, callback);
			});
		}
	},
	saveTempFile = function (url, callback) {
		var filename, height, width, format, newWidth, tempPath, origTempPath, hostname, isRemote;
		getFeatures(url, function (features) {
			format = features.format;
			if (format.length === 0) {
				callback('');
				return;
			}
			if (format.toLowerCase() === 'jpeg') {
				format = 'jpg';
			}
			height = features.height;
			width = features.width;
			filename = new Date().getTime() + '.' + format;
			tempPath = getTempPath(filename);
			hostname = getHostname(url);
			isRemote = hostname && hostname.length > 0 && hostname !== localHostName;
			if (isRemote) {
				origTempPath = getTempPath('orig_' + filename);
				imagemagick.resize({srcPath: url, dstPath: origTempPath, height: '100%'}, function (err) {if (err) { throw err; } });
				resize(url, callback, filename, height, width, tempPath);
			} else {
				resize(url, callback, filename, height, width, tempPath);
			}
		});
	};
exports.initialize = initialize;
exports.getFeatures = getFeatures;
exports.saveTempFile = saveTempFile;