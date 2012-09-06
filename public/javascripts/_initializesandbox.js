/*globals  $, window*/
"use strict";
var initializeSandbox = function (array) {
	var setSandboxImages = function () {
			var i, stampId, defaultImageSrc, img;
			for (i = 0; i < array.length; i = i + 1) {
				stampId = array[i].stampId;
				defaultImageSrc = array[i].defaultImageSrc;
				img = $('.stampitem[id="' + stampId + '"] > div > img');
				img.attr('src', defaultImageSrc);
			}
			$('.stampitem > div > img').each(function () {
				if (this.src.length === 0) {
					this.src = '/images/nostamp.png';
				}
			});
		},
		truncate = function () {
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
	$(function () {
		setSandboxImages();
		$(window).load(function () {
			setTimeout(truncate, 50);
		});
	});
};