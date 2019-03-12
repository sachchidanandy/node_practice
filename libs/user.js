/**
 * @functions to handle user's related operations.
 * 
 * @file user.js
 * @author Sachchidanand
*/

//User object
const user = {};

/**
 * @function getUser to fetch user related details 
 * 
 * @argument data object
 * @argument callback function
*/
user.getUser = (data, callback) => {

    //Callback a http status and a payload
    callback(200, { name : 'Sachin Yadav', email : 'sachin@gmail.com' });
};

module.exports = user;