const appConstants = {
    USERS_METHODS : ['get', 'post', 'put', 'delete'],
    TOCKEN_CHAR_POOL : 'QqWwEeRr12qw345TtyyuUIiOoPpBbNnMmaAsSdDfFGgHhJjKkLlZzXxCcVv67890',
    TOCKEN_SIZE : 30,
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
    CREATE_TOCKEN_ERROR : 'Unable to create tocken',
    INVALID_TOCKEN : 'Invalid Tocken',
    TOCKEN_EXPIRED : 'The tocken has already expired.',
    TOCKEN_EXTENDED : 'Expire time of tocken is extended by one hour.',
    DELETE_TOCKEN_ERROR : 'Unable to delete tocken',
    DELETE_TOCKEN : 'Tocken Deleted',
    TOCKEN_AUTH_ERROR : 'Invalid User Details or Tocken Expired',
    REQUIRED_FIELDS : {
        _GET_USER : ['phone'],
        _POST_USER : ['firstName', 'lastName', 'phone', 'password', 'TNC'],
        _PUT_USER : ['phone'],
        _DELETE_USER : ['phone'],
        _POST_TOCKEN :['phone', 'password'],
        _GET_TOCKEN :['tocken'],
        _PUT_TOCKEN : ['tocken', 'extend'],
        _DELETE_TOCKEN : ['tocken']
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
    }
};

//Export Constants
module.exports = appConstants;