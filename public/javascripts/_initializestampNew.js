/*globals  $, doInitializeStamp*/
"use strict";
var initializeStamp = function (stamp, search, sliders, imageCarousel, collections, tags) {
	$(function () {
		var controls = {
				clearsearch : $('#clearsearchdetail'),
				updateStampControls : $('.updateStamp'),
				goToPreviousCatalog : $('.goToPreviousCatalog'),
				goToNextCatalog : $('.goToNextCatalog'),
				addOrUpdateIdentifier : $('.addOrUpdateIdentifier'),
				setImageCaption : $('.setImageCaption'),
				navFirst : $('#navFirst'),
				navPrevious : $('#navPrevious'),
				navNext : $('#navNext'),
				navLast : $('#navLast'),
				navRemove : $('#navRemove'),
				currencySymbol : $('#currencySymbol'),
				currency : $('#currency'),
				addCategory : $('#addCategory'),
				addCollection : $('#addCollection'),
				collectionsource : $('#collectionsource'),
				tagsource : $('#tagsource'),
				addTag : $('#addTag'),
				thumbnailNavPrevious : $('.thumbnailNavPrevious > img'),
				thumbnailNavNext : $('.thumbnailNavNext > img')
			},
			assignEventHandlers = function () {
				controls.clearsearch.click(function () {
					search.clearSearch();
					search.showHideClearSearch(this);
					stamp.displayThumbnails();
				});
				controls.updateStampControls.blur(function () {
					stamp.updateStamp(this);
				});
				controls.goToPreviousCatalog.click(function () {
					sliders[0].goToPrev();//sliders
				});
				controls.goToNextCatalog.click(function () {
					sliders[0].goToNext();//sliders
				});
				controls.addOrUpdateIdentifier.blur(stamp.addOrUpdateIdentifier);
				controls.setImageCaption.blur(function () {
					imageCarousel.setImageCaption(this);//imageCarousel
				});
				controls.navFirst.click(function () {
					imageCarousel.navigateTo("first");//imageCarousel
				});
				controls.navPrevious.click(function () {
					imageCarousel.navigateTo("previous");//imageCarousel
				});
				controls.navNext.click(function () {
					imageCarousel.navigateTo("next");//imageCarousel
				});
				controls.navLast.click(function () {
					imageCarousel.navigateTo("last");//imageCarousel
				});
				controls.navRemove.click(stamp.removeImage); //broken refactor to use s3
				controls.currencySymbol.blur(stamp.setCurrencySymbol);//stamp
				controls.currency.blur(stamp.setCurrencyName);//stamp
				controls.addCategory.click(collections.addCategory);//collections
				controls.addCollection.click(collections.addCollection);//collections
				controls.collectionsource.blur(function () {
					collections.leaveCollection(this);//collections
				});
				controls.tagsource.blur(function () {
					tags.leaveTag(this);//tags
				});
				controls.addTag.click(tags.addTag);//tags
				controls.thumbnailNavPrevious.click(stamp.previousThumbnail);//stamp
				controls.thumbnailNavNext.click(stamp.nextThumbnail);//stamp
			};
		assignEventHandlers();
		doInitializeStamp();//stamp
	});
};