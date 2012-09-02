"use strict";
exports.home = function (urls, constants, router) {
	var setImageHover = function (splash, userIsLoggedIn) {
			splash.attr('src', urls.splashSrc);
			if (userIsLoggedIn) {
				splash.attr('title', constants.loggedInSplashTitle);
				splash.click(router.usercollection);
				splash.mouseover(function () {
					splash.addClass('hoverImage');
					splash.css('cursor', 'pointer');
				});
				splash.mouseout(function () {
					splash.removeClass('hoverImage');
					splash.css('cursor', 'auto');
				});
				return;
			}
			splash.attr('title', constants.loggedOutSplashTitle);
		};
	return {
		ready : function (splash, userIsLoggedIn) {
			setImageHover(splash, userIsLoggedIn);
		}
	};
};