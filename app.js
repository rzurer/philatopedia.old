'use strict';
var express = require('express'),
    fs = require('fs'),
    jade = require('jade'),
	mongoose = require('mongoose'),
    imagemagick = require('imagemagick'),
	xmlrpc = require('xmlrpc'),
	flash = require('connect-flash'),
	browserify = require('browserify'),
    url = 'mongodb://localhost/philatopedia',
    model = require('./models/model'),
    routes = require('./routes'),
    config = require('./config'),
    app = module.exports = express();
model.initialize(mongoose, xmlrpc, url);
config.configure(app, express, flash, browserify);
routes.initialize(app, fs, model, imagemagick);
console.log('Express service listening on port %d, environment: %s', app.listen(3000).address().port, app.settings.env);
