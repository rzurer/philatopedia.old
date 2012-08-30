"use strict";
exports.loginControl = function (router) {
    var uicontrols,
        showLogin = function () {
            uicontrols.logincontainer.slideDown("normal");
            uicontrols.usernameInput.val('');
            uicontrols.usernameInput.focus();
            return false;
        },
        hideLogin = function () {
            uicontrols.logincontainer.slideUp("normal");
        },
        getWelcomeText = function (username) {
            return username && username.length > 0 ? "welcome "  + username : '';
        },
        setWelcome = function (username) {
            uicontrols.welcome.hide();
            uicontrols.welcome.text(getWelcomeText(username));
            uicontrols.welcome.show('slow');
        },
        doSetLoginControls = function (username) {
            if (username) {
                uicontrols.logoutMenu.show();
                uicontrols.loginMenu.hide();
                hideLogin();
                setWelcome(username);
            } else {
                uicontrols.loginMenu.show();
                uicontrols.logoutMenu.hide();
                setWelcome();
            }
        },
        logout = function () {
            router.logout(doSetLoginControls);
            router.home();
        },
        login = function (username) {
            doSetLoginControls(username);
            if (username) {
                uicontrols.usernameInput.removeClass('hover');
                router.home();
                return;
            }
            uicontrols.usernameInput.addClass('hover');
            uicontrols.usernameInput.focus();
        },
        doLogin = function () {
            var username = uicontrols.usernameInput.val();
            router.login(username, login);
            return false;
        };
    return {
        initializeControls : function (controls) {
            uicontrols = controls;
        },
        setClickEvents : function () {
            uicontrols.loginMenu.click(showLogin);
            uicontrols.logoutMenu.click(logout);
            uicontrols.body.click(hideLogin);
            uicontrols.usernameInput.click(function () { return false; });
            uicontrols.loginButton.click(doLogin);
        },
        setLoginControls : function (username) {
            doSetLoginControls(username);
        },
    };
};