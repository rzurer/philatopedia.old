'use strict';
var client, imagePath;
imagePath = '/home/zurer/projects/philatopedia/public/temp'; 
function initialize(xmlrpc) {
    client = xmlrpc.createClient("http://localhost:31128/RPC");
}
function addImage(dbId, filename, fileIsUrl, callback) {
    var id;
    filename = imagePath + filename.substring(filename.lastIndexOf('/'));
    client.methodCall('getDbImgCount', [dbId], function (error, value) {
        id = value + 1;
        client.methodCall('addImg', [dbId, id, filename, false], function (error, value) {
            if(error){
                throw (error);
            }
            if (callback) {
                callback(id, value);
            }
        });
    });
}
function removeImage(dbId, id, callback) {
    client.methodCall('removeImg', [dbId, id], function (error, value) {
        if(error){
            if (callback) {
                callback(id, value);
            }
            return;
        }
        if (callback) {
            callback(id, value);
        }
    });
}
function getMostSimilarImages(id, callback){
    client.methodCall('queryImgID', [1, id, 20], function (error, value) {
        if(error){
            throw (error);
        }
        if (callback) {
            callback(value);
        }
    });
}
exports.initialize = initialize;
exports.addImage = addImage;
exports.removeImage = removeImage;
exports.getMostSimilarImages = getMostSimilarImages;