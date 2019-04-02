/**
 * Request handlers.
 * 
 * @file handler.js
 * @author Sachchidanand
*/

//Dependencies
const _appConst = require('./appConstants');
const _user = require('./user');
const _token = require('./token');
const _check = require('./check');
const _helper = require('./helper');
const _templateDataObject = require('./tempSpecificData');

//Handler module to export
const handler = {};

//Handler for undefined routes
handler.notFound = (data, callback) => {
    //Callback a http status and a payload
    callback(404, {message : 'Page Not Found'});
};

//Handler to ping to server
handler.ping = (data, callback) => {
    //Callback a http status and a payload
    callback(200, {});
};

//User services handler 
handler.user = (data, callback) => {
    if (_appConst.METHOD_LIST.indexOf(data.method) > -1) {
        _user[data.method](data, callback);
    } else {
        callback(405, _appConst.INVALID_METHOD);
    }
};

//Token service handler
handler.token = (data, callback) => {
    if (_appConst.METHOD_LIST.indexOf(data.method) > -1) {
        _token[data.method](data, callback);
    } else {
        callback(405, _appConst.INVALID_METHOD);
    }
};

//Token service handler
handler.check = (data, callback) => {
    if (_appConst.METHOD_LIST.indexOf(data.method) > -1) {
        _check[data.method](data, callback);
    } else {
        callback(405, _appConst.INVALID_METHOD);
    }
};

//Index page handler
handler.index = (data, callback) => {
    if (data.method === 'get') {
        _helper.renderTemplate('index').then( finalHtmlString => {
            callback(_appConst.SUCCESS_CODE, finalHtmlString, 'html');
        }).catch (err => {
            console.log(_appConst.RED_COLOUR ,err);
            callback(_appConst.INTERNAL_SERVER_ERROR, 'undefined', 'html');
        });
    } else {
        callback(_appConst.METHOD_NOT_ALLOWED.code, 'undefined', 'html');
    }
};

//Favicon
handler.favicon = (data, callback) => {
    //Reject any request that is not get
    if (data.method === 'get') {
        //Fetching the favicon data
        _helper.getStaticAsset('favicon.ico').then(favicon => {
            callback(_appConst.SUCCESS_CODE, favicon, 'favicon');
        }).catch(err => {
            console.log(_appConst.RED_COLOUR ,err);
            callback(_appConst.INTERNAL_SERVER_ERROR);
        });
    } else {
        callback(_appConst.METHOD_NOT_ALLOWED.code);
    }
};

//Public assets
handler.public = (data, callback) => {
    //Reject any request that is not get
    if (data.method === 'get') {
        //Get the fiel name being requesed
        const fileName = data.trimmedPath.replace('public/', '').trim();
        if (fileName.length > 0) {
            _helper.getStaticAsset(fileName).then(fileData => {
                //Determine the content type
                let contentType = 'plain';

                //set content type for css
                if (fileName.indexOf('.css') > -1) {
                    contentType = 'css';
                }

                //set content type for css
                if (fileName.indexOf('.png') > -1) {
                    contentType = 'png';
                }

                //set content type for jpg
                if (fileName.indexOf('.jpg') > -1) {
                    contentType = 'jpg';
                }

                //set content type for ico
                if (fileName.indexOf('.ico') > -1) {
                    contentType = 'favicon';
                }
                //Call back response
                callback(_appConst.SUCCESS_CODE, fileData, contentType);
            }).catch(err => {
                console.log(_appConst.RED_COLOUR ,err);
                callback(_appConst.INTERNAL_SERVER_ERROR);
            });
        } else {
            callback(_appConst.NOT_FOUND.code);
        }
    } else {
        callback(_appConst.METHOD_NOT_ALLOWED.code);
    }
};

//Create Account handler
handler.accountCreate = (data, callback) => {
    if (data.method === 'get') {
        _helper.renderTemplate('accountCreate').then( finalHtmlString => {
            callback(_appConst.SUCCESS_CODE, finalHtmlString, 'html');
        }).catch (err => {
            console.log(_appConst.RED_COLOUR ,err);
            callback(_appConst.INTERNAL_SERVER_ERROR, 'undefined', 'html');
        });
    } else {
        callback(_appConst.METHOD_NOT_ALLOWED.code, 'undefined', 'html');
    }
};

//Create session handler
handler.sessionCreate = (data, callback) => {
    if (data.method === 'get') {
        _helper.renderTemplate('sessionCreate').then( finalHtmlString => {
            callback(_appConst.SUCCESS_CODE, finalHtmlString, 'html');
        }).catch (err => {
            console.log(_appConst.RED_COLOUR ,err);
            callback(_appConst.INTERNAL_SERVER_ERROR, 'undefined', 'html');
        });
    } else {
        callback(_appConst.METHOD_NOT_ALLOWED.code, 'undefined', 'html');
    }
};

//Export module
module.exports = handler;