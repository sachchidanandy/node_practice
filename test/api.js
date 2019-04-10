/**
 * Contains all api call test.
 * 
 * @file api.js
 * @author Sachchidanand
*/

// Dependencies
var assert = require('assert');
var http = require('http');
var _app = require('./../index');
var _config = require('./../libs/config');

// Holder for Tests
var api = {};

// Helpers
var helpers = {};
helpers.makeGetRequest = (path,callback) => {
  // Configure the request details
  var requestDetails = {
    'protocol' : 'http:',
    'hostname' : 'localhost',
    'port' : _config.httpPort,
    'method' : 'GET',
    'path' : path,
    'headers' : {
      'Content-Type' : 'application/json'
    }
  };

  // Send the request
  var req = http.request(requestDetails,(res) => {
      callback(res);
  });
  req.end();
};

// The main init()  should be able to run without throwing => .
api['_app.init should start without throwing'] = async () => {
  assert.doesNotThrow(() => {
    _app.init();
    return true;
  },TypeError);
};

// Make a request to /ping
api['/ping should respond to GET with 200'] = async () => {
  helpers.makeGetRequest('/ping',(res) => {
    assert.equal(res.statusCode,200);
    return true;
  });
};

// Make a request to /api/users
api['/api/users should respond to GET with 400'] = async () => {
  helpers.makeGetRequest('/api/user',(res) => {
    assert.equal(res.statusCode,400);
    return true;
  });
};

// Make a request to a random path
api['A random path should respond to GET with 404'] = async () => {
  helpers.makeGetRequest('/this/path/shouldnt/exist',(res) => {
    assert.equal(res.statusCode,404);
    return true;
  });
};

// Export the tests to the runner
module.exports = api;