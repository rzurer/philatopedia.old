/*globals  $*/
"use strict";
var initializeHome = function (user) {
	$(function () {
		var splash, userIsLoggedIn;
		splash =  $('#homeImage');
		userIsLoggedIn = user && user.username;
		window.home.ready(splash, userIsLoggedIn);
	});
};