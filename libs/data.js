/**
 * Library ffor storing and editing data
 * 
 * @file data.js
 * @author Sachchidanand
*/

//Dependencies
const fileSystem =  require('fs');
const path = require('path');

//Container for the module to be exported
const lib = {};

//Path of data base directry
lib.baseDir = path.join(__dirname, '/../.data');

//Function to write data in file
lib.create = (dir, file, data, callBack)=> {
    
    //Open File for writing
    fileSystem.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            //Convert JSON data into String
            const stringData = JSON.stringify(data);
            
            //Writing into file
            fileSystem.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    //closing the file
                    fileSystem.close(fileDescriptor, (err) => {
                        if (!err) {
                            callBack(false);
                        } else {
                            callBack('Error in closing new file');
                        }
                    });
                } else {
                    callBack('Error in writing to new file');                    
                }
            });
        } else {
            callBack('Could not create new file it may already exist');
        }
    });
};

//Function to read data from file
lib.read = (dir, file, callBack) => {
    fileSystem.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
        callBack(err, data);
    });
};

//Function to update data in file
lib.update = (dir, file, data, callBack) => {
    
    //Open File in read and write mode
    fileSystem.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            //Converting data into JSON string
            const stringData = JSON.stringify(data);

            //Truncate old file before writing new data
            fileSystem.truncate(fileDescriptor,(err) => {
                if (!err) {
                    //Write new data into the file
                    fileSystem.writeFile(fileDescriptor, stringData, (err) => {
                        if (!err) {
                            fileSystem.close(fileDescriptor, (err) => {
                                if (!err) {
                                    callBack(false);
                                } else {
                                    callBack('Error in closing file');
                                }
                            });
                        } else {
                            callBack('Error in writing data into file');
                        }
                    });
                } else {
                    callBack('Error in truncating file');
                }
            });
        } else {
            callBack('Erro in Opening file may file does not exist');
        }
    });
}

//Function to delete file from file system
lib.delete = (dir, file, callBack) => {
    fileSystem.unlink(`${lib.baseDir}/${dir}/${file}.json`, (err) => {
        if (!err) {
            callBack(false);
        } else {
            callBack('Error in deleting file');
        }
    });
}

//List all filess in the dir
lib.list = (dir) => {
    return new Promise(function(resolve, reject) {
        fileSystem.readdir(`${lib.baseDir}/${dir}/`, (err, fileList) => {
            if (!err && fileList) {
                resolve(fileList.map( fileName => fileName.replace('.json', '')));
            } else {
                reject(err);
            }
        });
    });
}

//Export module
module.exports = lib;
