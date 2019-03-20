/**
 * Helper functions
 * 
 * @file helper.js
 * @author Sachchidanand
*/

//Dependency
const crypto = require('crypto');
const _secret = require('../https/keys');
const _appConst = require('./appConstants');
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
        console.log('missing');
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
                if ( typeof(value) != 'string' || value.length < _appConst.TOCKEN_SIZE) {
                    console.log(typeof(value), value, value.length , _appConst.TOCKEN_SIZE);
                    return false;
                }
                break;
            
            case 'extend':
                value = data[key];
                if (typeof(value) != 'boolean' || !value) {
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
        const tockenPool = _appConst.TOCKEN_CHAR_POOL;

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
helper.validateTocken = (tocken, phone, callBack) => {
    _data.read('tockens', tocken, (err, data) => {
        if (!err && data) {
            //Convert JSON data into object
            data = helper.convsertJsonToObject(data);

            if (data) {
                //Check if tocken belongs to that user and haven't expired
                if (data.phone === phone && data.expires > Date.now()) {
                    callBack(false);
                } else {
                    callBack(_appConst.TOCKEN_AUTH_ERROR);
                }
            } else {
                callBack(_appConst.READ_DATA_ERROR);
            }
        } else {
            callBack('Tocken ' + _appConst.NOT_FOUND.message);
        }
    });
}

//Export Module
module.exports = helper;