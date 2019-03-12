/**
 * Router to handle teh requests.
 * 
 * @file router.js
 * @author Sachchidanand
*/

//Dependencies
const user = require('./user');

//Handler for undefined routes
const notFound = (data, callback) => {
    //Callback a http status and a payload
    callback(404, {message : 'Page Not Found'});
};

//Handler ping to server
const ping = (data, callback) => {
    //Callback a http status and a payload
    callback(200, {});
};

//Routes path and handlers
const routes = {
    'user' : user.getUser,
    'ping' : ping,
    'notFound' : notFound
};

module.exports = routes;
