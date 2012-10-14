/*jslint browser: true*/
/*global  $, getFromLocalStorage, placeInLocalStorage, picklists, NavigationButtons, ImageCarousel, PropertyManager,
initializeEvents, getDefaultImage, Slider, Identifiers, addStampTags, addCategoryTags, addCollectionTags, displaySearchCriteria,
initialize*/
'use strict';
var sliders, imageCarousel, identifiers, popupStatus, noimagesrc; //stamp, cataloglistings, 
noimagesrc = '/images/dropimagehere.png';
var updateStamp = function (obj) {
	stamp[obj.name] = obj.value;
	console.log(obj.name +'='+ stamp[obj.name]);
};
var getFullSizeImageUrl = function () {
	var src;
	src = $("#dropImage").attr('src');
	if (src === noimagesrc) {
		return noimagesrc;
	}
	return '/temp/orig_' + src.substr(src.lastIndexOf('/') + 1);
};
var loadPopup = function () {
	if (popupStatus === 0) {
		$("#backgroundPopup").css({"opacity": "0.7"});
		$("#backgroundPopup").fadeIn("slow");
		$("#popupImage").fadeIn("slow");
		popupStatus = 1;
	}
};
var showPopup = function (width, height) {
	var containerWidth, containerHeight;
	containerWidth = $('body').width();
	containerHeight = $('body').height();
	$("#popupImage").css({"position": "absolute", "top": (containerHeight / 2) - (height / 2), "left": (containerWidth / 2) - (width / 2)});
	loadPopup();
};
var getLoggedInUser = function (callback) {
	$.ajax({
        type: 'POST',
        url: '/getUser',
        success: function (user) {
            if (callback) {
                callback(user);
            }
        }
    });
};
var truncate = function () {
	var value, truncated;
	$('.normal').each(function () {
		if ($(this).text().length > 30) {
			value = $(this).text();
			truncated = value.substring(0, 25) + " ...";
			$(this).attr('title', value);
			$(this).text(truncated);
		}
	});
};
var disablePopup = function () {
	if (popupStatus === 1) {
		$("#backgroundPopup").fadeOut("slow");
		$("#popupImage").fadeOut("slow");
		popupStatus = 0;
	}
};
var identify = function (url, callback) {
	$.ajax({
		type: 'POST',
		url: '/identify',
		data: {
			url: url
		},
		success: function (data) {
			callback(data.features.width, data.features.height);
		}
	});
};
var assignPopupEvents = function () {
	$("#popupImageClose").click(function () {
		disablePopup();
	});
	$("#backgroundPopup").click(function () {
		disablePopup();
	});
	$("#dropImage").click(function () {
		var url, src;
		src = getFullSizeImageUrl();
		if (src === noimagesrc) {
			return;
		}
		$('#fullSizeImage').attr('src', src);
		url = $('#fullSizeImage').get(0).src;
		identify(url, showPopup);
	});
};
var removeImgSeekId = function (dbId, imgSeekId) {
	$.ajax({
		type: 'POST',
		url: '/removeImgSeekId',
		data: {
			dbId: 1,
			imgSeekId: imgSeekId
		},
		success: function (removed) {
			console.log(removed);
		}
	});
};
var removeImage = function () {
	var currentImageId, stampId;
	currentImageId = imageCarousel.getCurrentImageId();
	stampId = stamp._id;
	console.log('currentImageId ', currentImageId);
	console.log('stampId ', stampId);
	$.ajax({
		type: 'POST',
		url: '/removeStampImage',
		data: {
			stampId: stampId,
			currentImageId: currentImageId
		},
		success: function (data) {
			stamp = data.stamp;
			imageCarousel.setStamp(stamp);
			imageCarousel.setImageToDefault();
			//removeImgSeekId(1, data.imgSeekId);
		}
	});
};
var getTotalImageWidth = function (arr) {
	var totalImageWidth = 0;
	arr.forEach(function (element) {
		totalImageWidth += element.width();
	});
	return totalImageWidth;
};
var getCurrentImageIndex = function (arr, currentImageId) { //not used?
	var currentImageIndex = -1;
	arr.forEach(function (element, index) {
		if (element.imageId === currentImageId) {
			currentImageIndex = index;
		}
	});
	return currentImageIndex;
};
var canSaveStamp = function (stamp) {
	if (!stamp) {
		throw "stamp should not be undefined";
	}
	return stamp.issuedBy && stamp.issuedBy !== 'null';// && stamp.issueYear && stamp.issueYear !== 'null';
};
var upsertStamp = function (callback) {
	if (!canSaveStamp(stamp)) {
		return;
	}
	$.ajax({
		type: 'POST',
		url: '/upsertStamp',
		data: {
			stamp: stamp
		},
		async: true,
		success: function (data) {
			stamp = data;
			if (callback) {
				callback();
			}
		}
	});
};
var getStampHtml = function (id) {
	$.ajax({
		type: 'POST',
		url: '/stamps',
		data: {
			id: id
		},
		success: function (data) {
			history.pushState({id: id}, '', '/stamps/?id=' + id);
			$('.stampcontainer').html(data);
		}
	});
};
var createImage = function (element, currentImageId) {
	var src, imageId, stampId, that, img;
	src = element.defaultImageSrc;
	imageId = element.imageId;
	stampId = element.stampId;
	img = $('<img/>');
	img.attr('id', imageId);
	img.attr('src', src);
	img.attr('stampId', stampId);
	if (imageId !== currentImageId) {
		img.css('opacity', '1.0');
		img.click(function (evt) {
			that = this;
			upsertStamp(function () {
				stampId = $(that).attr('stampId');
				getStampHtml(stampId);
			});
		});
	} else {
		img.css('opacity', '0.2');
	}
	return img;
};
var createImagesArray = function (arr, currentImageId) {
	var images, image;
	images = [];
	arr.forEach(function (element) {
		image = createImage(element, currentImageId);
		images.push(image);
	});
	return images;
};
var nextThumbnail = function () {
	$('.thumbnailNavPrevious').show();
};
var previousThumbnail = function () {
	var firsthidden, firstvisible;
	firsthidden = $('.thumbnailNav > img:hidden').first();
	firstvisible = $('.thumbnailNav > img:visible').first();
	firsthidden.show();
	firsthidden.css('width', 25);
	firstvisible.hide();
};
var createThumbnails = function (arr) {
	var currentImageId, images, totalImageWidth, currentImageIndex, img, pos;
	currentImageId = $('#currentImageId').val();
	$('.thumbnailNav').empty();
	if (!arr || arr.length === 0) {
		return;
	}
	images = createImagesArray(arr, currentImageId);
	images.forEach(function (image) {
		$('.thumbnailNav').append(image);
	});
	totalImageWidth = getTotalImageWidth(images);
	pos = images.length - 1;
	while (totalImageWidth >= 825) {
		img = images[pos];
		if (img !== undefined) {
			img.css('width', 0);
			img.hide();
			$('.thumbnailNavNext').show();
		}
		pos -= 1;
		totalImageWidth = getTotalImageWidth(images);
	}
};
var displayThumbnails = function () {
	var query = getFromLocalStorage('collectionOrTagsQuery');
	$.ajax({
		type: 'POST',
		url: '/getStampIdDefaultImageIdImageSrcArray',
		data: {
			collection: query.collection,
			tags: query.tags
		},
		success: function (data) {
			createThumbnails(data);
		}
	});
};
var addStamp = function () {
	document.location.href = '/stamps/new';
};
var goToStamp = function (id) {
	document.location.href = '/stamps/?id=' + id;
};
var goToSandbox = function () {
	document.location.href = '/stamps/sandbox';
};
var getStamp = function (id, callback) {
	$.ajax({
		type: 'POST',
		url: '/getStamp',
		data: {
			id: id
		},
		success: function (stamp) {
			if (callback) {
				callback(stamp);
			}
		}
	});
};
var submitToSandbox = function (id, callback) {
	getStamp(id, function (stamp) {
        if (!canSaveStamp(stamp)) {
            return;
        }
		$.ajax({
			type: 'POST',
			url: '/submitToSandbox',
			data: {stamp: stamp},
			success: function (data) {
				if (callback) {
					callback(data.message);
				}
			}
		});
	});
};
var deleteStamp = function (id, callback) {
	$.ajax({
		type: 'POST',
		url: '/deleteStamp',
		data: {
			id: id
		},
		async: false,
		success: function (data) {
			if (callback) {
				callback(data);
			}
		}
	});
};
var goToList = function () {
	window.location = '/stamps/usercollection';
};
var refresh = function () {
	window.location = '/stamps/new';
};
var clearCurrency = function () {
	$('#currency').val('');
	$('#currencySymbol').val('');
	stamp.currency = [{name: '', symbol: ''}];
};
var getCountryCurrencies = function () {
	$.ajax({
		type: 'POST',
		url: '/getCountryCurrencies',
		data: {countryName: stamp.issuedBy},
		success: function (data) {
			var countryCurrrencySymbols, countryCurrrencyNames;
			placeInLocalStorage('countrycurrencies', data.currencies);
			countryCurrrencySymbols = data.currencies.map(function (currency) {
				return currency.symbol;
			});
			countryCurrrencyNames = data.currencies.map(function (currency) {
				return currency.name;
			});
			picklists.setAutocomplete($('#currencySymbol'), 0, countryCurrrencySymbols);
			picklists.setAutocomplete($('#currency'), 0, countryCurrrencyNames);
		}
	});
};
var updateCountry = function (obj) {
	if (obj.value.length === 0) {
		$(obj).css('border', '2px solid red');
		$(obj).focus();
		return;
	}
	if (obj.value !== stamp.issuedBy) {
		updateStamp(obj);
		getCountryCurrencies();
		clearCurrency();
	}
};
var setAutoCompletes = function () {
	picklists.setCountriesAutocomplete(false, updateCountry);
	picklists.setIssueYearAutocomplete(updateStamp);
	picklists.setConditionsAutocomplete(updateStamp);
	picklists.setCenteringsAutocomplete(updateStamp);
	picklists.setGumstatesAutocomplete(updateStamp);
	picklists.setPrintingMethodsAutocomplete(updateStamp);
	picklists.setPapersAutocomplete(updateStamp);
	picklists.setTagsAutocomplete(true);
	picklists.setCollectionsAutocomplete(true);
	picklists.setCategoriesAutocomplete();
};
var setDefaultImage = function () {
	var imageInfo;
	imageInfo = imageCarousel.getImageInfoFromSrc(stamp.imageInfos);
	imageCarousel.setCurrentImageId(imageInfo._id);
	imageCarousel.setDefaultImage();
	upsertStamp(displayThumbnails);
};
var setImageCarousel = function () {
	var navigationButtons, dropImage, imageContainer;
	navigationButtons = new NavigationButtons($('#navFirst'), $('#navPrevious'), $('#navNext'), $('#navLast'), $('#navRemove'));
	imageCarousel = new ImageCarousel(stamp, PropertyManager, navigationButtons);
	dropImage = $("#dropImage").get(0);
	initializeEvents(dropImage);
	imageContainer = $("#imageContainer").get(0);
	initializeEvents(imageContainer, function (img) {
		imageCarousel.addImageInfo(img);
	});
	$("#defaultimage").change(function (evt) {
		setDefaultImage();
	});
	imageCarousel.setImageToDefault();
	imageCarousel.setDefaultImageCheckbox();
};
var setCatalogsSlider = function () {
	$('.slider').each(function () {
		sliders.push(new Slider(this));
	});
	identifiers = new Identifiers(PropertyManager, stamp, sliders[0], cataloglistings);
	$('#defaultcatalog').change(function (evt) {
		identifiers.setDefaultCatalog();
	});
	identifiers.setCatalogToDefault();
};
var setIssueDatePicker = function () {
	$("#issueDate").datepicker({
		changeYear: false,
		dateFormat: "M dd",
		onClose: function (dateText, inst) {
			$(inst.input).val(dateText);
			updateStamp($(inst.input).get(0));
		}
	});
};
var addOrUpdateIdentifier = function () {
	var wmk, value;
	value = $('#catalognumber').val();
	wmk = $('#wmk').val();
	identifiers.addIdentifier(value, wmk);
};
var getCurrency = function () {
	return {name : $('#currency').val(), symbol : $('#currencySymbol').val()};
};
var setCurrency = function (currency) {
	$('#currency').val(currency.name);
	$('#currencySymbol').val(currency.symbol);
	stamp.currency = currency;
};
var setCurrencySymbol = function () {
	var countrycurrencies, currency, countryCurrency, i;
	countrycurrencies = getFromLocalStorage('countrycurrencies');
	if (!countrycurrencies || countrycurrencies.length === 0) {
		return;
	}
	currency = getCurrency();
	for (i = 0; i < countrycurrencies.length; i += 1) {
		countryCurrency = countrycurrencies[i];
		if (countryCurrency.symbol === currency.symbol) {
			currency.name = countryCurrency.name;
			setCurrency(currency);
			return;
		}
	}
};
var setCurrencyName = function () {
	var countrycurrencies, currency, countryCurrency, i;
	countrycurrencies = getFromLocalStorage('countrycurrencies');
	if (!countrycurrencies || countrycurrencies.length === 0) {
		return;
	}
	currency = getCurrency();
	for (i = 0; i < countrycurrencies.length; i += 1) {
		countryCurrency = countrycurrencies[i];
		if (countryCurrency.name === currency.name) {
			currency.symbol = countryCurrency.symbol;
			setCurrency(currency);
			return;
		}
	}
};
var doInitializeStamp = function () {
	$(window).bind('beforeunload', upsertStamp);//tested
	addStampTags(stamp.tags);//tags
	addCategoryTags(stamp.categories);//collections
	addCollectionTags(stamp.collections);//collections
	displaySearchCriteria();//modules/search
	displayThumbnails();//stamp ==> imageCarousel
	initialize();//stamp
};
var initialize = function () {
	popupStatus = 0;
	sliders = [];
	setCatalogsSlider();//stamp
	setImageCarousel(stamp);//stamp
	setAutoCompletes();//stamp
	setIssueDatePicker();//stamp
	assignPopupEvents();//stamp
	getCountryCurrencies();//stamp
	$('#issuedBy').focus();
};
