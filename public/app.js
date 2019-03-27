/*
 * Frontend Logic for application
 *
*/

//Container for the frontend application
var app = {};

//config
app.config = {
    'sessionTocken' : false
};

//AJAX client ( for REST full API)
app.client = {};

//Interface to make API calls
app.client.request = (headers, path, method, queryStringObject, payload, callback) => {
    //Set default
    headers = typeof(headers) === 'object' && headers !== null ? headers : {};
    method = typeof(method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
    path = typeof(path) === 'string' ? path : '/';
    queryStringObject = typeof(queryStringObject) === 'object' && queryStringObject !== null ? queryStringObject : {};
    payload = typeof(payload) === 'object' && payload !== null ? payload : {};
    callback = typeof(callback) === 'function' ? callback : false;

    //Create header for request
    const requestHeader = new Headers(Object.assign({}, {'Content-Type' : 'application/json'}, headers));

    //Append session tocken if present
    if (app.config.sessionTocken) {
        requestHeader.append(tocken, app.config.sessionTocken);
    }

    //Create requestUrl
    let requestUrl = path + '?';
    for (const queryKey in queryStringObject) {
        if (queryStringObject.hasOwnProperty(queryKey)) {
            requestUrl += `${queryKey}=${queryStringObject[queryKey]}&`;
        }
    }
    //Remove extra & from end
    requestUrl = requestUrl.slice(0, requestUrl.length -1);

    //Create request init Object
    const requestObject = {
        'headers' : requestHeader,
        'method' : method
    };

    //Add body if requeest is put or post
    if (['POST', 'PUT'].indexOf(method) > -1) {
        requestObject.body = JSON.stringify(payload)
    }

    //Response status
    let status = '';
    
    //Request Url
    fetch(requestUrl, requestObject).then (response => {
        status = response.status;
        return response.json();
    }).then( responseBody =>  {
        if (callback) {
            callback(status, responseBody);
        }
    }).catch(err => {
        console.log(err);
    });
};