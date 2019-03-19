/**
 * Helper functions
 * 
 * @file helper.js
 * @author Sachchidanand
*/

//Dependency
const crypto = require('crypto');
const _secret = require('../https/keys');


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
    for (const key in data) {
        switch (key) {
            case 'phone':
                const phone = data[key].split(' ').join('');
                if (phone.length < 10 || ! Number(phone)) {
                    return false;
                }
                break;
            
            case 'firstName':
                const firstName = data[key].split(' ').join('');
                if ( typeof(firstName) != 'string' || firstName.length < 3) {
                    return false;
                }
                break;
            
            case 'lastName':
                const lastName = data[key].split(' ').join('');
                if ( typeof(lastName) != 'string' || lastName.length < 3) {
                    return false;
                }
                break;

            case 'password':
                const password = data[key].split(' ').join('');
                if ( typeof(password) != 'string' || password.length < 8) {
                    return false;
                }
                break;

            case 'TNC':
                const tnc = data[key];
                if (typeof(tnc) != 'boolean' || !tnc) {
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
helper.createPassword = (passwordText) => {
    //Generate Cryptographically Secure Pseudo-Random Number (CSPRN) for salt
    const salt = crypto.randomBytes(32).toString('hex');

    //Create hashed password
    const hashedPassword = crypto.createHmac('sha256',_secret.passwordKey)
        .update(salt+passwordText+salt).digest('hex');

    return {
        salt,
        password : hashedPassword
    };
}

//Export Module
module.exports = helper;