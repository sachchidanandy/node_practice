/**
 * Configure and start Server
 * 
 * @file server.js
 * @author Sachchidanand
*/

//Dependencies
const http = require('http');
const https = require('https');
const url  = require('url');
const fileSystem = require('fs');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;
const _routes = require('./router');
const _config = require('./config'); 
const _helper = require('./helper');

//Server module
const server = {};

//Initialize HTTP Server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});

//Initialize HTTPS Server
server.httpsServerOptions = {
    key : fileSystem.readFileSync(path.join(__dirname, '/../https/key.pem')),
    cert : fileSystem.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req, res);
});

//All the server logic for both the http and https server
server.unifiedServer = (req, res) => {
    //Get url and parse it
    const parsedUrl = url.parse(req.url, true);
    
    //Get path from parsed url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/|\/$/g, '');

    //Get the request methos
    const method = req.method.toLowerCase();

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

        //Convert buffer string into object
        buffer = _helper.convsertJsonToObject(buffer);

        //Create data object
        const data = {
            headers,
            method,
            queryStringObject,
            trimmedPath,
            payload : buffer
        };
        
        //Choose handler
        const directoryPath = trimmedPath.split('/')[0];
        const choosenHandler = _routes.hasOwnProperty(directoryPath) ? _routes[directoryPath] : _routes.notFound;
        choosenHandler(data, (statusCode, payload) => {
            
            //Set default http status code
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

            //Set default payload as an empty object
            payload = typeof(payload) === 'object' ? payload : {};

            //JSON response
            const JsonPayload = JSON.stringify(payload);

            //Sending response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(JsonPayload);

            //Log
            console.log('Response Status Code : ', statusCode,
                '\nResponse Payload: ', JsonPayload
            );
        });
    });
};

//function to init server
server.init = () => {
    //Starting HTTP Server
    server.httpServer.listen(_config.httpPort,() => {
        console.log(`For HTTP :\n  Server is listening at port ${_config.httpPort} in ${_config.envName} mode`);
    });

    //Starting HTTPS Server
    server.httpsServer.listen(_config.httpsPort,() => {
        console.log(`For HTTPS :\n  Server is listening at port ${_config.httpsPort} in ${_config.envName} mode`);
    });
};


//Export server module
module.exports = server;
