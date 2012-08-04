"use strict";
var getWelcomeText = function (username) {
        return username && username.length > 0 ? "welcome "  + username : '';
    },
    uicontrols,
    layoutrouter,
    self,
    LoginControl = {
        initialize : function (controls, router) {
            uicontrols = controls;
            layoutrouter = router;
            self = this;
            this.showLogin = function () {
                uicontrols.logincontainer.slideDown("normal");
                uicontrols.usernameInput.val('');
                uicontrols.usernameInput.focus();
                return false;
            };
            this.hideLogin = function () {
                uicontrols.logincontainer.slideUp("normal");
            };
            this.setWelcome = function (username) {
                uicontrols.welcome.hide();
                uicontrols.welcome.text(getWelcomeText(username));
                uicontrols.welcome.show('slow');
            };
            this.logout = function () {
                layoutrouter.logout(self.setLoginControls);
                layoutrouter.home();
            };
            this.login = function (username) {
                self.setLoginControls(username);
                if (username) {
                    uicontrols.usernameInput.removeClass('hover');
                    layoutrouter.home();
                    return;
                }
                uicontrols.usernameInput.addClass('hover');
                uicontrols.usernameInput.focus();
            };
            this.doLogin = function () {
                var username = uicontrols.usernameInput.val();
                layoutrouter.login(username, self.login);
                return false;
            };
        },
        setClickEvents : function () {
            uicontrols.loginMenu.click(this.showLogin);
            uicontrols.logoutMenu.click(this.logout);
            uicontrols.body.click(this.hideLogin);
            uicontrols.usernameInput.click(function () { return false; });
            uicontrols.loginButton.click(this.doLogin);
        },
        setLoginControls : function (username) {
            if (username) {
                uicontrols.logoutMenu.show();
                uicontrols.loginMenu.hide();
                this.hideLogin();
                this.setWelcome(username);
            } else {
                uicontrols.loginMenu.show();
                uicontrols.logoutMenu.hide();
                this.setWelcome();
            }
        },
    };
exports.initialize = LoginControl.initialize;
exports.setLoginControls = LoginControl.setLoginControls;
exports.setClickEvents = LoginControl.setClickEvents;
