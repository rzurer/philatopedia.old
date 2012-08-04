'use strict';
var imagemagick, uploadLocation, localPath, pub, localTempPath, 
tempLocation, localHostName,smallThumbnailSize, thumbnailSize;
pub = '/home/zurer/projects/philatopedia/public';
localPath = '/images/';
localTempPath = '/temp/';
uploadLocation = pub + localPath;
tempLocation = pub + localTempPath;
imagemagick = require('imagemagick');
imagemagick.identify.path = '/usr/bin/identify';
imagemagick.convert.path = "/usr/bin/convert";
localHostName = 'localhost:3000';
thumbnailSize = '300';
smallThumbnailSize = '100';

function getHostname(str) {
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	if (str.match(re)) {
		return str.match(re)[1].toString();
	}
	return null;
}

function getTempPath(filename) {
	return tempLocation + filename;
}

function getLocalTempPath(filename) {
	return localTempPath + filename;
}


function getImagePath(filename) {
	return uploadLocation + filename;
}

function getThumbnailFilename(filename) {
	return 'th_' + filename;
}

function getThumbnailPath(filename) {
	return tempLocation + getThumbnailFilename(filename);
}
function getLocalThumbnailPath(filename) {
	return localTempPath + getThumbnailFilename(filename);
}

function getLocalImagePath(filename) {
	return localPath + filename;
}

function addDateToFilenames(urlFilenames) {
	var i, urlFilename;
	for (i = 0; i < urlFilenames.length; i += 1) {
		urlFilename = urlFilenames[i];
		urlFilename.filename = (new Date().getTime() + i) + '_' + urlFilename.filename;
	}
	return urlFilenames;
}

function throwIfError(err, stdout, stderr) {
	if (err) {
		throw err;
	}
}

function createImagesAndThumbnails(urlFilenames) {
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
}

function saveImagesAndThumbnails(urlFilenames, callback) {
	var thumbnailPaths = [];
	thumbnailPaths = createImagesAndThumbnails(urlFilenames);
	callback(thumbnailPaths);
}

function getFeatures(url, callback) {
	var result;
	imagemagick.identify(url, function (err, features) {
		if (err) {
			throw err;
		}
		callback(features);
	});
}

function getFeaturesAndCallback(tempPath, filename, callback) {
	getFeatures(tempPath, function (features) {
		var localTempPath, height, width;
		localTempPath = getLocalTempPath(filename);
		height = features.height;
		width = features.width;
		callback(localTempPath, height, width);
	});
}
function saveTempFile(url, callback) {
	var filename, height, width, format, newWidth, tempPath, origTempPath, hostname, isRemote;
	getFeatures(url, 
		function (features) {
		format = features.format;
		if (format.length === 0) {
			callback('');
			return;
		}
		if(format.toLowerCase() === 'jpeg'){
			format = 'jpg';
		}
		height = features.height;
		width = features.width;
		filename = new Date().getTime() + '.' + format;
		tempPath = getTempPath(filename);
		hostname = getHostname(url);
		isRemote = hostname && hostname.length > 0 && hostname !== localHostName;
		if(isRemote){
			origTempPath = getTempPath('orig_' + filename);
			imagemagick.resize({
					srcPath: url,
					dstPath: origTempPath,
					height: '100%'
				}, 
				function(err, stdout, stderr){
					if (err) {throw err;}
				});
			resize(url, callback, filename, height, width, tempPath);		
		}else{
			resize(url, callback, filename, height, width, tempPath);		
		}
	});
}


function resize(url, callback, filename, height, width, tempPath) {
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
	}



function saveFileAndThumbnail(url, filename, callback) {
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
}
exports.getFeatures = getFeatures;
exports.saveTempFile = saveTempFile;