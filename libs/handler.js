/**
 * Request handlers.
 * 
 * @file handler.js
 * @author Sachchidanand
*/

//Dependencies
const APP_CONST = require('./appConstants');
const _user = require('./user');
const _tocken = require('./tocken');
const _check = require('./check');

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
    if (APP_CONST.METHOD_LIST.indexOf(data.method) > -1) {
        _user[data.method](data, callback);
    } else {
        callback(405, APP_CONST.INVALID_METHOD);
    }
};

//Token service handler
handler.tocken = (data, callback) => {
    if (APP_CONST.METHOD_LIST.indexOf(data.method) > -1) {
        _tocken[data.method](data, callback);
    } else {
        callback(405, APP_CONST.INVALID_METHOD);
    }
}

//Token service handler
handler.check = (data, callback) => {
    if (APP_CONST.METHOD_LIST.indexOf(data.method) > -1) {
        _check[data.method](data, callback);
    } else {
        callback(405, APP_CONST.INVALID_METHOD);
    }
}

//Export module
module.exports = handler;