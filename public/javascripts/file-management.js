"use strict";
var tempFilesPath, fmUploadUrl, fmSaveThumbnailUrl, fmRenameOriginalFileUrl;
tempFilesPath = '/temp/';
fmUploadUrl = '/uploadTempFile';
fmSaveThumbnailUrl = '/save-temp-file';
fmRenameOriginalFileUrl = '/rename-original-file';

function getFileNameFromPath(path) {
	return path.substring(path.lastIndexOf('/') + 1);
}


function renameOriginalFile(originalFileName, thumbnailFileName) {
	$.ajax({
		type: 'POST',
		url: fmRenameOriginalFileUrl,
		data: {
			originalFileName: originalFileName,
			tempFileName: thumbnailFileName
		},
		success: function (data) {}
	});
}

function saveThumbnail(target, src, renameCallback, callback) {
	var url;
	url = src;
	$.ajax({
		type: 'POST',
		url: fmSaveThumbnailUrl,
		data: {url: url},
		success: function (data) {
			var fileName, thumbnailFilename;
			target.height = data.height;
			target.width = data.width;
			target.src = data.tempPath;
			fileName = getFileNameFromPath(url);
			thumbnailFilename = getFileNameFromPath(data.tempPath);
			if (renameCallback) {
				renameCallback(fileName, thumbnailFilename);
			}
			if (callback) {
				callback(target);
			}		
		}
	});
}

function uploadLocalFileAndThumbnail(target, files, callback) {
	var file, fileName, formData, http, input;
	if (!files || files.length === 0) {
		return;
	}
	file = files[0];
	fileName = file.name;
	formData = new FormData();
	formData.append('file[]', file);
	http = new XMLHttpRequest();
	http.open('POST', fmUploadUrl);
	http.send(formData);
	http.onreadystatechange = function () {
		if (http.readyState === 4) {
			target.width = 0;
			target.src = tempFilesPath + fileName;
			saveThumbnail(target, target.src, renameOriginalFile, callback);
		}
	};
}