'use strict';
var local = false,
    application,
    express = require('express'),//3.0.0rc2
    fs = require('fs'),
    jade = require('jade'),//0.27.0
	mongoose = require('mongoose'),//2.7.3
    imagemagick = require('imagemagick'),//0.1.2
	xmlrpc = require('xmlrpc'),//1.0.2
	flash = require('connect-flash'),//0.1.0
	browserify = require('browserify'), //1.14.5
    url = local ? 'mongodb://localhost/philatopedia': "mongodb://nodejitsu:9149931d667e323b3c0b16653335f61b@alex.mongohq.com:10021/nodejitsudb229917654737",
    model = require('./models/model'),
    routes = require('./routes'),
    config = require('./config'),
    app = module.exports = express();
model.initialize(mongoose, xmlrpc, url);
config.configure(app, express, flash, browserify);
routes.initialize(app, fs, model, imagemagick);
application = app.listen(3000);
if(local) {
    console.log("url: " + url);
    console.log('Express service listening on port %d, environment: %s', application.address().port, app.settings.env);   
}
