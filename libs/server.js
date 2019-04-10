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
const util = require('util');
const _debug = util.debuglog('server');
const _routes = require('./router');
const _config = require('./config'); 
const _helper = require('./helper');
const _appConst = require('./appConstants');

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
        // const directoryPath = trimmedPath.split('/')[0]; Used for old logic
        let choosenHandler = _routes.hasOwnProperty(trimmedPath) ? _routes[trimmedPath] : _routes.notFound;
        //Logic for public handler
        choosenHandler = trimmedPath.indexOf('public/') > -1 ? _routes.public : choosenHandler;

        try {
            choosenHandler(data, (statusCode, payload, contentType = 'json', method, trimmedPath) => {
                server.processHandlerResponse(res, statusCode, payload, contentType, method, trimmedPath);
            });
        } catch (error) {
            server.processHandlerResponse(res, 500, {error : 'Some thing went wrong'},'json');
        }
    });
};

//Process the handler response
server.processHandlerResponse = (res, statusCode, payload, contentType = 'json', method, trimmedPath) => {
    //Set default http status code
    statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
    //Set default payload as empty String
    let payloadString = ''

    //Response content on basis of content type = json
    if (contentType === 'json') {
        res.setHeader('Content-Type', 'application/json');
        //Set default payload as an empty object
        payload = typeof(payload) === 'object' ? payload : {};
        //JSON response to string
        payloadString = JSON.stringify(payload);
    }

    //Response content on basis of content type = html
    if (contentType === 'html') {
        res.setHeader('Content-Type', 'text/html');
        //Set default payload as an empty string
        payloadString = typeof(payload) === 'string' ? payload : '';
    }

    //Response content on basis of content type = favicon
    if (contentType === 'favicon') {
        res.setHeader('Content-Type', 'image/x-icon');
        //Set default payload as an empty string
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }
    
    //Response content on basis of content type = plain
    if(contentType == 'plain'){
        res.setHeader('Content-Type', 'text/plain');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }

    //Response content on basis of content type = css
    if(contentType == 'css'){
        res.setHeader('Content-Type', 'text/css');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }

    //Response content on basis of content type = png
    if(contentType == 'png'){
        res.setHeader('Content-Type', 'image/png');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }

    //Response content on basis of content type = jpg
    if(contentType == 'jpg'){
        res.setHeader('Content-Type', 'image/jpeg');
        payloadString = typeof(payload) !== 'undefined' ? payload : '';
    }

    //Sending response
    res.writeHead(statusCode);
    res.end(payloadString);

    //Log
    const colourCode = [200, 201].indexOf(statusCode) > -1 ? _appConst.GREEN_COLOR : _appConst.RED_COLOUR; 
    _debug(colourCode,`method : ${method}, path : ${trimmedPath}, status: ${statusCode}, response: ${contentType === 'json' ? payloadString : contentType}`);
};

//function to init server
server.init = () => {
    return new Promise( (resolve, reject) => {
        try {
            //Starting HTTP Server
            server.httpServer.listen(_config.httpPort,() => {
                console.log('\x1b[36m%s\x1b[0m',`For HTTP :\n  Server is listening at port ${_config.httpPort} in ${_config.envName} mode`);
            });

            //Starting HTTPS Server
            server.httpsServer.listen(_config.httpsPort,() => {
                console.log('\x1b[35m%s\x1b[0m',`For HTTPS :\n  Server is listening at port ${_config.httpsPort} in ${_config.envName} mode`);
            });

            //resolve
            resolve();
        } catch (error) {
            reject(_appConst.SERVER_START_ERROR);
        }
    });
};

//Export server module
module.exports = server;
