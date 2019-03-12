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
 const routes = require('./libs/router');

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

        //Create data object
        const data = {
            headers,
            method,
            queryStringObject,
            trimmedPath,
            payload : buffer
        };

        //Choose handler
        const choosenHandler = routes.hasOwnProperty(trimmedPath) ? routes[trimmedPath] : routes.notFound;
        choosenHandler(data, (statusCode, payload) => {
            
            //Set default http status code
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            //Set default payload as an empty object
            payload = typeof(payload) === 'object' ? payload : {};

            //JSON response
            const JsonPayload = JSON.stringify(payload);

            //Sending response
            res.writeHead(statusCode)
            res.end(JsonPayload);

            //Log
            console.log('Response Status Code : ', statusCode,
                '\nResponse Payload: ', JsonPayload
            );

        });
    });
 });

 //Starting server
 server.listen(3000,() => {
    console.log('Server Is Listening at port 3000');
 })
