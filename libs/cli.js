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
const _command = require('./cliCommands');

//Cli module
const cli = {};

// Input handlers
_events.on('man',(str) => {
	cli.responders.help();
});

_events.on('help',(str) => {
	cli.responders.help();
});

_events.on('exit',(str) => {
	cli.responders.exit();
});

_events.on('stats',(str) => {
	cli.responders.stats();
});

_events.on('list users',(str) => {
	cli.responders.listUsers();
});

_events.on('more user info',(str) => {
	cli.responders.moreUserInfo(str);
});

_events.on('list checks',(str) => {
	cli.responders.listChecks(str);
});

_events.on('more check info',(str) => {
	cli.responders.moreCheckInfo(str);
});

_events.on('list logs',() => {
	cli.responders.listLogs();
});

_events.on('more log info',(str) => {
	cli.responders.moreLogInfo(str);
});

//Draw horizontal line
cli.horizontalLine = () => {
	//Get horizonal width of console
	const width = process.stdout.columns;
	// Create line
	let line = '';
	for (let index = 0; index < width; index++, line+= '-');
	console.log(line);
};
  
//Write given string into center
cli.centered = (centeredString) => {
	let line = '';
	const padding = Math.round((process.stdout.columns - centeredString.length)/2);
	//Create padding
	for (let index = 0; index < padding; index++, line += ' ');
	line += centeredString;
	console.log(_appConst.DARK_BLUE_COLOR, line);
};

//Create vertical space
cli.verticalSpace = (verticalSpace) => {
	if (verticalSpace) {
		for (let index = 0; index < verticalSpace; index++, console.log(''));
	}
};

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = () => { 
	//Show the header of the manual
	cli.horizontalLine();
	cli.centered('CLI MANUAL');
	cli.horizontalLine();
	cli.verticalSpace(2);

	//Show each command followed by explainantin in white and yellow colour respectively
	for (const key in _command.description) {
		if (_command.description.hasOwnProperty(key)) {
			const value = _command.description[key];
			const padding = 40 - key.length;
			let line = '';

			//Adding padding to the line
			for (let index = 0; index < padding; index++, line+= ' ');
			
			//Adding value to the line
			line+= value;
			console.log(_appConst.YELLOW_COLOR, key, line);

			cli.verticalSpace(1);
		}
	}
	//Add verical line at last
	cli.horizontalLine();
};

// Exit
cli.responders.exit = () => {
	console.log(_appConst.DARK_BLUE_COLOR, '\n Bye, Have a nice day!');
  	process.exit(0);
};

// Stats
cli.responders.stats = () => {
	console.log("You asked for stats");
};

// List Users
cli.responders.listUsers = () => {
	console.log("You asked to list users");
};

// More user info
cli.responders.moreUserInfo = (str) => {
	console.log("You asked for more user info",str);
};

// List Checks
cli.responders.listChecks = () => {
	console.log("You asked to list checks");
};

// More check info
cli.responders.moreCheckInfo = (str) => {
	console.log("You asked for more check info",str);
};

// List Logs
cli.responders.listLogs = () => {
	console.log("You asked to list logs");
};

// More logs info
cli.responders.moreLogInfo = (str) => {
	console.log("You asked for more log info",str);
};

//Input processors to process command and emit an event
cli.processInput = inputCommand => {
    inputCommand = typeof(inputCommand) === 'string' && inputCommand.trim().length > 0 ? inputCommand.trim().toLowerCase() : false;
    
    //Validate the input
    if (inputCommand) {
        let matchFound = _command.list.some( string => {
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