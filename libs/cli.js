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
const os = require('os');
const v8 = require('v8');
const events = require('events');
class e extends events{};
const _events = new e();
const _appConst = require('./appConstants');
const _command = require('./cliCommands');
const _data = require('./data');

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
	// Compile an object of stats
	const stats = {
		'Load Average' : os.loadavg().join(' '),
		'CPU Count' : os.cpus().length,
		'Free Memory' : (os.freemem()/8) + ' Bytes',
		'Current Malloced Memory' : v8.getHeapStatistics().malloced_memory,
		'Peak Malloced Memory' : v8.getHeapStatistics().peak_malloced_memory,
		'Allocated Heap Used (%)' : Math.round((v8.getHeapStatistics().used_heap_size / v8.getHeapStatistics().total_heap_size) * 100),
		'Available Heap Allocated (%)' : Math.round((v8.getHeapStatistics().total_heap_size / v8.getHeapStatistics().heap_size_limit) * 100),
		'Uptime' : os.uptime()+' Seconds'
	};

	//Show the header of the manual
	cli.horizontalLine();
	cli.centered('SYSTEM STATISTICS');
	cli.horizontalLine();
	cli.verticalSpace(2);

	//Show each command followed by explainantin in white and yellow colour respectively
	for (const key in stats) {
		if (stats.hasOwnProperty(key)) {
			const value = stats[key];
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

// List Users
cli.responders.listUsers = () => {
	_data.list('user').then( usersList => {
		cli.centered('USERS LIST');
		cli.verticalSpace(1);
		usersList.map( user => {
			_data.read('user', user, (err, userData) => {
				userData = JSON.parse(userData);
				if (!err && typeof(userData) === 'object') {
					let line = `Name : ${userData.firstName} ${userData.lastName} phone : ${userData.phone} checks : ${userData.checks.length}`;
					console.log(line);
				}
			});
		});
	}).catch(error => {
		console.log(_appConst.RED_COLOUR, error);
	});
};

// More user info
cli.responders.moreUserInfo = (str) => {
	//Get User id from string
	const phone = str.substr((str.indexOf('--')+2)).trim();
	//Validate phone number
	if (Number(phone) && phone.length === 10) {
		//Read user data.
		_data.read('user', phone, (err, userData) => {
			//Convert JSON to object
			userData = JSON.parse(userData);
			if (!err && typeof(userData) === 'object') {
				const line = `Name : ${userData.firstName} ${userData.lastName} phone : ${userData.phone} checks : ${userData.checks} TNC : ${userData.TNC}`;
				cli.verticalSpace(1);
				console.log(line);
				cli.verticalSpace(1);
			}
		});
	}
};

// List Checks
cli.responders.listChecks = (str) => {
	//Get flsg from string
	const flag = str.substr((str.indexOf('--')+2)).trim();
	//Get all checks
	_data.list('checks').then( checkList => {
		//If checks present
		if (checkList.length > 0) {
			//Check if flag is given
			if (typeof(flag) === 'string' && ['down', 'up'].indexOf(flag) > -1) {
				checkList.map(checkId => {
					_data.read('checks', checkId, (err, checkData) => {
						if (!err && checkData) {
							checkData = JSON.parse(checkData);
							checkData.lastState === flag ? (cli.verticalSpace(1),console.log(`Check Id : ${checkData.checkId} Phone : ${checkData.phone} Status : ${checkData.lastState}`),cli.verticalSpace(1)) : null;
						}
					});
				});
			} else {
				checkList.map(checkId => {
					_data.read('checks', checkId, (err, checkData) => {
						if (!err && checkData) {
							checkData = JSON.parse(checkData);
							cli.verticalSpace(1);
							console.log(`Check Id : ${checkData.checkId} Phone : ${checkData.phone} Status : ${checkData.lastState}`);
							cli.verticalSpace(1);
						}
					});
				});
			}
		}
	}).catch( error => {
		console.log(_appConst.RED_COLOUR, error);
	});
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