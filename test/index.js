/**
 * Entry point for the test.
 * 
 * @file index.js
 * @author Sachchidanand
*/

//Dependecy
const assert = require('assert');
const _helper = require('./../libs/helper');
const _appConst = require('./../libs/appConstants');

//Module constain test
const _app = {};

//Container for the test
_app.test = {
    'unit' : {}
};

//Assert that the given function should return a number
_app.test.unit['hepler.getANumber should return a number'] = async () => {
    const returnValue = _helper.getANumber();
    //write assert
    assert.equal(typeof(returnValue),'number');

    return true;
};

//Assert that the given function should return a 1
_app.test.unit['hepler.getANumber should return 1'] = async () => {
    const returnValue = _helper.getANumber();
    //write assert
    assert.equal(returnValue, 1);

    return true;
};

//Assert that the given function should return a 2
_app.test.unit['hepler.getANumber should return 2'] = async () => {
    const returnValue = _helper.getANumber();
    //write assert
    assert.equal(returnValue, 2);

    return true;
};

_app.countTotalTest = () => {
    let totalTest = 0
    for (const testType in _app.test) {
        if ( _app.test.hasOwnProperty(testType)) {
            let subTest = _app.test[testType];
            for (const testName in subTest) {
                if (subTest.hasOwnProperty(testName)) {
                    totalTest++;
                }
            }
        }
    }

    return totalTest;
}
//Test runner
_app.testRunner = () => {
    const limit =  _app.countTotalTest();
    let totalTest = 0;
    let errorArray = [];
    let success = 0;
    let failed = 0;

    for (const testType in _app.test) {
        if ( _app.test.hasOwnProperty(testType)) {
            let subTest = _app.test[testType];
            for (const testName in subTest) {
                if (subTest.hasOwnProperty(testName)) {
                    //Write a self executing loop
                    let tmpTestName = testName;
                    let testValue = subTest[testName];
                    (function(){
                        testValue().then(() => {
                            console.log(_appConst.GREEN_COLOR, tmpTestName);
                            success++;
                            totalTest++;
                            totalTest === limit ?  _app.testReport(totalTest, success, failed, errorArray) : null;
                        }).catch((error) => {
                            console.log(_appConst.RED_COLOUR, tmpTestName);
                            failed++;
                            totalTest++;
                            errorArray.push({
                                'testName' : tmpTestName,
                                'errorMessage' : error
                            });
                            totalTest === limit ?  _app.testReport(totalTest, success, failed, errorArray) : null;
                        });
                    })();
                }
            }
        }
    }
};

//Function to producce test report
_app.testReport = (totalTest, success, failed, errorArray) => {
    console.log('------------------------ TEST REPORT STARTS ------------------------');
    console.log('');
    console.log(_appConst.DARK_BLUE_COLOR, `Total Test Case Executer : ${totalTest}`);
    console.log('');
    console.log(_appConst.GREEN_COLOR, `Total Test Case Passed : ${success}`);
    console.log('');
    console.log(_appConst.RED_COLOUR, `Total Test Case Failed : ${failed}`);
    console.log('');

    if (errorArray.length > 0) {
        console.log('------------------------ ERROR REPORT ------------------------');
        console.log('');
        errorArray.map(error => {
            console.log(_appConst.DARK_BLUE_COLOR, error.testName);
            console.log('');
            console.log(_appConst.RED_COLOUR, error.errorMessage);
            console.log('');
        });
    }
    console.log('------------------------ TEST REPORT ENDS ------------------------');
};

//Run test
_app.testRunner();