/**
 * user to handle user's related operations.
 * 
 * @file user.js
 * @author Sachchidanand
*/

//Dependency
const _helper = require('./helper');
const _data = require('./data');
const appConstant  = require('./appConstants');

//User object
const user = {};

/**
 * @function get to fetch user related details 
 * 
 * @argument data object
 * @argument callback function
*/
user.get = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._GET_USER, data.queryStringObject);
    if (validPayload  === false) {
        //Callback a http status 400 and a error payload
        return callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    }
    
    //Validate tocken in header
    const tocken = data.headers.hasOwnProperty('tocken') ? data.headers.tocken : '';
    _helper.validateTocken(tocken, data.queryStringObject.phone, (err) => {
        if (err !== false) {
            //Callback a http status 401 and a error payload
            console.log(err);
            callback(appConstant.UNAUTHORIZED.code, {error : appConstant.UNAUTHORIZED.message});
        } else {
            //Read user related data
            _data.read('user',data.queryStringObject.phone,(err, data) => {
                if (!err && data) {
                    //Convert JSON string data into object
                    data = _helper.convsertJsonToObject(data);

                    if (data === false) {
                        //Sending Error response
                        callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.READ_DATA_ERROR});
                    } else {
                        //delete password and salt
                        delete data.password;
                        delete data.salt;
                        
                        //Send back response
                        callback(appConstant.SUCCESS_CODE, data);
                    }
                } else {
                    //Sending Error response
                    callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.FIND_USER_ERROR});
                }
            });
        }
    });
};

/**
 * @function post to create new user 
 * 
 * @argument data object ('firstName', 'lastName', 'phone', 'password', 'TNC')
 * @argument callback function
*/
user.post = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._POST_USER, data.payload);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Check of user doesn't already exist
        _data.read('user', data.payload.phone, (err, userData) => {

            if (!err && userData) {
                //Callback a http status 409 and a error payload
                callback(appConstant.CONFLICT.code, {error : appConstant.CONFLICT.message});
            } else {
                //Create hashed password
                const passwordObject = _helper.createPassword(data.payload.password);

                //Create payload with hashed password
                const payload = Object.assign({}, data.payload, passwordObject);
                
                //Create new user
                _data.create('user', data.payload.phone, payload, (err) => {
                    if (err) {
                        //Callback a http status 500 and a error payload
                        callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.CREATE_USER_ERROR});
                    } else {
                        //Callback a http status 200 and a success payload
                        callback(appConstant.USER_CREATED.code, {message : appConstant.USER_CREATED.message});
                    }
                });
            }
        });
    }
};

/**
 * @function put to update user related details 
 * 
 * @argument data object ('phone')
 * @argument callback function
*/
user.put = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._PUT_USER, data.payload);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Validate tocken in header
        const tocken = data.headers.hasOwnProperty('tocken') ? data.headers.tocken : '';
        _helper.validateTocken(tocken, data.payload.phone, (err) => {
            if (err !== false) {
                //Callback a http status 401 and a error payload
                console.log(err);
                callback(appConstant.UNAUTHORIZED.code, {error : appConstant.UNAUTHORIZED.message});
            } else { 
                //Check of user already exist
                _data.read('user', data.payload.phone, (err, userData) => {

                    if (err) {
                        //Callback a http status 404 and a error payload
                        callback(appConstant.NOT_FOUND.code, {error : appConstant.NOT_FOUND.message});
                    } else {
                        let passwordObject = {};
                        userData = _helper.convsertJsonToObject(userData);

                        if (data.payload.hasOwnProperty('password')) {
                            //Create hashed password
                            passwordObject = _helper.createPassword(data.payload.password);
                        }

                        //Create payload with hashed password
                        const payload = Object.assign({}, userData, data.payload, passwordObject);
                        
                        //Update users detail
                        _data.update('user', data.payload.phone, payload, (err) => {
                            if (err) {
                                //Callback a http status 500 and a error payload
                                callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.UPDATE_USER_ERROR});
                            } else {
                                //Callback a http status 200 and a success payload
                                callback(appConstant.SUCCESS_CODE, {message : appConstant.USER_UPDATED});
                            }
                        });
                    }
                });
            } 
        });
    }
};

/**
 * @function delete to delete user 
 * 
 * @argument data object
 * @argument callback function
*/
user.delete = (data, callback) => {

    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._DELETE_USER, data.queryStringObject);
    if (validPayload  === false) {
        //Callback a http status 400 and a error payload
        return callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    }
    
    //Validate tocken in header
    const tocken = data.headers.hasOwnProperty('tocken') ? data.headers.tocken : '';
    _helper.validateTocken(tocken, data.queryStringObject.phone, (err) => {
        if (err !== false) {
            //Callback a http status 401 and a error payload
            console.log(err);
            callback(appConstant.UNAUTHORIZED.code, {error : appConstant.UNAUTHORIZED.message});
        } else {
            //Read user related data
            _data.read('user',data.queryStringObject.phone,(err, userData) => {
                //Check if user exist
                if (!err && userData) {
                    _data.delete('user',data.queryStringObject.phone,(err) => {
                        if (err) {
                            //Sending Error response
                            callback(appConstant.INTERNAL_SERVER_ERROR, {message : appConstant.DELETE_USER_ERROR});
                        } else {
                            //Sending Success response
                            callback(appConstant.SUCCESS_CODE, {error : appConstant.USER_DELETED});
                        }
                    });
                } else {
                    //Callback a http status 404 and a error payload
                    callback(appConstant.NOT_FOUND.code, {error : appConstant.NOT_FOUND.message});   
                }
            });
        }
    });
};

module.exports = user;