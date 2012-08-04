/*jslint browser: true*/
/*global  window, localStorage, $*/
"use strict";
var Common = require('./modules/common').Common;
Common.initialize(localStorage);
var Picklists = require('./modules/picklists').Picklists,
    Urls = require('./modules/urls').Urls,
    postFunction = function (url, input, callback) {
        $.ajax({
            type: 'POST',
            url: url,
            data: input,
            success: function (output) {
                if (callback) {
                    callback(output);
                }
            }
        });
    },
    initializePicklists = function () {
        var picklistsRouter = require('./modules/routers').PicklistsRouter;
        picklistsRouter.initialize(Urls, postFunction);
        Picklists.initialize(picklistsRouter, Common);
    },
    initializeMainLayout = function () {
        var internals = require("./modules/_layout").privateMembers,
            loginControl = require('./modules/logincontrol'),
            mainMenu = require('./modules/menus').MainMenu,
            mainLayoutRouter = require('./modules/routers').MainLayoutRouter,
            mainLayout = require('./modules/layout').MainLayout;
        mainLayoutRouter.initialize(Urls, window, postFunction);
        internals.initialize(Urls, loginControl, mainMenu, mainLayoutRouter);
        mainLayout.initialize(internals);
        window.mainlayout = mainLayout;
    },
    initializeUserCollection = function () {
        var internals = require('./modules/_usercollection').privateMembers,
            tags = require("./modules/tags").tags,
            tagInternals = require("./modules/_tags").internals,
            userCollection = require('./modules/usercollection').UserCollection,
            searchInternals = require('./modules/_search').privateMembers,
            search = require('./modules/search').search,
            stampRouter = require('./modules/routers').StampRouter,
            searchRouter = require('./modules/routers').SearchRouter;
        tags.initialize(tagInternals);
        search.initialize(searchInternals, Common, searchRouter, tags);
        stampRouter.initialize(Urls, postFunction);
        searchRouter.initialize(Urls, postFunction);
        internals.initialize(Picklists, tags, search, Common, stampRouter);
        userCollection.initialize(internals);
        window.userCollection = userCollection;
    },
    initialize = function () {
        initializePicklists();
        initializeMainLayout();
        initializeUserCollection();
    };
initialize();



