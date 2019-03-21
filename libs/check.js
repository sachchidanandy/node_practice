/**
 * check to handle check operations.
 * 
 * @file check.js
 * @author Sachchidanand
*/

//Dependency
const _helper = require('./helper');
const _data = require('./data');
const _appConstant  = require('./appConstants');
const _config  = require('./config');

//check module
const check = {};

/**
 * @function get to fetch site check 
 * 
 * @argument data object (check)
 * @argument callback function
*/
check.get = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(_appConstant.REQUIRED_FIELDS._GET_CHECK, data.queryStringObject);
    if (validPayload  === false) {
        //Callback a http status 400 and a error payload
        return callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.BAD_REQUEST.message});
    }

    //Validate tocken
    _helper.validateTocken(data.headers.tocken, (err) => {
        if (!err) {
            //Read checks detail
            _data.read('checks', data.queryStringObject.check, (err, checkData) => {
                if (!err && checkData) {
                    //Return success response
                    callback(_appConstant.SUCCESS_CODE, JSON.parse(checkData));
                } else {
                    //Callback a http status 400 and a error payload
                    console.log(err);
                    callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.INVALID_CHECK});
                }
            });
        } else {
            //Callback a http status 401 and a error payload
            console.log(err);
            callback(_appConstant.UNAUTHORIZED.code, {error : err});
        }
    });
};

/**
 * @function post to create new site check 
 * 
 * @argument data object(protocol, url, method, successCode, timeoutSeconds)
 * @argument callback function
*/
check.post = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(_appConstant.REQUIRED_FIELDS._POST_CHECK, data.payload);
    if (validPayload  === false) {
        //Callback a http status 400 and a error payload
        return callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.BAD_REQUEST.message});
    }

    //Validate tocken
    _helper.validateTocken(data.headers.tocken, (err, phone) => {
        if (!err && phone) {
            //Read user detail
            _data.read('user', phone, (err, userData) => {
                if (!err && userData) {
                    //Convert JSON string into Object
                    userData = _helper.convsertJsonToObject(userData);
                    if (typeof(userData) === 'object') {
                        const userChecks = userData.hasOwnProperty('checks') && userData.checks instanceof Array ? userData.checks : [];
                        //Check if user haven't exided max check limit
                        if (userChecks.length < _config.maxChecks) {
                            //Create new check id
                            const checkId = _helper.createTocken(_appConstant.CHECK_ID_SIZE);

                            //Create check object
                            const checkObject = {
                                'id' : checkId,
                                'protocol' : data.payload.protocol,
                                'url' : data.payload.url,
                                'method' : data.payload.method,
                                'successCode' : data.payload.successCode,
                                'timeoutSeconds' : data.payload.timeoutSeconds
                            };

                            //Save new check
                            _data.create('checks', checkId, checkObject, (err) => {
                                if (!err) {
                                    //Insert reference of tocken into user object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    //Update user details
                                    _data.update('user', phone, userData, (err) => {
                                        if (!err) {
                                            //Send sucess response
                                            callback(_appConstant.SUCCESS_CODE, checkObject);
                                        } else {
                                            //Send Error response http code 500
                                            callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.CREATE_CHECK_ERROR});
                                        }
                                    });
                                } else {
                                    //Callback a http status 500 and a error payload
                                    callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.CREATE_CHECK_ERROR});
                                }
                            });
                        } else {
                            //Callback a http status 406 and a error payload
                            callback(_appConstant.NOT_ACCEPTABLE.code, {error : _appConstant.NOT_ACCEPTABLE.message});
                        }
                    } else {
                        //Callback ahttp status 500 and a error payload
                        callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.READ_DATA_ERROR});
                    }
                } else {
                    //Callback a http status 401 and a error payload
                    console.log(err);
                    callback(_appConstant.UNAUTHORIZED.code, {error : _appConstant.UNAUTHORIZED.message});
                }
            });
        } else {
            //Callback a http status 401 and a error payload
            console.log(err);
            callback(_appConstant.UNAUTHORIZED.code, {error : err});
        }
    });
};

