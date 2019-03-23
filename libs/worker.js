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
const _data = require('./data');
const _helper =require('./helper');
const _appConstant = require('./appConstants');

//Worker moduel
const worker = {};

//Loop ckeck all the checks in every one minute
worker.loop = () => {
    setInterval(worker.gatherAllChecks, 1000 * 60)
};

//fetch all checks
worker.gatherAllChecks = () => {
    _data.list('checks').then( list => {
        if (list.length > 0) {
            list.map(fileName => worker.fetchCheck(fileName));
        } else {
            console.log('No checks to execute');
        }
    }).catch(err => {
        console.log(err);
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
                    console.log(`Invalide data found in check ID : ${checkId}`);
                }
            } else {
                console.log(`Invalide data formate in check ID : ${checkId}`);                
            }
        } else {
            console.log(err);
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
    //Check for error
    if (!checkOutCome.error && checkOutCome.responseCode) {
        //Decide if the state of url is up or down
        const state =  checkData.successCode.indexOf(checkOutCome.responseCode) > -1 ? 'up' : 'down';

        //Decide if alert is required
        const alertUser = checkData.lastState !== state ? true : false;

        //Update checkdata
        const newCheckObject = checkData;
        newCheckObject.lastState = state;
        newCheckObject.lastCheckTime = Date.now();
        _data.update('checks', newCheckObject.checkId, newCheckObject, (err) => {
            if (!err) {
                if (alertUser) {
                    _helper.sendTwilioSms(newCheckObject.phone, `Status of the url : ${newCheckObject.url} is changed and it's ${state}`, (err) => {
                        if (!err) {
                            console.log(`Alert sent to user for check Id : ${checkData.checkId}`);
                        } else {
                            console.log(`Unable to sent alert for check Id : ${checkData.checkId}\n Error : ${err}`);
                        }
                    });
                } else {
                    console.log(`No need to send Alert for check Id : ${checkData.checkId}`);                                  
                }
            } else {
                console.log(`Unable to update check id : ${checkData.checkId}`);        
            }
        });
    } else {
        console.log(`Error occours in the ping for check id : ${checkData.checkId}`);
    }  
};

//Init function to exec ute workers
worker.init = () => {
    worker.loop();
};

//Export worker module
module.exports = worker;