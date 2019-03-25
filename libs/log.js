/**
 * log to write log.
 * 
 * @file log.js
 * @author Sachchidanand
*/

//Dependency
const path = require('path');
const fileSystem = require('fs');
const zipLib = require('zlib');
const _appConst =require('./appConstants');

//Container module for log
const log  = {};

//Base directry of the log
log.baseDir = path.join( __dirname, '../.log/' );

//Append string to the file and create file if it dosen't exixt
log.append = (file = '', str =  '', callBack) =>{
    //Open file in append mode
    fileSystem.open(`${log.baseDir}${file}.log`, 'a', (err, fileDescriptor) => {
        //Check for error
        if (!err && fileDescriptor) {
            //Append string in the log file
            fileSystem.appendFile(fileDescriptor, `${str}\n`, (err) => {
                //Check for error
                if (!err) {
                    //Closing the file stream
                    fileSystem.close(fileDescriptor, (err) => {
                        //Check for error
                        if (!err) {
                            //callback with false error response
                            callBack(false);
                        } else {
                            //callback with error response
                            callBack(_appConst.ERROR_FILE_APPEND_CLOSE);                            
                        }
                    });
                } else {
                    //callback with error response
                    callBack(_appConst.ERROR_FILE_APPEND);
                }
            });
        } else {
            //callback with error response
            callBack(_appConst.ERROR_OPEN_FILE_APPEND);
        }
    });
};

//Function to list all the log files
log.list = (includeCompressedFiles, callBack) => {
    //Get list of all files in the .log dir
    fileSystem.readdir(log.baseDir, (err, fileList) => {
        if (!err && fileList && fileList.length > 0) {
            const listOfFile = [];
            fileList.map(fileName => {
                //add .log file in list
                if (fileName.indexOf('.log') > -1) {
                    listOfFile.push(fileName);
                }

                //add .gz file in list
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressedFiles) {
                    listOfFile.push(fileName);                    
                }
            });
            //Callback false error and list of files
            callBack(err, listOfFile);
        } else {
            //Callback error and empty array
            callBack(err, []);
        }
    });
};

//Function to compress logfile
log.compress = (logFileName, compFileName, callBack) => {
    const destFileName = `${compFileName}.gz.b64`;

    //Read the orriginal logfile data
    fileSystem.readFile(`${log.baseDir}${logFileName}`, (err, inputBuffer) => {
        //check for error
        if (!err && inputBuffer) {
            //Compress data using zlib
            zipLib.gzip(inputBuffer, (err, zipBuffer) => {
                //Check for error
                if (!err && zipBuffer) {
                    //Send data to the destination file
                    fileSystem.open(`${log.baseDir}${destFileName}`, 'wx', (err, fileDescriptor) => {
                        //Check for error
                        if (!err && fileDescriptor) {
                            //Write to destination file
                            fileSystem.writeFile(fileDescriptor, zipBuffer.toString('base64'), (err) => {
                                if (!err) {
                                    //Close the destination file
                                    fileSystem.close(fileDescriptor, (err) => {
                                        if (!err) {
                                            callBack(false);
                                        } else {
                                            callBack(err);
                                        }
                                    });
                                } else {
                                    callBack(err);
                                }
                            });
                        } else {
                            callBack(err);
                        }
                    });
                } else {
                    callBack(err);
                }
            });
        } else {
            callBack(err);
        }
    });
};

//Truncate old log file
log.truncate = (logFileName, callBack) => {
    fileSystem.truncate(`${log.baseDir}${logFileName}`, 0, (err) => {
        if (!err) {
            callBack(false);
        } else {
            callBack(err);
        }
    });
};

//Function to decompress compressed log file
log.decompress = (fileName, callBack) => {
    //Read utf8 encoded string from file
    fileSystem.readFile(`${log.baseDir}${fileName}`,'utf8', (err, str) => {
        if (!err && str) {
            //Decode utf8 encoded string to base64 encoded buffer
            const inputBuffer = Buffer.from(str, 'base64');
            //Unzip the buffer
            zipLib.unzip(inputBuffer, (err, outputBuffer) => {
                if (!err && outputBuffer) {
                    //Convert output buffer into string
                    str = outputBuffer.toString();
                    callBack(false, str);
                } else {
                    callBack(err, '');
                }
            });
        } else {
            callBack(err)   
        }
    });
};

//Export module
module.exports = log;