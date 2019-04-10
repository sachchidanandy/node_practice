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

//Declare the app
const app = {};

//Assign global which strict mode must catch (--use_strict)
foo = 'LOL';


//Init function
app.init = () => {
    //Start server
    _server.init().then( () => {
        //Start workers
        return _worker.init(); 
    }).then( () => {
        //Start cli
        _cli.init();
    }).catch( error => {
        console.log(_appConst.RED_COLOUR, error);
    });
}

//Execute
app.init();

//Export app module
module.exports = app;
