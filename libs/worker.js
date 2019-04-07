/**
 * Workers to handle all background operations.
 * 
 * @file workers.js
 * @author Sachchidanand
*/

//Dependency
const url  = require('url');
const http = require('http');
const https = require('https');
const util = require('util');
const _debug = util.debuglog('worker');
const _data = require('./data');
const _helper =require('./helper');
const _appConstant = require('./appConstants');
const _log= require('./log');


//Worker moduel
const worker = {};

//Loop ckeck all the checks in every one minute
worker.loop = () => {
    setInterval(worker.gatherAllChecks, 1000 * 60)
};

//Fetch all checks
worker.gatherAllChecks = () => {
    _data.list('checks').then( list => {
        if (list.length > 0) {
            list.map(fileName => worker.fetchCheck(fileName));
        } else {
            _debug('No checks to execute');
        }
    }).catch(err => {
        _debug(err);
    });
};

//Fetch each check and validate them
worker.fetchCheck = (checkId) => {
    _data.read('checks', checkId, (err, checkData) => {
        if (!err && checkData) {
            //Convert JSON data into object
            checkData = _helper.convsertJsonToObject(checkData);
            if (typeof(checkData) === 'object') {
                //Validate check data
                const valideData = _helper.validateRequiredFields(_appConstant.REQUIRED_FIELDS._CHECK_FIELD, checkData);
                if (valideData) {
                    worker.performCheck(checkData);
                } else {
                    _debug(`Invalide data found in check ID : ${checkId}`);
                }
            } else {
                _debug(`Invalide data formate in check ID : ${checkId}`);                
            }
        } else {
            _debug(err);
        }
    });
};

//Ping each url and check response of the url
worker.performCheck = (checkData) => {
    //Outcome object
    const checkOutCome = {
        'responseCode' : false,
        'error' : false
    };

    //Mark that output has not been sent yet
    let outComeSend = false;

    //Parse out hostname and the path from original check data
    const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`, true);
    //Get hostname and path
    const hostname = parsedUrl.hostname;
    const path = parsedUrl.path;

    //Construct the request
    const requestData = {
        'protocol' : checkData.protocol+':',
        'hostname' : hostname,
        'method' : checkData.method.toUpperCase(),
        'path' : path,
        'timeout' : checkData.timeoutSeconds * 1000 //To convert to milisecond
    };

    //Initialize the request formate using appropriate protocol
    const _moduleToUse = checkData.protocol === 'https' ? https : http ;
    const req = _moduleToUse.request(requestData, (res) => {
        //get status code
        checkOutCome.responseCode = res.statusCode;

        if (!outComeSend) {
            worker.processCheckOutCome(checkData, checkOutCome);
            outComeSend = true;
        }
    });

    //Attaching an error event to handle error
    req.on('error', (err) => {
        //Get error
        checkOutCome.error = {
            'error' : true,
            'value' : err
        };

        if (!outComeSend) {
            worker.processCheckOutCome(checkData, checkOutCome);
            outComeSend = true;
        }
    });

    //Attach time out event
    req.on('timeout', (err) => {
        //Get error
        checkOutCome.error = {
            'error' : true,
            'value' : err
        };

        if (!outComeSend) {
            worker.processCheckOutCome(checkData, checkOutCome);
            outComeSend = true;
        }
    });

    //Sending request
    req.end();
};

//Process the checkout come and update the check data and if needed alert the user
worker.processCheckOutCome = (checkData, checkOutCome) =>{
    const currentTime = Date.now();
    //Check for error
    if (!checkOutCome.error && checkOutCome.responseCode) {
        //Decide if the state of url is up or down
        const state =  checkData.successCode.indexOf(`${checkOutCome.responseCode}`) > -1 ? 'up' : 'down';

        //Decide if alert is required
        const alertUser = checkData.lastState !== state ? true : false;

        //Update checkdata
        const newCheckObject = checkData;
        newCheckObject.lastState = state;
        newCheckObject.lastCheckTime = currentTime;
        _data.update('checks', newCheckObject.checkId, newCheckObject, (err) => {
            if (!err) {
                //Log response to log file
                worker.log(checkData,checkOutCome, state, alertUser, currentTime);
                if (alertUser) {
                    _helper.sendTwilioSms(newCheckObject.phone, `Status of the url : ${newCheckObject.url} is changed and it's ${state}`, (err) => {
                        if (!err) {
                            _debug(`Alert sent to user for check Id : ${checkData.checkId}`);
                        } else {
                            _debug(`Unable to sent alert for check Id : ${checkData.checkId}\n Error : ${err}`);
                        }
                    });
                } else {
                    _debug(`No need to send Alert for check Id : ${checkData.checkId}`);                                  
                }
            } else {
                _debug(`Unable to update check id : ${checkData.checkId}`);        
            }
        });
    } else {
        _debug(`Error occours in the ping for check id : ${checkData.checkId}`);
    }  
};

//Log response into log file
worker.log = (checkData, checkOutcome, state, alertRequired, timeOfCheck) => {
    //Create object to be loged
    const logObject = {
        'check' : checkData,
        'outcome' : checkOutcome,
        'state' : state,
        'alert' : alertRequired,
        'time' : timeOfCheck
    };

    //Convert object to string
    const logString = JSON.stringify(logObject);

    //Filename of the log
    const fileName = checkData.checkId;

    //Log string into file
    _log.append(fileName, logString, (err) => {
        if (!err) {
            _debug('Logging to file succeeded');
        } else {
            _debug('Error in logging file');
        }
    });
};

//Log rotation loop
worker.logRotationLoop = () => {
    setInterval(worker.rotateLogs,1000 * 60 * 60 * 24);
};

//Function to rotate logs
worker.rotateLogs = () => {
    //List all the non compressed files
    _log.list(false, (err, logList) => {
        //Check for the error
        if (!err && logList && logList.length > 0) {
            //Compressing data into another file 
            logList.map( logFileName => {
                const compFileName = logFileName.replace('.log', `-${new Date().toLocaleDateString()}`);
                _log.compress(logFileName, compFileName,(err) => {
                    if (!err) {
                        _log.truncate(logFileName, (err)=> {
                            if (!err) {
                                _debug('Log rotated sucess');
                            } else {
                                _debug("Can't able to rotate log");
                            }
                        });
                    } else {
                        _debug(err);
                    }
                });
            });
        } else {
            _debug('No log file to compress');
        }
    });
};

//Init function to exec ute workers
worker.init = () => {
    return new Promise( (resolve, reject) => {
        try {
            //Console log in yellow
            console.log('\x1b[33m%s\x1b[0m', 'Background Worker Started');
            
            //Execute all the checks immediately
            worker.gatherAllChecks();

            //Call loop to check status of checks
            worker.loop();

            //Compress all the logs immediately
            worker.rotateLogs();

            //Calling loop to rotate log
            worker.logRotationLoop();

            //resolve
            resolve();
        } catch (error) {
            reject(_appConstant.WORKER_START_ERROR);
        }
    });
};

//Export worker module
module.exports = worker;