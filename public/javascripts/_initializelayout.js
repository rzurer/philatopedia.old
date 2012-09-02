/*globals  $*/
"use strict";
var initializelayout = function (layout, username, currentUrl) {
    $(function () {
        var loginControls, menuControls;
        loginControls = {
            body : $('body'),
            usernameInput : $('#usernameInput'),
            logincontainer : $('.logincontainer'),
            welcome : $("#welcome"),
            loginMenu : $('#loginMenu'),
            logoutMenu : $('#logoutMenu'),
            loginButton : $('#loginButton'),
        };
        menuControls = {
            menu : $('#menu'),
            homeLink : $('#home'),
            sandboxLink : $('#sandbox'),
            usercollectionLink : $('#usercollection'),
            addLink : $('#add'),
            signinLink : $('#signin'),
            signoutLink : $('#signout')
        };
        layout.ready(loginControls, menuControls, username, currentUrl);
    });
};