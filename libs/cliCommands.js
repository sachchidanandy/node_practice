/**
 * Cli commands and there description.
 * 
 * @file cliCommands.js
 * @author Sachchidanand
*/

const uniqueInputs = {
    list : [
        'man',
        'help',
        'exit',
        'stats',
        'list users',
        'more user info',
        'list checks',
        'more check info',
        'list logs',
        'more log info'
    ],
    description : {
        'exit' : 'Kill the CLI (and the rest of the application)',
        'man' : 'Show this help page',
        'help' : 'Alias of the "man" command',
        'stats' : 'Get statistics on the underlying operating system and resource utilization',
        'List users' : 'Show a list of all the registered (undeleted) users in the system',
        'More user info --{userId}' : 'Show details of a specified user',
        'List checks --up --down' : 'Show a list of all the active checks in the system, including state ["--up","--down"] optional.',
        'More check info --{checkId}' : 'Show details of a specified check',
        'List logs' : 'Show a list of all the log files available to be read (compressed)',
        'More log info --{logFileName}' : 'Show details of a specified log file',
    }
};

//Export module
module.exports = uniqueInputs;