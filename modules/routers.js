"use strict";
var urls, window, mainLayoutRouterPostFunction, picklistsRouterPostFunction, searchRouterPostFunction, stampRouterPostFunction;
exports.MainLayoutRouter = {
    initialize : function (Urls, Window, PostFunction) {
        urls = Urls;
        window = Window;
        mainLayoutRouterPostFunction = PostFunction;
    },
    home : function () {
        window.location = urls.home;
    },
    sandbox : function () {
        window.location = urls.sandbox;
    },
    usercollection : function () {
        window.location = urls.usercollection;
    },
    add : function () {
        window.location = urls.add;
    },
    login : function (username, callback) {
        mainLayoutRouterPostFunction(urls.login, { username: username }, callback);
    },
    logout : function (callback) {
        mainLayoutRouterPostFunction(urls.logout, {}, callback);
    },
};
exports.PicklistsRouter = {
    initialize : function (Urls, PostFunction) {
        urls = Urls;
        picklistsRouterPostFunction = PostFunction;
    },
    getDistinctTags : function (callback) {
        picklistsRouterPostFunction(urls.getDistinctTags, {}, callback);
    },
    getDistinctCollections : function (callback) {
        picklistsRouterPostFunction(urls.getDistinctCollections, {}, callback);
    },
    getAllCountryNames : function (callback) {
        picklistsRouterPostFunction(urls.getAllCountryNames, {}, callback);
    },
};
exports.SearchRouter = {
    initialize : function (Urls, PostFunction) {
        urls = Urls;
        searchRouterPostFunction = PostFunction;
    },
    filterStampListings : function (query, callback) {
        if (!query) {
            return;
        }
        var data = { collection: query.collection, tags: query.tags};
        searchRouterPostFunction(urls.filterStampListings, data, callback);
    }
};
exports.StampRouter = {
    initialize : function (Urls, PostFunction) {
        urls = Urls;
        stampRouterPostFunction = PostFunction;
    },
    getStamp : function (stampId, callback) {
       stampRouterPostFunction(urls.getStamp, { id: stampId }, callback);
    },
    submitToSandbox : function (stampId, isValid, callback) {
        this.getStamp(stampId, function (stamp) {
            if (!isValid(stamp)) {
                return;
            }
            stampRouterPostFunction(urls.submitToSandbox, { stamp: stamp}, callback);
        })
    },
    goToStamp : function (stampId) {
        window.location = '/stamps/?id=' + stampId;
    },
    deleteStamp : function (id, callback) {
        stampRouterPostFunction(urls.deleteStamp, { id: id}, callback);
    }
};
