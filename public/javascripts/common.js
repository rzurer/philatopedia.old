'use strict';

function inspect(obj) {
	var p;
	for (p in obj) {
		if (obj.hasOwnProperty(p)) {
			console.log(p + '=' + obj[p]);
		}
	}
}
function trim(str){
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function showToaster(parent, toaster, text){
	var left, top, width;
	top = parent.offset().top;
	left = parent.offset().left;
	width = parent.width();
	toaster.addClass('toaster')
	toaster.css('left', left);
	toaster.css('top', top);
	toaster.css('width', width);
	toaster.text(text);
	toaster.show();
	toaster.delay(1000).hide('slow');
}

function setHover(obj, hoverClass, backgroundColor, color){
	var oldBackgroundColor, oldColor;
	oldBackgroundColor = $(obj).css('background-color');
	oldColor = $(obj).css('color');
	 $(obj).hover(function(){
	 	$(obj).addClass(hoverClass);
	 	$(obj).css('background-color', backgroundColor);
	 	$(obj).css('color', color);
	 }, function(){
	 	$(obj).removeClass(hoverClass);
	 	$(obj).css('background-color', oldBackgroundColor);
	 	$(obj).css('color', oldColor);
	 })
}

function displayInvertedImage (url) {
	var canvasPixelArray, canvas, image, context, imageData
	canvas = $('#canvas').get(0);
	image = new Image();
	image.src = url;
	image.onload  = function () {
	    canvas.width  = image.width;
	    canvas.height = image.height;
	    context = canvas.getContext('2d');
	    context.drawImage(image, 0, 0, image.width, image.height);
	    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	    canvasPixelArray  = imageData.data;
		for (var i = 0, n = canvasPixelArray.length; i < n; i += 4) {
			canvasPixelArray[i  ] = 255 - canvasPixelArray[i  ]; // red
			canvasPixelArray[i+1] = 255 - canvasPixelArray[i+1]; // green
			canvasPixelArray[i+2] = 255 - canvasPixelArray[i+2]; // blue
			// i+3 is alpha (the fourth element)
		}
		context.putImageData(imageData, 0, 0);
	}
}
function arrayContains(arr, val, equals) {
    var i = arr.length;
    while (i--) {
        if ( equals(arr[i], val) ) {
            return true;
        }
    }
    return false;
}
function removeDuplicates(arr, equals) {
    var originalArr = arr.slice(0);
    var i, len, j, val;
    arr.length = 0;

    for (i = 0, len = originalArr.length; i < len; ++i) {
        val = originalArr[i];
        if (!arrayContains(arr, val, equals)) {
            arr.push(val);
        }
    }
}
function rgbIsEgual (rgb1, rgb2) {
	return rgb1.r === rgb2.r && rgb1.b === rgb2.b && rgb1.g === rgb2.g
}

function displayImageColorNames(url, callback) {
	var canvasPixelArray, canvas, image, context, imageData, red, green, blue, colorNames, i, j, k, rgbArray, colorName, classifier; 
	canvas = $('#canvas').get(0);
	image = new Image();
	image.src = url;
	image.onload  = function () {
	    canvas.width  = image.width;
	    canvas.height = image.height;
	    context = canvas.getContext('2d');
	    context.drawImage(image, 0, 0, image.width, image.height);
	    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	    canvasPixelArray  = imageData.data;
	    rgbArray = [];
		for (i = 0; i < canvasPixelArray.length; i += 4) {
			red = canvasPixelArray[i];
			green = canvasPixelArray[i+1];
			blue = canvasPixelArray[i+2];
			rgbArray.push({r:red, g:green, b:blue});
		}
    	removeDuplicates(rgbArray, rgbIsEgual);
    	colorNames = [];
    	classifier = getClassifier();
    	rgbArray.forEach(function(element){
    		colorName = classifier.getColorName(element.r, element.g, element.b);
   			if(colorNames.indexOf(colorName) === -1){
   					colorNames.push(colorName);  			
   			}	
    	});
    	colorNames.forEach(function(element) {
    	})   	
	}
}
function getClassifier () {
	var classifier = new ColorClassifier();
	classifier.learn(data);
	return classifier;

}

function getHostname(str) {
	var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
	if (str.match(re)) {
		return str.match(re)[1].toString();
	}
	return null;
}

function showHideHighlight(obj) {
	$(obj).fadeOut("fast", function() {
		$(obj).fadeIn("fast");
	});
}

function assignImageZoom(img, imageHeight) {
	if (imageHeight) {
		$(img).dblclick(function() {
			$(this).css("cursor", "pointer");
			$(this).animate({
				height: Math.min(imageHeight, 500) + "px"
			}, 'slow');
		});
	};
	$(img).mouseout(function() {
		$(this).animate({
			height: "50px"
		}, 'slow');
	});
};
$.fn.selectRange = function(start, end) {
	return this.each(function() {
		if (this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(start, end);
		} else if (this.createTextRange) {
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	});
};

function removeLocalStorageKey(name){
	localStorage.removeItem(name);
}

function placeInLocalStorage(name, value) {
	localStorage[name] = JSON.stringify(value);
}

function getFromLocalStorage (name) {
	var value;
	value = localStorage[name];
	try{
		return JSON.parse(value);
	}catch(ex) {
		return value;
	}
}

function getFromOrPlaceInLocalStorage(name, createFunction) {
	if (!localStorage[name]) {
		placeInLocalStorage(name, createFunction());
	}
	return getFromLocalStorage(name);
}

function clearFields() {
	$('input[type="text"]').val('');
}

