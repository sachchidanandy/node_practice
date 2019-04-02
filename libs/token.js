/**
 * Token to handle token related operations.
 * 
 * @file token.js
 * @author Sachchidanand
*/

//Dependency
const _helper = require('./helper');
const _data = require('./data');
const appConstant  = require('./appConstants');

//Token module
const token = {};

/**
 * @function get to fetch tokens related to user 
 * 
 * @argument data object(token)
 * @argument callback function
*/
token.get = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._GET_TOKEN, data.queryStringObject);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else { 
        //Read token data of the user
        _data.read('tokens', data.queryStringObject.token, (err, tokenData) => {
            //Check if token is present or not
            if (!err && tokenData) {
                tokenData = _helper.convsertJsonToObject(tokenData);

                if (tokenData) {
                    callback(appConstant.SUCCESS_CODE, tokenData);
                } else {
                    callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.READ_DATA_ERROR})                    
                }
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'Token ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

/**
 * @function post to create tokens for user 
 * 
 * @argument data object (phone, password)
 * @argument callback function
*/
token.post = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._POST_TOKEN, data.payload);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Read user details
        _data.read('user', data.payload.phone, (err, userData) => {
            if (!err && userData) {
                //convert JSON string into Object
                userData = _helper.convsertJsonToObject(userData);

                //Check if valid data is obtained
                if (userData) {
                    //Create hashed password using stored salt
                    const newHashedPassword = _helper.createPassword(data.payload.password, userData.salt)['password'];

                    //Authenticate user
                    if (newHashedPassword === userData.password) {
                        //Generate a token for user
                        const token = _helper.createToken(appConstant.TOKEN_SIZE);
                        if (token) {

                            //Create token objectt
                            const tokenObject = {
                                'token' : token,
                                'phone' : userData.phone,
                                'expires' : Date.now() + 1000 * 60 * 60
                            };
                            //Create new token for user
                            _data.create('tokens', token, tokenObject, (err) => {
                                if (err === false) {
                                    //Sending Success response
                                    callback(appConstant.SUCCESS_CODE, tokenObject);
                                } else {
                                    //Sending Error response
                                    callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.CREATE_TOKEN_ERROR});
                                }
                            });
                        } else {
                            //Sending Error response
                            callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.CREATE_TOKEN_ERROR})
                        }
                    } else {
                        //Sending Error response
                        callback(appConstant.UNAUTHORIZED.code, {error : appConstant.UNAUTHORIZED.message});
                    }
                } else {
                    //Sending Error response
                    callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.GET_USER_ERROR});
                }
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'User ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

/**
 * @function put to update (Extend time) of tokens related to user 
 * 
 * @argument data object (token, extend)
 * @argument callback function
*/
token.put = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS. _PUT_TOKEN, data.payload);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Read token data
        _data.read('tokens', data.payload.token, (err, tokenData) => {
            if (!err && tokenData) {
                //Convert JSON string to Object
                tokenData = _helper.convsertJsonToObject(tokenData);
                //Check that token haven't expired
                if (tokenData.expires > Date.now()) {
                    //Increase expire time by one hour
                    tokenData.expires = Date.now() + 1000 * 60 * 60;

                    //store new token data
                    _data.update('tokens', tokenData.token, tokenData, (err) => {
                        if (!err) {
                            //Sending success response
                            callback(appConstant.SUCCESS_CODE, {message : appConstant.TOKEN_EXTENDED});
                        } else {
                            //Sending Error response
                            callback(appConstant.INTERNAL_SERVER_ERROR);
                        }
                    });
                } else {
                    //Sending Error response
                    callback(appConstant.BAD_REQUEST.code, {error : appConstant.TOKEN_EXPIRED});
                }
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'Token ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

/**
 * @function delete to delete tokens 
 * 
 * @argument data object (token)
 * @argument callback function
*/
token.delete = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS. _DELETE_TOKEN, data.queryStringObject);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Read token data
        _data.read('tokens', data.queryStringObject.token, (err, tokenData) => {
            if (!err && tokenData) {
                //Delete token
                _data.delete('tokens', data.queryStringObject.token, (err) =>{
                    if (!err) {
                        //Return success response
                        callback(appConstant.SUCCESS_CODE, {message : appConstant.DELETE_TOKEN});
                    } else {
                        //Return error response
                        callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.DELETE_TOKEN_ERROR});
                    }
                });
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'Token ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

//Export module
module.exports = token;
