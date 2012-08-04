"use strict";
var uicontrols = {};
exports.MainMenu =  {
    setuicontrols : function (controls, urls) {
        uicontrols.menu = controls.menu;
        uicontrols.homeLink  = controls.homeLink;
        uicontrols.sandboxLink = controls.sandboxLink;
        uicontrols.usercollectionLink = controls.usercollectionLink;
        uicontrols.addLink = controls.addLink;
        uicontrols.signinLink = controls.signinLink;
        uicontrols.signoutLink = controls.signoutLink;
        uicontrols.homeLink.attr('href', urls.home);
        uicontrols.sandboxLink.attr('href',  urls.sandbox);
        uicontrols.usercollectionLink.attr('href',  urls.usercollection);
        uicontrols.addLink.attr('href',  urls.add);
        uicontrols.signinLink.attr('href', urls.poundsign);
        uicontrols.signoutLink.attr('href', urls.poundsign);
    },
    setActiveMenu : function (url) {
        uicontrols.menu.children('li').removeClass();
        var child = uicontrols.menu.find('a[href="' + url + '"]');
        child.parent().addClass('active');
    },
    initialize : function (controls, urls) {
        this.setuicontrols(controls, urls);
    }
};
