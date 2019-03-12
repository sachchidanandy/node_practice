const user = {};

user.getUser = (data, callback) => {

    //Callback a http status and a payload
    callback(200, { name : 'Sachin Yadav', email : 'sachin@gmail.com' });
};

module.exports = user;