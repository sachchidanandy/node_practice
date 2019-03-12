/**
 * Entry point of the project. Configure Server
 * 
 * @file index.js
 * @author Sachchidanand
 */

 //Dependencies
 const http = require('http');

 //Creating Server
 const server = http.createServer((req, res) => {
    res.end('Hello Friends from Sachin \n');
 });

 //Starting server
 server.listen(3000,() => {
    console.log('Server Is Listening at port 3000');
 })
