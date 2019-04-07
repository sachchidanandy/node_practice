/**
 * App constants.
 * 
 * @file appConstants.js
 * @author Sachchidanand
*/
const appConstants = {
    METHOD_LIST : ['get', 'post', 'put', 'delete'],
    TOKEN_CHAR_POOL : 'QqWwEeRr12qw345TtyyuUIiOoPpBbNnMmaAsSdDfFGgHhJjKkLlZzXxCcVv67890',
    TOKEN_SIZE : 30,
    CHECK_ID_SIZE : 15,
    SUCCESS_CODE : 200,
    INTERNAL_SERVER_ERROR : 500,
    CREATE_USER_ERROR : 'Unable to create new user',
    UPDATE_USER_ERROR : 'Unable to upade user details.',
    DELETE_USER_ERROR : 'Unable to delete user',
    READ_DATA_ERROR : 'Unable to read detail',
    FIND_USER_ERROR : 'Enable to find user',
    INVALID_METHOD : 'Method not allowed',
    USER_UPDATED : 'User detail updated',
    USER_DELETED : 'User deleted',
    CREATE_TOKEN_ERROR : 'Unable to create token',
    INVALID_TOKEN : 'Invalid Token',
    TOKEN_EXPIRED : 'The token has already expired.',
    TOKEN_EXTENDED : 'Expire time of token is extended by one hour.',
    DELETE_TOKEN_ERROR : 'Unable to delete token',
    DELETE_TOKEN : 'Token Deleted',
    CREATE_CHECK_ERROR : 'Unable to create check',
    CREATE_CHECK : 'New check created',
    INVALID_CHECK : 'Invalid Check Id',
    CHECK_DELET_SUCCESS : 'Check Deleted Successfully.',
    CHECK_MISS_MATCH : 'Token Id not valid for this user',
    DELETE_CHECK_ERROR : 'Unable to delete check',
    ERROR_OPEN_FILE_APPEND : 'Could not open file in appending',
    ERROR_FILE_APPEND : 'Error in appending to file',
    ERROR_FILE_APPEND_CLOSE : 'Error in closing that was being appended',
    RED_COLOUR : '\x1b[31m%s\x1b[0m',
    YELLOW_COLOR : '\x1b[33m%s\x1b[0m',
    GREEN_COLOR : '\x1b[32m%s\x1b[0m',
    DARK_BLUE_COLOR : '\x1b[34m%s\x1b[0m',
    SERVER_START_ERROR : "Error Occours While Starting Server",
    WORKER_START_ERROR : "Error Occours While Starting Server",
    CLI_START_ERROR : "Error Occours While Starting Server",
    REQUIRED_FIELDS : {
        _GET_USER : ['phone'],
        _POST_USER : ['firstName', 'lastName', 'phone', 'password', 'TNC'],
        _PUT_USER : ['phone'],
        _DELETE_USER : ['phone'],
        _POST_TOKEN :['phone', 'password'],
        _GET_TOKEN :['token'],
        _PUT_TOKEN : ['token', 'extend'],
        _DELETE_TOKEN : ['token'],
        _POST_CHECK : ['protocol', 'url', 'method', 'successCode', 'timeoutSeconds'],
        _GET_CHECK : ['checkId'],
        _DELETE_CHECK : ['checkId'],
        _PUT_CHECK : ['checkId'],
        _CHECK_FIELD : ['checkId','protocol', 'url', 'method', 'successCode', 'timeoutSeconds', 'phone','lastState']
    },
    USER_CREATED : {
        code : 201,
        message: 'New User Created'
    },
    BAD_REQUEST : {
        code : 400,
        message : 'Bad request one or more required field missing or Invalid Details.'
    },
    UNAUTHORIZED : {
        code : 401,
        message : 'Unable to authenticate user details.'
    },
    METHOD_NOT_ALLOWED : {
        code : 405,
        message : 'Method Not Allowed'
    },
    CONFLICT : {
        code : 409,
        message : 'User Already Exists.'
    },
    NOT_FOUND : {
        code : 404,
        message : 'Not Found.'
    },
    NOT_ACCEPTABLE : {
        code : 406,
        message : 'Reached Max Limit.'
    }
};

//Export Constants
module.exports = appConstants;