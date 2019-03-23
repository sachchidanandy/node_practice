/**
 * Entry point of the project. Initialize server and background worker.
 * 
 * @file index.js
 * @author Sachchidanand
*/

//Dependencies
const _server = require('./libs/server');
const _worker = require('./libs/worker');

//Declare the app
const app = {};

//Init function
app.init = () => {
    //Start server
    _server.init();

    //Start workers
    _worker.init()
}

//Execute
app.init();

//Export app module
module.exports = app;
