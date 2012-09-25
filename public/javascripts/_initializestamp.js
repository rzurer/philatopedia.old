/*globals  $*/
"use strict";
var initializeStamp = function () {
	$(function () {
		$('#clearsearchdetail').click(function () {
			clearSearch();//search
			showHideClearSearch($('#clearsearchdetail'));//search?
			displayThumbnails();//stamp
		});
		$('.updateStamp').blur(function () {
			updateStamp(this); //stamp
		});
		$('.goToPreviousCatalog').click(function () {
			sliders[0].goToPrev();//sliders
		});
		$('.goToNextCatalog').click(function () {
			sliders[0].goToNext();//sliders
		});
		$('.addOrUpdateIdentifier').blur(addOrUpdateIdentifier);
		$('.setImageCaption').blur(function () {
			imageCarousel.setImageCaption(this);//imageCarousel
		});
		$('#navFirst').click(function () {
			imageCarousel.navigateTo("first");//imageCarousel
		});
		$('#navPrevious').click(function () {
			imageCarousel.navigateTo("previous");//imageCarousel
		});
		$('#navNext').click(function () {
			imageCarousel.navigateTo("next");//imageCarousel
		});
		$('#navLast').click(function () {
			imageCarousel.navigateTo("last");//imageCarousel
		});
		$('#navRemove').click(removeImage); //broken refactor to use s3
		$('#currencySymbol').blur(setCurrencySymbol);//stamp
		$('#currency').blur(setCurrencyName);//stamp
		$('#addCategory').click(addCategory);//collections
		$('#addCollection').click(addCollection);//collections
		$("#collectionsource").blur(function () {
			leaveCollection(this);//collections
		});
		$("#tagsource").blur(function () {
			leaveTag(this);//tags
		});
		$('#addTag').click(addTag);//tags
		$('.thumbnailNavPrevious > img').click(previousThumbnail);//stamp
		$('.thumbnailNavNext > img').click(nextThumbnail);//stamp
		//showHideClearSearch($('#clearsearchdetail'));//search?
		doInitializeStamp();//stamp
	});
};