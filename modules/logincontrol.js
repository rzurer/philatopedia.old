"use strict";
exports.loginControl = function (router) {
    var uicontrols;
    function hideLogin() {
        uicontrols.logincontainer.slideUp("normal");
    }
    function getWelcomeText(username) {
        return username && username.length > 0 ? "welcome "  + username : '';
    }
    function setWelcome(username) {
        uicontrols.welcome.hide();
        uicontrols.welcome.text(getWelcomeText(username));
        uicontrols.welcome.show('slow');
    }
    function doSetLoginControls(username) {
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
    }
    function logout() {
        router.logout(doSetLoginControls);
        router.home();
    }
    function login(username) {
        doSetLoginControls(username);
        if (username) {
            uicontrols.usernameInput.removeClass('hover');
            router.home();
            return;
        }
        uicontrols.usernameInput.addClass('hover');
        uicontrols.usernameInput.focus();
    }
    function doLogin() {
        var username = uicontrols.usernameInput.val();
        router.login(username, login);
        return false;
    }
    function showLogin() {
        uicontrols.logincontainer.slideDown("normal");
        uicontrols.usernameInput.val('');
        uicontrols.usernameInput.focus();
        return false;
    }
    function returnFalse() {
        return false;
    }
    return {
        initializeControls : function (controls) {
            uicontrols = controls;
        },
        setClickEvents : function () {
            uicontrols.loginMenu.click(showLogin);
            uicontrols.logoutMenu.click(logout);
            uicontrols.body.click(hideLogin);
            uicontrols.usernameInput.click(returnFalse);
            uicontrols.loginButton.click(doLogin);
        },
        setLoginControls : function (username) {
            doSetLoginControls(username);
        },
    };
};