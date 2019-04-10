/**
 * Contains all the unit test cases.
 * 
 * @file unit.js
 * @author Sachchidanand
*/

//Dependency
const assert = require('assert');
const _helper = require('./../libs/helper');
const _exampleError = require('./../libs/exampleDebuggingProblem');
const _log = require('./../libs/log');

//Module to export
unit = {};

//Assert that the given function should return a number
unit['hepler.getANumber should return a number'] = async () => {
    const returnValue = _helper.getANumber();
    //write assert
    assert.equal(typeof(returnValue),'number');

    return true;
};

//Assert that the given function should return a 1
unit['hepler.getANumber should return 1'] = async () => {
    const returnValue = _helper.getANumber();
    //write assert
    assert.equal(returnValue, 1);

    return true;
};

//Assert that the given function should return 2
unit['hepler.getANumber should return 2'] = async () => {
    const returnValue = _helper.getANumber();
    //write assert
    assert.equal(returnValue, 2);

    return true;
};

//Assert that function should return a false error, non instance of array and a non  empty array 
unit['log.list should return a false error, non instance of array and a non  empty array'] = async () => {
    _log.list(false, (err, list) => {
        //for error is false
        assert.equal(err, false);
        //Given response is an array
        assert.ok(list instanceof Array);
        //Given response having length greater than Zero
        assert.ok(list.length > 0);

        return true;
    });
};

//Assert that the function should not throw error
unit['log.truncate should not throw an error even if file not found'] = async () => {
    assert.doesNotThrow(() => {
        _log.truncate('This file is not present', (err) => {
            assert.ok(err);
            return true;
        });
    },TypeError);
    
};

//Assert that the function should not throw error (For fail as it will throw)
unit['example.init should not throw error (For fail as it will throw)'] = async () => {
    assert.doesNotThrow(() => {
        _exampleError.init();
        return true;
    },TypeError);
};

//Export module
module.exports = unit;