/**
 * @function delete to delete site check 
 * 
 * @argument data object (check)
 * @argument callback function
*/
check.delete = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(_appConstant.REQUIRED_FIELDS._DELETE_CHECK, data.queryStringObject);
    if (validPayload  === false) {
        //Callback a http status 400 and a error payload
        return callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.BAD_REQUEST.message});
    }

    //Validate tocken
    _helper.validateTocken(data.headers.tocken, (err, phone) => {
        if (!err && phone) {
            //Read user detail
            _data.read('user', phone, (err, userData) => {
                if (!err && userData) {
                    //Convert JSON string into Object
                    userData = _helper.convsertJsonToObject(userData);
                    if (typeof(userData) === 'object') {
                        const userChecks = userData.hasOwnProperty('checks') && userData.checks instanceof Array ? userData.checks : [];
                        //Check if user haven't exided max check limit
                        if (userChecks.indexOf(data.queryStringObject.check) > -1) {
                            //delete checks
                            _data.delete('checks', data.queryStringObject.check, (err) => {
                                if (!err) {
                                    userData.checks = userChecks.filter( checkId => checkId !== data.queryStringObject.check);

                                    //Update user details
                                    _data.update('user', phone, userData, (err) => {
                                        if (!err) {
                                            //Send success response
                                            callback(_appConstant.SUCCESS_CODE, {message : _appConstant.CHECK_DELET_SUCCESS});
                                        } else {
                                            //Send Error response http code 500
                                            callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.DELETE_CHECK_ERROR});
                                        }
                                    });
                                } else {
                                    //Callback a http status 401 and a error payload
                                    console.log(err);
                                    callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.INVALID_CHECK});
                                }
                            });
                        } else {
                            //Callback a http status 409 and a error payload
                            callback(_appConstant.CONFLICT.code, {error : _appConstant.CHECK_MISS_MATCH});
                        }
                    } else {
                        //Callback ahttp status 500 and a error payload
                        callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.READ_DATA_ERROR});
                      }      
                } else {
                    //Callback a http status 401 and a error payload
                    console.log(err);
                    callback(_appConstant.UNAUTHORIZED.code, {error : _appConstant.UNAUTHORIZED.message});
                }
            });
        } else {
            //Callback a http status 401 and a error payload
            console.log(err);
            callback(_appConstant.UNAUTHORIZED.code, {error : err});
        }
    });
};

/**
 * @function put to create new site check 
 * 
 * @argument data object(protocol, url, method, successCode, timeoutSeconds)
 * @argument callback function
*/
check.put = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields([..._appConstant.REQUIRED_FIELDS._PUT_CHECK, ...Object.keys(data.payload)], data.payload);
    if (validPayload  === false) {
        //Callback a http status 400 and a error payload
        return callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.BAD_REQUEST.message});
    }

    //Validate tocken
    _helper.validateTocken(data.headers.tocken, (err, phone) => {
        if (!err && phone) {
            //Read user detail
            _data.read('user', phone, (err, userData) => {
                if (!err && userData) {
                    //Convert JSON string into Object
                    userData = _helper.convsertJsonToObject(userData);
                    if (typeof(userData) === 'object') {
                        const userChecks = userData.hasOwnProperty('checks') && userData.checks instanceof Array ? userData.checks : [];
                        //Check if user have given tocken
                        if (userChecks.indexOf(data.payload.check) > -1) {
                            //Read check data
                            _data.read('checks', data.payload.check, (err, checkData) => {
                                if (!err && checkData) {
                                    //Convert JSON to Object
                                    checkData = _helper.convsertJsonToObject(checkData);
                                    //Create valid check object
                                    const newCheckObject = {};

                                    for (const key in checkData) {
                                        if (data.payload.hasOwnProperty(key)) {
                                            newCheckObject[key] = data.payload[key];
                                        }
                                    }

                                    //Create check object
                                    const checkObject = Object.assign({}, checkData, newCheckObject);

                                    //update check
                                    _data.update('checks', data.payload.check, checkObject, (err) => {
                                        if (!err) {
                                            callback(_appConstant.SUCCESS_CODE, checkObject);
                                        } else {
                                            //Callback a http status 500 and a error payload
                                            callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.CREATE_CHECK_ERROR});
                                        }
                                    });
                                } else {
                                    //Callback a http status 400 and a error payload
                                    console.log(err);
                                    callback(_appConstant.BAD_REQUEST.code, {error : _appConstant.INVALID_CHECK});
                                }
                            });
                        } else {
                            //Callback a http status 409 and a error payload
                            callback(_appConstant.CONFLICT.code, {error : _appConstant.CHECK_MISS_MATCH});
                        }
                    } else {
                        //Callback ahttp status 500 and a error payload
                        callback(_appConstant.INTERNAL_SERVER_ERROR, {error : _appConstant.READ_DATA_ERROR});
                    }
                } else {
                    //Callback a http status 401 and a error payload
                    console.log(err);
                    callback(_appConstant.UNAUTHORIZED.code, {error : _appConstant.UNAUTHORIZED.message});
                }
            });
        } else {
            //Callback a http status 401 and a error payload
            console.log(err);
            callback(_appConstant.UNAUTHORIZED.code, {error : err});
        }
    });
};

//Export check module
module.exports = check;