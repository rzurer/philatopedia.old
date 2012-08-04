
function initEvent(event) {
	preventDefault(event);
	stopPropagation(event);
};

function preventDefault(e) {
	if (e.preventDefault) {
		e.preventDefault();
	}
	try {
		e.returnValue = false;
	} catch (ex) {}
}

function stopPropagation(e) {
	if (e.stopPropagation) {
		e.stopPropagation();
	}
	try {
		e.returnValue = false;
	} catch (ex) {}
}

function highlight(event){
	$(event.target).addClass('hover');	
}
function removeHighlight(event){
	$(event.target).removeClass('hover');
}

function doDragOver(event) {
	initEvent(event);
}

function doDragEnter(event) {
	initEvent(event);
	highlight(event);
}

function doDragLeave(event) {
	initEvent(event);
	removeHighlight(event);
}


function getTargetImg(event){
	return event.target.tagName.toLowerCase() !== 'img' ? event.target.firstChild : event.target;
}

function getRemoteSrc(event) {
	var src;
	src = event.dataTransfer.getData("text/x-moz-url");
	if (!src || src === 'undefined') {
		src = event.dataTransfer.getData("URL");
	}
	return src;
}

function doDrop(event, imageSrcCallback) {
	var img, files, src;
	initEvent(event);
	img =  getTargetImg(event);
	img.width = 0;
	files = event.dataTransfer.files;
	if(files.length > 0){
		uploadLocalFileAndThumbnail(img, files, imageSrcCallback);
		removeHighlight(event);
		return;
	}
	src = getRemoteSrc(event);
	saveThumbnail(img, src, null,  function () {
		removeHighlight(event);
		imageSrcCallback(img);
	});	
	
}

function initializeEvents(dropZone, imageSrcCallback) {
	if(!dropZone){
		return;
	}
	dropZone.addEventListener("dragover", function(event) {
		doDragOver(event);
	}, true);
	dropZone.addEventListener("drop", function(event) {
		doDrop(event, imageSrcCallback);
	}, true);
	dropZone.addEventListener("dragenter", function(event) {
		doDragEnter(event);
	}, true);
	dropZone.addEventListener("dragleave", function(event) {
		doDragLeave(event);
	}, true);
}