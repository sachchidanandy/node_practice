/**
 * Cli module.
 * 
 * @file cli.js
 * @author Sachchidanand
*/

//Dependency
const readLine = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class e extends events{};
const _events = new e();
const _appConst = require('./appConstants');
const _commandList = require('./cliCommands');

//Cli module
const cli = {};

//Input processors to process command and emit an event
cli.processInput = inputCommand => {
    inputCommand = typeof(inputCommand) === 'string' && inputCommand.trim().length > 0 ? inputCommand.trim().toLowerCase() : false;
    
    //Validate the input
    if (inputCommand) {
        let matchFound = _commandList.some( string => {
            if (inputCommand.indexOf(string) > -1) {
                //Emit an event
                _events.emit(string, inputCommand);
                return true;
            }
        });
        
        if (!matchFound) {
            console.log(_appConst.RED_COLOUR, 'Sorry, invalid command try again');            
        }
    }
};

//Init cli
cli.init = () => {
    //Sent start message to the console, in dark blue
    console.log(_appConst.DARK_BLUE_COLOR, 'The Cli is running');

    //Start the interface
    const _interface =  readLine.createInterface({
        input : process.stdin,
        output : process.stdout,
        prompt : '=>'
    });

    //Create an initial prompt
    _interface.prompt();

    //Read input from cli
    _interface.on('line', inputCommand => {
        //Call processors to process input
        cli.processInput(inputCommand);

        //Re initialize prompt
        _interface.prompt();
    });

    //If the user stops the cli
    _interface.on('close', () => {
        console.log(_appConst.DARK_BLUE_COLOR, '\n Bye, Have a nice day!');
        process.exit(0);
    });
};

//Export Module
module.exports = cli;