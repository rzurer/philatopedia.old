/*globals  $*/
"use strict";
var initializeStamp = function () {
	$(function () {
		$('#clearsearchdetail').click(function () {
			clearSearch();
			showHideClearSearch($('#clearsearchdetail'));
			displayThumbnails();
		});
		$('.updateStamp').blur(function () {
			updateStamp(this); 
		});
		$('.goToPreviousCatalog').click(function () {
			sliders[0].goToPrev();
		});
		$('.goToNextCatalog').click(function () {
			sliders[0].goToNext();
		});
		$('.addOrUpdateIdentifier').blur(addOrUpdateIdentifier);
		$('.setImageCaption').blur(function () {
			imageCarousel.setImageCaption(this);
		});
		$('#navFirst').click(function () {
			imageCarousel.navigateTo("first");
		});
		$('#navPrevious').click(function () {
			imageCarousel.navigateTo("previous");
		});
		$('#navNext').click(function () {
			imageCarousel.navigateTo("next");
		});
		$('#navLast').click(function () {
			imageCarousel.navigateTo("last");
		});
		$('#navRemove').click(removeImage); //broken
		$('#currencySymbol').blur(setCurrencySymbol);
		$('#currency').blur(setCurrencyName);
		$('#addCategory').click(addCategory);
		$('#addCollection').click(addCollection);
		$("#collectionsource").blur(function () {
			leaveCollection(this);
		});
		$("#tagsource").blur(function () {
			leaveTag(this);
		});
		$('#addTag').click(addTag);
		$('.thumbnailNavPrevious > img').click(previousThumbnail);
		$('.thumbnailNavNext > img').click(nextThumbnail);
		showHideClearSearch($('#clearsearchdetail'));
		doInitializeStamp();
	});
};