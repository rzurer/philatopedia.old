"use strict";
exports.mainLayoutRouter = function (urls, window, postFunction) {
    return {
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
          postFunction(urls.login, { username: username }, callback);
        },
        logout : function (callback) {
            postFunction(urls.logout, {}, callback);
        }
    };
};
exports.picklistsRouter = function (urls, postFunction) {
    return {
        getDistinctTags : function (callback) {
            postFunction(urls.getDistinctTags, {}, callback);
        },
        getDistinctCollections : function (callback) {
            postFunction(urls.getDistinctCollections, {}, callback);
        },
        getAllCountryNames : function (callback) {
            postFunction(urls.getAllCountryNames, {}, callback);
        }
    };
};
exports.searchRouter = function (urls, postFunction) {
    return {
        filterStampListings : function (query, callback) {
            if (!query) {
                return;
            }
            var data = { collection: query.collection, tags: query.tags};
            postFunction(urls.filterStampListings, data, callback);
        }
    };
};
exports.stampRouter = function (urls, window, postFunction) {
    return {
        getStamp : function (stampId, callback) {
            postFunction(urls.getStamp, { id: stampId }, callback);
        },
        submitToSandbox : function (stampId, isValid, callback) {
            this.getStamp(stampId, function (stamp) {
                if (!isValid(stamp)) {
                    return;
                }
                postFunction(urls.submitToSandbox, { stamp: stamp}, callback);
            });
        },
        goToStamp : function (stampId) {
            window.location = '/stamps/?id=' + stampId;
        },
        deleteStamp : function (id, callback) {
            postFunction(urls.deleteStamp, { id: id}, callback);
        }
    };
};
