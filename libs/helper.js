/**
 * Helper functions
 * 
 * @file helper.js
 * @author Sachchidanand
*/

//Dependency
const crypto = require('crypto');
const _secret = require('../https/keys');
const _appConstant = require('./appConstants');
const _data = require('./data');


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
        console.log('missing', requiredField, arrayOfKeys);
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
                    console.log(typeof(value), value, value.length , _appConstant.TOCKEN_SIZE);
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

            case 'check':
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
}

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
    
}

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
}

//Export Module
module.exports = helper;