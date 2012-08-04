'use strict';
var express = require('express'),
    fs = require('fs'),
    jade = require('jade'),
    model = require('./models/model'),
    routes = require('./routes'),
    config = require('./config'),
    url = 'mongodb://localhost/philatopedia',
    app = module.exports = express();
config.configure(app, express);
model.initialize(url);
routes.initialize(app, fs, model);
// var exec = require('child_process').exec,
//     child = exec('iskdaemon.py',
//     function (error, stdout, stderr) {setTimeout
//         console.log('stdout: ' + stdout);
//         console.log('stderr: ' + stderr);
//         if (error !== null) {
//             console.log('exec error: ' + error);getStampContainer
//         }
//     });
console.log('Express service listening on port %d, environment: %s', app.listen(3000).address().port, app.settings.env);
