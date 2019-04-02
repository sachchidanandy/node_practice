/**
 * Contain interpolation data object.
 * 
 * @file tempSpecificData.js
 * @author Sachchidanand
*/

//Module contain template specific data object
const dataObject = {};

//For index
dataObject.index = {
    'head.title' : 'Uptime Monitoring - Made Simple',
    'head.description' : 'We offer simple uptime monitoring for all HTTP/HTTPS sites and send MSG when the status of site changes',
    'body.class' : 'index'
};

//For account create
dataObject.accountCreate = {
    'head.title' : 'Create an Account',
    'head.description' : 'Signup is easy and only takes few seconds.',
    'body.class' : 'accountCreate'
};

//Export module
module.exports = dataObject;