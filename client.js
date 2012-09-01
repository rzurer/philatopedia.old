/*jslint browser: true*/
/*global  window, localStorage, $*/
"use strict";
var postFunction = function (url, input, callback) {
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
    common =  require('./modules/common').common(localStorage),
    urls = require('./modules/urls').urls,
    picklistsRouter = require('./modules/routers').picklistsRouter(urls, postFunction),
    picklists = require('./modules/picklists').picklists(common, picklistsRouter),
    initializeLayout =  function () {
        var mainLayoutRouter = require('./modules/routers').mainLayoutRouter(urls, window, postFunction),
            loginControl = require('./modules/logincontrol').loginControl(mainLayoutRouter),
            mainMenu = require('./modules/mainMenu').mainMenu(urls),
            layout = require("./modules/layout").layout(loginControl, mainMenu);
        window.mainlayout = layout;
    },
    initializeUserCollection = function () {
        var _tags = require("./modules/_tags")._tags(),
            tags = require("./modules/tags").tags(_tags),
            _search = require('./modules/_search')._search(tags, common),
            searchRouter = require('./modules/routers').searchRouter(urls, postFunction),
            search = require('./modules/search').search(_search, common, searchRouter),
            stampRouter = require('./modules/routers').stampRouter(urls, window, postFunction),
            _usercollection = require('./modules/_usercollection')._usercollection(picklists, tags, search, common, stampRouter, $);
        window.userCollection = require('./modules/usercollection').userCollection(_usercollection);
    },
    initialize = function () {
        initializeLayout();
        initializeUserCollection();
    };
initialize();


