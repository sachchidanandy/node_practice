const appConstants = {
    METHOD_LIST : ['get', 'post', 'put', 'delete'],
    TOCKEN_CHAR_POOL : 'QqWwEeRr12qw345TtyyuUIiOoPpBbNnMmaAsSdDfFGgHhJjKkLlZzXxCcVv67890',
    TOCKEN_SIZE : 30,
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
    CREATE_TOCKEN_ERROR : 'Unable to create tocken',
    INVALID_TOCKEN : 'Invalid Tocken',
    TOCKEN_EXPIRED : 'The tocken has already expired.',
    TOCKEN_EXTENDED : 'Expire time of tocken is extended by one hour.',
    DELETE_TOCKEN_ERROR : 'Unable to delete tocken',
    DELETE_TOCKEN : 'Tocken Deleted',
    CREATE_CHECK_ERROR : 'Unable to create check',
    CREATE_CHECK : 'New check created',
    INVALID_CHECK : 'Invalid Check Id',
    CHECK_DELET_SUCCESS : 'Check Deleted Successfully.',
    CHECK_MISS_MATCH : 'Tocken Id not valid for this user',
    DELETE_CHECK_ERROR : 'Unable to delete check',
    REQUIRED_FIELDS : {
        _GET_USER : ['phone'],
        _POST_USER : ['firstName', 'lastName', 'phone', 'password', 'TNC'],
        _PUT_USER : ['phone'],
        _DELETE_USER : ['phone'],
        _POST_TOCKEN :['phone', 'password'],
        _GET_TOCKEN :['tocken'],
        _PUT_TOCKEN : ['tocken', 'extend'],
        _DELETE_TOCKEN : ['tocken'],
        _POST_CHECK : ['protocol', 'url', 'method', 'successCode', 'timeoutSeconds'],
        _GET_CHECK : ['check'],
        _DELETE_CHECK : ['check'],
        _PUT_CHECK : ['check']
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