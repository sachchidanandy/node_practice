/**
 * Router to handle the requests.
 * 
 * @file router.js
 * @author Sachchidanand
*/

//Dependencies
const handler = require('./handler');

//Routes path and handlers
const router = {
    '' : handler.index,
    'account/create' : handler.accountCreate,
    'account/edit' : handler.accountEdit,
    'account/deleted' : handler.accountDeleted,
    'session/create' : handler.sessionCreate,
    'session/deleted' : handler.sessionDeleted,
    'checks/all' : handler.checkList,
    'checks/create' : handler.checksCreate,
    'checks/edit' : handler.checksEdit,
    'api/user' : handler.user,
    'api/token' : handler.token,
    'api/check' : handler.check,
    'ping' : handler.ping,
    'favicon.ico' : handler.favicon,
    'public' : handler.public,
    'notFound' : handler.notFound
};

//Export module route
module.exports = router;
