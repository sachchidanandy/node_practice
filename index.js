/**
 * Entry point of the project. Configure Server
 * 
 * @file index.js
 * @author Sachchidanand
 */

 //Dependencies
 const http = require('http');
 const url  = require('url');
 const StringDecoder = require('string_decoder').StringDecoder;

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

    //Get the payload if any (using utf-8 decoder)
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    //Adding a data event listener which will listen to stream data comming
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    //Adding a end event listener which will be called every time
    req.on('end', () => {
        buffer += decoder.end();

        //Sending response
        res.end('Hello From Sachin\n');

        //Log
        console.log('Request Path: ', trimmedPath,
            '\nRequest Method: ', method,
            '\nRequest Query String Object: ', queryStringObject,
            '\nRequest Headers: ', headers,
            '\nRequest Buffer (payload or body): ', buffer
        );
    });
 });

 //Starting server
 server.listen(3000,() => {
    console.log('Server Is Listening at port 3000');
 })
