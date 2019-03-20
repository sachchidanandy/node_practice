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
    'user' : handler.user,
    'tocken' : handler.tocken,
    'ping' : handler.ping,
    'notFound' : handler.notFound
};

//Export module route
module.exports = router;
