/**
 * Entry point of the project. Initialize server and background worker.
 * 
 * @file index.js
 * @author Sachchidanand
*/

//Dependencies
const _server = require('./libs/server');
const _worker = require('./libs/worker');
const _cli = require('./libs/cli');
const _appConst = require('./libs/appConstants');
const _exampleDebugger = require('./libs/exampleDebuggingProblem');

//Declare the app
const app = {};

//Init function
app.init = () => {
    debugger;
    //Start server
    _server.init();
    debugger;

    debugger;
    //Start workers
    _worker.init();
    debugger;

    debugger;
    //Calling error library
    _exampleDebugger.init();
    debugger;

    debugger;
    //Start cli
    _cli.init();
    debugger;

};

//Execute
app.init();

//Export app module
module.exports = app;
