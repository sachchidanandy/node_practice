const user = require('./user');

const notFound = (data, callback) => {

    //Callback a http status and a payload
    callback(404, {message : 'Page Not Found'});
};

const routes = {
    'user' : user.getUser,
    'notFound' : notFound
};

module.exports = routes;