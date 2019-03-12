/**
 * Create and export configuration variables
 * 
 * @file config.js
 * @author Sachchidanand
*/

//Container of all the environment
const environment = {};

//Staging (default) environment
environment.staging = {
    httpPort : 3000,
    httpsPort : 3001,
    envName : 'staging'
}

//Production environment
environment.production = {
    httpPort : 5000,
    httpsPort : 5001,
    envName : 'production'
}

//Determine which environment id passed from console
const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//Check if the current env is one of the above
const configToExport = environment.hasOwnProperty(currentEnv) ? environment[currentEnv] : environment.staging;

//Export the module
module.exports = configToExport;
