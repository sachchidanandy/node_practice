const appConstants = {
    USERS_METHODS : ['get', 'post', 'put', 'delete'],
    SUCCESS_CODE : 200,
    INTERNAL_SERVER_ERROR : 500,
    CREATE_USER_ERROR : 'Unable to create new user',
    UPDATE_USER_ERROR : 'Unable to upade user details.',
    DELETE_USER_ERROR : 'Unable to delete user',
    GET_USER_ERROR : 'Unable to read user detail',
    FIND_USER_ERROR : 'Enable to find user',
    INVALID_METHOD : 'Method Not Allowed',
    USER_UPDATED : 'User Detail Updated',
    USER_DELETED : 'User Detail Deleted',
    REQUIRED_FIELDS : {
        _GET_USER : ['phone'],
        _POST_USER : ['firstName', 'lastName', 'phone', 'password', 'TNC'],
        _PUT_USER : ['phone'],
        _DELETE_USER : ['phone']
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
        message : 'Invalid tocken.'
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
        message : 'User Not Found.'
    }
};

//Export Constants
module.exports = appConstants;