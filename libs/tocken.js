/**
 * Tocken to handle tocken related operations.
 * 
 * @file tocken.js
 * @author Sachchidanand
*/

//Dependency
const _helper = require('./helper');
const _data = require('./data');
const appConstant  = require('./appConstants');

//Tocken module
const tocken = {};

/**
 * @function get to fetch tockens related to user 
 * 
 * @argument data object(tocken)
 * @argument callback function
*/
tocken.get = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._GET_TOCKEN, data.queryStringObject);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else { 
        //Read tocken data of the user
        _data.read('tockens', data.queryStringObject.tocken, (err, tockenData) => {
            //Check if tocken is present or not
            if (!err && tockenData) {
                tockenData = _helper.convsertJsonToObject(tockenData);

                if (tockenData) {
                    callback(appConstant.SUCCESS_CODE, tockenData);
                } else {
                    callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.READ_DATA_ERROR})                    
                }
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'Tocken ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

/**
 * @function post to create tockens for user 
 * 
 * @argument data object (phone, password)
 * @argument callback function
*/
tocken.post = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS._POST_TOCKEN, data.payload);
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
                        //Generate a tocken for user
                        const tocken = _helper.createTocken(appConstant.TOCKEN_SIZE);
                        if (tocken) {

                            //Create tocken objectt
                            const tockenObject = {
                                'tocken' : tocken,
                                'phone' : userData.phone,
                                'expires' : Date.now() + 1000 * 60 * 60
                            };
                            //Create new tocken for user
                            _data.create('tockens', tocken, tockenObject, (err) => {
                                if (err === false) {
                                    //Sending Success response
                                    callback(appConstant.SUCCESS_CODE, tockenObject);
                                } else {
                                    //Sending Error response
                                    callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.CREATE_TOCKEN_ERROR});
                                }
                            });
                        } else {
                            //Sending Error response
                            callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.CREATE_TOCKEN_ERROR})
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
 * @function put to update (Extend time) of tockens related to user 
 * 
 * @argument data object (tocken, extend)
 * @argument callback function
*/
tocken.put = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS. _PUT_TOCKEN, data.payload);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Read tocken data
        _data.read('tockens', data.payload.tocken, (err, tockenData) => {
            if (!err && tockenData) {
                //Convert JSON string to Object
                tockenData = _helper.convsertJsonToObject(tockenData);
                //Check that tocken haven't expired
                if (tockenData.expires > Date.now()) {
                    //Increase expire time by one hour
                    tockenData.expires = Date.now() + 1000 * 60 * 60;

                    //store new tocken data
                    _data.update('tockens', tockenData.tocken, tockenData, (err) => {
                        if (!err) {
                            //Sending success response
                            callback(appConstant.SUCCESS_CODE, {message : appConstant.TOCKEN_EXTENDED});
                        } else {
                            //Sending Error response
                            callback(appConstant.INTERNAL_SERVER_ERROR);
                        }
                    });
                } else {
                    //Sending Error response
                    callback(appConstant.BAD_REQUEST.code, {error : appConstant.TOCKEN_EXPIRED});
                }
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'Tocken ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

/**
 * @function delete to delete tockens 
 * 
 * @argument data object (tocken)
 * @argument callback function
*/
tocken.delete = (data, callback) => {
    //Validate required field.
    const validPayload = _helper.validateRequiredFields(appConstant.REQUIRED_FIELDS. _DELETE_TOCKEN, data.queryStringObject);
    if (!validPayload) {
        //Callback a http status 400 and a error payload
        callback(appConstant.BAD_REQUEST.code, {error : appConstant.BAD_REQUEST.message});
    } else {
        //Read tocken data
        _data.read('tockens', data.queryStringObject.tocken, (err, tockenData) => {
            if (!err && tockenData) {
                //Delete tocken
                _data.delete('tockens', data.queryStringObject.tocken, (err) =>{
                    if (!err) {
                        //Return success response
                        callback(appConstant.SUCCESS_CODE, {message : appConstant.DELETE_TOCKEN});
                    } else {
                        //Return error response
                        callback(appConstant.INTERNAL_SERVER_ERROR, {error : appConstant.DELETE_TOCKEN_ERROR});
                    }
                });
            } else {
                //Sending Error response
                callback(appConstant.NOT_FOUND.code, {error : 'Tocken ' + appConstant.NOT_FOUND.message});
            }
        });
    }
}

//Export module
module.exports = tocken;
