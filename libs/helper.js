/**
 * Helper functions
 * 
 * @file helper.js
 * @author Sachchidanand
*/

//Dependency
const crypto = require('crypto');
const queryString = require('querystring');
const https = require('https');
const fileSystem = require('fs');
const path = require('path');
const _secret = require('../https/keys');
const _appConstant = require('./appConstants');
const _data = require('./data');
const _templateBaseDir = path.join(__dirname, '../templates/');
const _publicDir = path.join(__dirname, '../public/');
const _config = require('./config');

//helper module to export
const helper = {};

// function to convsert Json String into Object
helper.convsertJsonToObject = (data) => {
    try {
        data = JSON.parse(data);
        return data;
    } catch (error) {
        return false;
    }
};

// function to validate request
helper.validateRequiredFields = (requiredField, data) => {
    // Get array of keys
    const arrayOfKeys = Object.keys(data);

    //Check if all required fields are present in data
    if (! requiredField.every( val => arrayOfKeys.includes(val))) {
        return false;
    }

    //Validate data of each field
    let value = null;
    for (const key in data) {
        switch (key) {
            case 'phone':
                value = data[key].split(' ').join('');
                if (value.length < 10 || ! Number(value)) {
                    return false;
                }
                break;
            
            case 'firstName':
                value = data[key].split(' ').join('');
                if ( typeof(value) != 'string' || value.length < 3) {
                    return false;
                }
                break;
            
            case 'lastName':
                value = data[key].split(' ').join('');
                if ( typeof(value) != 'string' || value.length < 3) {
                    return false;
                }
                break;

            case 'password':
                value = data[key].split(' ').join('');
                if ( typeof(value) != 'string' || value.length < 8) {
                    return false;
                }
                break;

            case 'TNC':
                value = data[key];
                if (typeof(value) != 'boolean' || !value) {
                    return false;
                }
                break;

            case 'tocken':
                value = data[key].split(' ').join('');
                if ( typeof(value) != 'string' || value.length < _appConstant.TOCKEN_SIZE) {
                    return false;
                }
                break;
            
            case 'extend':
                value = data[key];
                if (typeof(value) != 'boolean' || !value) {
                    return false;
                }
                break;

            case 'protocol':
                value = data[key].split(' ').join('');
                if (typeof(value) !== 'string' || ['http', 'https'].indexOf(value) < 0) {
                    return false;
                }
                break;

            case 'url':
                value = data[key].split(' ').join('');
                if (typeof(value) !== 'string') {
                    return false;
                }
                break;

            case 'method':
                value = data[key].split(' ').join('');
                if (typeof(value) !== 'string' || _appConstant.METHOD_LIST.indexOf(value) < 0) {
                    return false;
                }
                break;

            case 'successCode':
                value = data[key];
                if (typeof(value) !== 'object' || !(value instanceof Array) || value.length < 1) {
                    return false;
                }
                break;
            
            case 'timeoutSeconds' : 
                value = data[key].split(' ').join('');
                if (!Number(value) || value.length < 1) {
                    return false
                }
                break;

            case 'checkId':
                value = data[key].split(' ').join('');
                if (typeof(value) !== 'string' || value.length < _appConstant.CHECK_ID_SIZE) {
                    return false;
                }
                break;

            default:
                break;
        }
    }

    //If all cases pased
    return true;
};

//function to generate hashed password
helper.createPassword = (passwordText, salt = null) => {
    //Generate Cryptographically Secure Pseudo-Random Number (CSPRN) for salt
    salt = salt ? salt : crypto.randomBytes(32).toString('hex');

    //Create hashed password
    const hashedPassword = crypto.createHmac('sha256',_secret.passwordKey)
        .update(salt+passwordText+salt).digest('hex');

    return {
        salt,
        password : hashedPassword
    };
};

//function to generate tocken for user
helper.createTocken = (tockenLength = 0) => {
    tockenLength = typeof(tockenLength) === 'number' ? tockenLength : false;

    if (tockenLength) {
        let tocken = '';
        const tockenPool = _appConstant.TOCKEN_CHAR_POOL;

        //Create tocken
        for (let counter = 0; counter < tockenLength; counter++) {
            tocken += tockenPool.charAt(Math.floor(Math.random() * tockenPool.length));
        }

        return tocken;
    } else {
        return false;
    }
    
};

//Function to validate tocken
helper.validateTocken = (tocken, callBack) => {
    _data.read('tockens', tocken, (err, data) => {
        if (!err && data) {
            //Convert JSON data into object
            data = helper.convsertJsonToObject(data);

            if (data) {
                //Check if tocken belongs to that user and haven't expired
                if (data.expires > Date.now()) {
                    callBack(false, data.phone);
                } else {
                    callBack(_appConstant.TOCKEN_EXPIRED);
                }
            } else {
                callBack(_appConstant.READ_DATA_ERROR);
            }
        } else {
            callBack('Tocken ' + _appConstant.NOT_FOUND.message);
        }
    });
};

