/*globals  $*/
"use strict";
var initializeHome = function (home, user) {
	$(function () {
		var splash, userIsLoggedIn;
		splash =  $('#homeImage');
		userIsLoggedIn = user && user.username;
		home.ready(splash, userIsLoggedIn);
	});
};