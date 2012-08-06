'use strict';
function initialize(app, fs, model, imagemagick) {
    var imageHelper;
    imageHelper = require('./imageHelper');
    imageHelper.initialize(imagemagick);
    function createStampIdDefaultImageSrcArray(stamps) {
        var stamp, displayProperties, displayProperty, imageInfo, arr, i, j, k;
        arr = [];
        for (i = 0; i < stamps.length; i += 1) {
            stamp = stamps[i];
            displayProperties = stamp.displayProperties;
            if (displayProperties) {
                for (j = 0; j < displayProperties.length; j += 1) {
                    displayProperty = displayProperties[j];
                    if (displayProperty.name === 'defaultimage') {
                        if (stamp.imageInfos) {
                            for (k = 0; k < stamp.imageInfos.length; k += 1) {
                                imageInfo = stamp.imageInfos[k];
                                if (String(imageInfo._id) === displayProperty.value) {
                                    arr.push({stampId: stamp._id, defaultImageSrc : imageInfo.url});
                                }
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }
    function createStampIdDefaultImageIdImageSrcArray(stamps) {
        var stamp, displayProperties, displayProperty, imageInfo, arr, i, j, k;
        arr = [];
        for (i = 0; i < stamps.length; i += 1) {
            stamp = stamps[i];
            displayProperties = stamp.displayProperties;
            if (displayProperties) {
                for (j = 0; j < displayProperties.length; j += 1) {
                    displayProperty = displayProperties[j];
                    if (displayProperty.name === 'defaultimage') {
                        if (stamp.imageInfos) {
                            for (k = 0; k < stamp.imageInfos.length; k += 1) {
                                imageInfo = stamp.imageInfos[k];
                                if (String(imageInfo._id) === displayProperty.value) {
                                    arr.push({stampId : stamp._id, imageId: imageInfo._id, defaultImageSrc : imageInfo.url});
                                }
                            }
                        }
                    }
                }
            }
        }
        return arr;
    }
    function getStamps(req, callback) {
        var collection, tags, wantcollection, wanttags, userId;
        userId = req.session.user._id;
        collection = req.param('collection');
        tags = req.param('tags');
        wantcollection = collection && collection.length && collection.length > 0 ? 1 : 0;
        wanttags = tags && tags.length && tags.length > 0 ? 1 : 0;
        if (wantcollection && wanttags) {
            model.stamp.getStampsByCollectionAndTags(userId, collection, tags, callback);
            return;
        }
        if (wantcollection) {
            model.stamp.getStampsByCollection(userId, collection, callback);
            return;
        }
        if (wanttags) {
            model.stamp.getStampsByTags(userId, tags, callback);
            return;
        }
        model.stamp.getAllStamps(userId, callback);
    }
    function loadUser(req, res, next) {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/');
        }
    }
    function loadAdminUser(req, res, next) {
        if (req.session.user && req.session.user.isAdmin) {
            next();
        } else {
            res.redirect('/');
        }
    }
    function getUser(req) {
        return req.session.user || {};
    }
    function archiveImageFile(imageUrl, callback) {
        var filename, archiveFilename, fileStats, tempPath, archivePath;
        tempPath = 'public/temp/';
        archivePath = 'public/imagearchive/';
        filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        archiveFilename = 'orig_' + filename;
        fs.unlink(tempPath + filename, function (err) {
            if (err) {
                throw err;
            }
            fs.rename(tempPath + archiveFilename, archivePath + archiveFilename, function (err) {
                if (err) {
                    throw err;
                }
                callback();
            });
        });
    }
    app.get('/', function (req, res) {
        res.render('index', {user: getUser(req)});
    });
    app.get('/currencies', loadUser, function (req, res) {
        res.render('currencies', {user:  getUser(req)});
    });
    app.get('/stamps/usercollection', loadUser, function (req, res) {
        var callback, arr;
        callback = function (stamps) {
            arr = createStampIdDefaultImageSrcArray(stamps);
            res.render('stamps/usercollection', {stamps : stamps, arr : arr, user: getUser(req)});
        };
        getStamps(req, callback);
    });
    app.get('/stamps/sandbox', loadUser, function (req, res) {
        model.referencestamp.getAllSandboxStamps(function (sandboxstamps) {
            var arr;
            arr = createStampIdDefaultImageSrcArray(sandboxstamps);
            res.render('stamps/sandbox', {sandboxstamps : sandboxstamps, arr : arr, user: getUser(req)});
        });
    });
    app.get('/stamps/new', loadUser, function (req, res) {
        var stamp, user;
        user = getUser(req);
        stamp = new model.stamp.Stamp();
        stamp.userId = user._id;
        model.catalog.getAllCatalogs(function (catalogs) {
            res.render('stamps/detail', {stamp: stamp, cataloglistings : catalogs, user: user});
        });
    });
    app.get('/stamps', loadUser, function (req, res) {
        var id, stamp, userId;
        userId = req.session.user._id;
        id = req.param('id');
        stamp = model.stamp.getStamp(userId, id, function (stamp) {
            model.catalog.getAllCatalogs(function (catalogs) {
                res.render('stamps/detail', {stamp: stamp, cataloglistings : catalogs, user: getUser(req)});
            });
        });
    });
    app.get('/admin', loadAdminUser, function (req, res) {
        var catalog, newUser;
        catalog = new model.catalog.Catalog();
        newUser = new model.user.User();
        model.catalog.getAllCatalogs(function (catalogs) {
            model.user.getAllUsers(function (users) {
                res.render('admin', {newUser: newUser, catalog: catalog, catalogs : catalogs, users : users, user: getUser(req)});
            });
        });
    });
    app.get('/stamps/:key/:value', loadUser, function (req, res) {
        var key, value, arr;
        key =  req.param('key');
        value =  req.param('value');
        model.stamp.getStampsByKeyAndValue(key, value, function (stamps) {
            arr = createStampIdDefaultImageSrcArray(stamps);
            res.render('stamps/usercollection', {stamps : stamps, arr : arr, user: getUser(req)});
        });
    });
    app.get('/stamps/albumpage', loadUser, function (req, res) {
        res.render('stamps/albumpage', {user: getUser(req)});
    });
    app.get('/upload', loadUser, function (req, res) {
        res.render('stamps/upload');
    });
    app.get('/test', loadAdminUser,  function (req, res) {
        res.render('test', {user: getUser(req)});
    });
    app.post('/getUser', function (req, res) {
        res.send(req.session.user);
    });
    app.post('/login', function (req, res) {
        var username;
        req.session.user = null;
        username = req.param('username');
        model.user.getUser(username, function (user) {
            req.session.user = user;
            res.send(req.session.user);
        });
    });
    app.post('/logout', function (req, res) {
        req.session.user = null;
        res.send(req.session.user);
    });
    app.post('/stamps', function (req, res) {
        var id, stamp, userId;
        userId = req.session.user._id;
        id = req.param('id');
        stamp = model.stamp.getStamp(userId, id, function (stamp) {
            model.catalog.getAllCatalogs(function (catalogs) {
                res.render('stamps/_stamp', {stamp: stamp, cataloglistings : catalogs});
            });
        });
    });
    app.post('/getStamp', function (req, res) {
        var id, stamp, userId;
        userId = req.session.user._id;
        id = req.param('id');
        stamp = model.stamp.getStamp(userId, id, function (stamp) {
            res.send(stamp);
        });
    });
    app.post('/filterStampListings', function (req, res) {
        var getStampsCallback;
        getStampsCallback = function (stamps) {
            res.render("stamps/_stamplisting", {stamps : stamps}, function (err, html) {
                res.send(html);
            });
        };
        getStamps(req, getStampsCallback);
    });
    app.post('/getStampIdDefaultImageIdImageSrcArray', function (req, res) {
        var callback;
        callback = function (stamps) {
            var array;
            array = createStampIdDefaultImageIdImageSrcArray(stamps);
            res.send(array);
        };
        getStamps(req, callback);
    });
    app.post('/submitToSandbox', function (req, res) {
        var stamp = req.param('stamp');
        model.referencestamp.submitToSandbox(stamp, function () {
            res.send({message: "success"});
        });
    });
    app.post('/upsertStamp', function (req, res) {
        var stamp = req.param('stamp');
        model.stamp.upsertStamp(stamp._id, stamp, function (data) {
            res.send(data);
        });
    });
    app.post('/deleteStamp', function (req, res) {
        var id;
        id = req.param('id');
        model.stamp.deleteStamp(id, function (data) {
            res.send(data);
        });
    });
    app.post('/identify', function (req, res) {
        var url;
        url = req.param('url');
        imageHelper.getFeatures(url, function (features) {
            res.send({features: features});
        });
    });
    app.post('/rename-original-file', function (req, res) {
        var originalFileName, newFilename, tempPath;
        tempPath = 'public/temp/';
        originalFileName = tempPath + req.param('originalFileName');
        newFilename = tempPath + 'orig_' + req.param('tempFileName');
        fs.rename(originalFileName, newFilename, function (err) {
            if (err) {
                throw err;
            }
            res.send('renamed');
        });
    });
    app.post('/save-temp-file', function (req, res) {
        var url;
        url = req.param('url');
        imageHelper.saveTempFile(url, function (tempPath, height, width) {
            res.send({tempPath : tempPath, height: height, width: width});
        });
    });
    function removeImageFromImgSeek(dbId, imgSeekId, callback) {
        model.stamp.removeImageFromImgSeek(dbId, imgSeekId, function (result) {
            callback('removed image # ' + result);
        });
    }
    app.post('/removeImgSeekId', function (req, res) {
        var dbId, imgSeekId;
        dbId = req.param('dbId');
        imgSeekId = req.param('imgSeekId');
        removeImageFromImgSeek(dbId, imgSeekId, function (removed) {
            res.send({removed: removed});
        });
    });
    app.post('/removeStampImage', function (req, res) {
        var stampId, currentImageId, result, dbId;
        stampId = req.param('stampId');
        currentImageId = req.param('currentImageId');
        dbId = 1;
        model.stamp.removeStampImage(dbId, stampId, currentImageId, function (result) {
            archiveImageFile(result.imageUrl, function () {
                res.send(result);
            });
        });
    });
    // app.post('/removeImageFile', function (req, res) {
    //     var filename, fileStats, tempPath;
    //     filename = req.param('filename');
    //     tempPath = 'public/temp/';
    //     try {
    //             fileStats = fs.statSync(tempPath + filename);
    //             if (fileStats.isFile()) {
    //                 fs.unlinkSync(tempPath + filename);
    //             }
    //         } catch (e) {
    //     }
    //     res.send("temp files removed");
    // });
    app.post('/uploadTempFile', function (req, res) {
        var file, oldPath, newPath;
        if (req.files) {
            file = req.files.file[0];
            oldPath = file._writeStream.path;
            newPath = 'public/temp/' + file.filename;
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    throw err;
                }
                res.send(file.filename + ' was uploaded');
            });
        }
    });
    app.post('/getCatalogs', function (req, res) {
        model.catalog.getAllCatalogs(function (catalogs) {
            res.send(catalogs);
        });
    });
    app.post('/getUsers', function (req, res) {
        model.user.getAllUsers(function (users) {
            res.send(users);
        });
    });
    app.post('/getAllImages', function (req, res) {
        model.stamp.getAllImages(function (images) {
            res.send(images);
        });
    });
    app.post('/upsertCatalog', function (req, res) {
        var catalog, newCatalog;
        catalog = req.param('catalog');
        model.catalog.upsertCatalog(catalog);
        newCatalog = new model.catalog.Catalog();
        res.send(newCatalog);
    });
    app.post('/upsertUser', function (req, res) {
        var user;
        user = req.param('user');
        model.user.upsertUser(user._id, user);
        res.end();
    });
    app.post('/deleteCatalog', function (req, res) {
        var id;
        id = req.param('id');
        model.catalog.deleteCatalog(id, function () {
            model.catalog.getAllCatalogs(function (catalogs) {
                res.send(catalogs);
            });
        });
    });
    app.post('/deleteUser', function (req, res) {
        var id;
        id = req.param('id');
        model.user.deleteUser(id, function () {
            model.user.getAllUsers(function (users) {
                res.send(users);
            });
        });
    });
    //currencies   countries
    app.post('/addCurrencyToCountry', function (req, res) {
        var countryCurrency;
        countryCurrency = req.param('countryCurrency');
        model.country.addCurrencyToCountry(countryCurrency, function (country) {
            res.send(country);
        });
    });
    app.post('/getDistinctCurrencyNames', function (req, res) {
        model.country.getDistinctCurrencyNames(function (currencyNames) {
            res.send(currencyNames);
        });
    });
    app.post('/getDistinctCurrencySymbols', function (req, res) {
        model.country.getDistinctCurrencySymbols(function (currencySymbols) {
            res.send(currencySymbols);
        });
    });

    app.post('/getAllCountriesWithCurrencies', function (req, res) {
        model.country.getAllCountriesWithCurrencies(function (countries) {
            res.send(countries);
        });
    });
    app.post('/updateCurrencies', function (req, res) {
        var currencies, id;
        id = req.param('id');
        currencies = req.param('currencies');
        model.country.updateCurrencies(id, currencies, function () {
            res.send("currencies updated");
        });
    });
    app.post('/getCountryCurrencies', function (req, res) {
        var countryName;
        countryName = req.param('countryName');
        model.country.getCountryCurrencies(countryName, function (currencies) {
            res.send({currencies : currencies});
        });
    });
    app.post('/saveCountries', function (req, res) {
        var countries;
        countries = req.param('countries');
        model.country.saveCountries(countries, function () {
            res.send("countries saved");
        });
    });
    app.post('/removeCountries', function (req, res) {
        model.country.removeCountries(function () {
            res.send("countries removed");
        });
    });
    app.post('/getAllCountryNames', function (req, res) {
        model.country.getAllCountryNames(function (countryNames) {
            res.send(countryNames);
        });
    });
    app.post('/getAllCountries', function (req, res) {
        model.country.getAllCountries(function (countries) {
            res.send(countries);
        });
    });
    //tags

    app.post('/getDistinctTags', function (req, res) {
        model.stamp.getDistinctTags(function (tags) {
            res.send({tags: tags});
        });
    });
    app.post('/getTagCount', function (req, res) {
        var tag;
        tag = req.param('tag');
        model.stamp.getTagCount(tag, function (data) {
            res.send(data);
        });
    });
    app.post('/getCollectionCount', function (req, res) {
        var collection;
        collection = req.param('collection');
        model.stamp.getCollectionCount(collection, function (data) {
            res.send(data);
        });
    });
    app.post('/getDistinctCollections', function (req, res) {
        model.stamp.getDistinctCollections(function (collections) {
            res.send({collections: collections});
        });
    });
    app.post('/getMostSimilarImages', function (req, res) {
        var id;
        id = req.param('id');
        model.stamp.getMostSimilarImages(id, function (value) {
            res.send({array: value});
        });
    });
    app.post('/getImagesByImgSeekId', function (req, res) {
        var ids = req.param('ids');
        model.stamp.getImagesByImgSeekId(ids, function (value) {
            res.send(value);
        });
    });
    app.post('/upload', function (req, res) {
        var i, len, file, upload, oldPath, newPath;
        if (req.files) {
            file = req.files.file[0];
            if (Array.isArray(file)) {
                len = req.files.file[0].length;
                for (i = 0; i < len; i = i + 1) {
                    upload = req.files.file[0][i];
                    oldPath = upload._writeStream.path;
                    newPath = 'uploads/' + upload.filename;
                    if (upload.filename) {
                        fs.rename(oldPath, newPath, function (err) {
                            if (err) {
                                throw err;
                            }
                            res.send('image uploaded');
                        });
                    }
                }
            } else {
                if (file.filename) {
                    oldPath = file._writeStream.path;
                    newPath = 'uploads/' + file.filename;
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) {
                            throw err;
                        }
                        res.send('image uploaded');
                    });
                }
            }
        }
    });
}
exports.initialize = initialize;