/*globals  $, window*/
"use strict";
var initializelayout = function (user) {
    $(function () {
        var username = user && user.username ? user.username : '',
            loginControls = {
                body : $('body'),
                usernameInput : $('#usernameInput'),
                logincontainer : $('.logincontainer'),
                welcome : $("#welcome"),
                loginMenu : $('#loginMenu'),
                logoutMenu : $('#logoutMenu'),
                loginButton : $('#loginButton'),
            },
            menuControls = {
                menu : $('#menu'),
                homeLink : $('#home'),
                sandboxLink : $('#sandbox'),
                usercollectionLink : $('#usercollection'),
                addLink : $('#add'),
                signinLink : $('#signin'),
                signoutLink : $('#signout')
            };
        window.mainlayout.ready(loginControls, menuControls, username, window.location.pathname);
    });
};