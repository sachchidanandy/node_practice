/**
 * Request handlers.
 * 
 * @file handler.js
 * @author Sachchidanand
*/

//Dependencies
const _appConst = require('./appConstants');
const _user = require('./user');
const _tocken = require('./tocken');
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
handler.tocken = (data, callback) => {
    if (_appConst.METHOD_LIST.indexOf(data.method) > -1) {
        _tocken[data.method](data, callback);
    } else {
        callback(405, _appConst.INVALID_METHOD);
    }
}

//Token service handler
handler.check = (data, callback) => {
    if (_appConst.METHOD_LIST.indexOf(data.method) > -1) {
        _check[data.method](data, callback);
    } else {
        callback(405, _appConst.INVALID_METHOD);
    }
}

//Index page handler
handler.index = (data, callback) => {
    if (data.method === 'get') {
        //Fetching the Index template
        _helper.getTemplate('index', _templateDataObject.index).then(mainBodyHtml => {
            return _helper.addUniversalTemplates(mainBodyHtml, _templateDataObject.index);
        }).then( finalHtmlString => {
            callback(_appConst.SUCCESS_CODE, finalHtmlString, 'html');
        }).catch(err => {
            console.log(_appConst.RED_COLOUR ,err);
            callback(_appConst.INTERNAL_SERVER_ERROR, null, 'html');
        });
    } else {
        callback(_appConst.METHOD_NOT_ALLOWED.code, null, 'html');
    };
}

//Export module
module.exports = handler;