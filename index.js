/**
 * Entry point of the project. Configure Server
 * 
 * @file index.js
 * @author Sachchidanand
 */

 //Dependencies
 const http = require('http');
 const url  = require('url');

 //Creating Server
 const server = http.createServer((req, res) => {

    //Get url and parse it
    const parsedUrl = url.parse(req.url, true);
    
    //Get path from parsed url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/|\/$/g, '');

    //Get the request methos
    const method = req.method.toUpperCase();

    //Get and parse query string
    const queryStringObject = parsedUrl.query;

    //Get headers
    const headers = req.headers;
    
    //Sending response
    res.end('Hello From Sachin\n');

    //Log
    console.log(`Request Path: ${trimmedPath}\nRequest Method: ${method}\nRequest Query String Object:`, queryStringObject, `\nRequest Headers:`, headers);

 });

 //Starting server
 server.listen(3000,() => {
    console.log('Server Is Listening at port 3000');
 })