/*
    CURL REQUEST TO SEND SMS
    ------------------------
    curl -X POST https://api.twilio.com/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages.json \
    --data-urlencode "Body=This is the ship that made the Kessel Run in fourteen parsecs?" \
    --data-urlencode "From=+15017122661" \
    --data-urlencode "To=+15558675310" \
    -u ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX:your_auth_token

*/
helper.sendTwilioSms = (phone, msg, callBack) => {
    //validate parameters
    phone = phone.length === 10 && Number(phone) && typeof(phone) === 'string' ? phone : false;
    msg = msg.trim().length > 0 && msg.trim().length <= 140 && typeof(msg) === 'string' ? msg : false;

    if (phone && msg) {
        //Configure payload (Body, From, To)
        const payload = {
            'From' : _secret.twilio.fromPhone,
            'To' : '+91'+phone,
            'Body' : msg
        };

        //Stringify the payload to suitable for use in a URL query string
        const stringPayload = queryString.stringify(payload);

        //Configure the request details
        const requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.twilio.com',
            'method' : 'POST',
            'path' : `/2010-04-01/Accounts/${_secret.twilio.accountSid}/Messages.json`,
            'auth' : `${_secret.twilio.accountSid}:${_secret.twilio.authTocken}`,
            'headers' : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(stringPayload)
            }
        };

        //Instantiate the request object
        const req = https.request(requestDetails, (res) => {
            //Status code
            const status = res.statusCode;
            //Check status code 
            if (status === 200 || status === 201) {
                //callback success
                callBack(false);
            } else {
                //callback with error
                callBack(`Status code : ${status}`);
            }
        });

        //Add error event to request
        req.on('error', (error) => {
            callBack(error);
        });

        //Add the payload
        req.write(stringPayload);
        
        //End or send request
        req.end();

    } else {
        callBack('Invalid Parameters');
    }
};

//Function to read template content
helper.getTemplate = (templateName, dataObject) => {
    return new Promise((resolve, reject) => {
        //Validate parameters
        templateName = typeof(templateName) === 'string' && templateName.length > 0 ? templateName : false;
        dataObject = typeof(dataObject) === 'object' && dataObject != null ? dataObject : {};
        
        if (templateName) {
            fileSystem.readFile(`${_templateBaseDir}${templateName}.html`, 'utf8', (err, str) => {
                if (!err && str && str.length > 0) {
                    //Do interpolation in string
                    const finalHtmlString = helper.interpolate(str, dataObject);
                    resolve(finalHtmlString);
                } else {
                    reject(err);
                }
            });
        } else {
            reject('Please provide a file name');
        }
    });
};

//Function to add global header and footer
helper.addUniversalTemplates = (mainContent, dataObject) => {
    return new Promise((resolve, reject) => {
        let finalHtmlString = '';
        //Validate parameters
        mainContent = typeof(mainContent) === 'string' && mainContent.length > 0 ? mainContent : '';
        dataObject = typeof(dataObject) === 'object' && dataObject != null ? dataObject : {};
        
        //Get Universal Header
        helper.getTemplate('_header', dataObject).then ( headerString => {
            //Get Universal Footer
            helper.getTemplate('_footer', dataObject).then (footerString => {
                finalHtmlString = headerString + mainContent + footerString;
                resolve(finalHtmlString);
            }).catch(err => {
                console.log(_appConstant.RED_COLOUR, err);
                reject('Could not find universal footer');
            });
        }).catch(err => {
            console.log(_appConstant.RED_COLOUR, err);
            reject('Could not find universal header');
        });
    });
};

//Function to find and replace all keys with there values
helper.interpolate = (htmlString, dataObject) => {
    //Validate parameters
    htmlString = typeof(htmlString) === 'string' && htmlString.length > 0 ? htmlString : '';
    dataObject = typeof(dataObject) === 'object' && dataObject != null ? dataObject : {};

    //Insert global to the dataObject
    for (const key in _config.templateGlobal) {
        if (_config.templateGlobal.hasOwnProperty(key)) {
            dataObject[`global.${key}`] = _config.templateGlobal[key];
        }
    }

    //Replace the value of each keys with there value in the html string
    for (const key in dataObject) {
        if (dataObject.hasOwnProperty(key) && typeof(dataObject[key]) === 'string') {
            htmlString = htmlString.replace(`{${key}}`, dataObject[key]);
        }
    }

    return htmlString;
};

//Function to get static assets
helper.getStaticAsset = (fileName) => {
    return new Promise((resolve, reject) => {
        //Validate filename
        fileName = typeof(fileName) === 'string' && fileName.length > 0 ? fileName : false;
        if (fileName) {
            //Read file data
            fileSystem.readFile(`${_publicDir}${fileName}`, (err, buffer) => {
                if (!err && buffer) {
                    resolve(buffer);
                } else {
                    reject(_appConstant.NOT_FOUND.code);
                }
            });
        } else {
            reject(_appConstant.NOT_FOUND.code);
        }
    });
};

//Export Module
module.exports = helper;
