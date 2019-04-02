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

//Bind the form
app.bindForms = () => {
    //This is not applicable to arrow
    document.querySelector('form').addEventListener('submit', (event) => {
        //Stop it from submitting
        event.preventDefault();

        //Get form related information
        const form = event.currentTarget;
        const formId = form.id;
        const method = form.method.toUpperCase();
        const action = form.action;

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector(`#${formId} .formError`).style.display = 'hidden';

        // Turn the inputs into a payload
        const payload = {};
        const allElementsObject = form.elements;
        for (const key in allElementsObject) {
            if (allElementsObject.hasOwnProperty(key)) {
                let valueOfElement = allElementsObject[key].type === 'checkbox' ? allElementsObject[key].checked : allElementsObject[key].value;
                payload[allElementsObject[key].name] = valueOfElement;                
            }
        }

        // Call the api
        app.client.request(undefined, action, method, undefined, payload, (statusCode,responsePayload) => {
            // Display an error on the form if needed
            if (statusCode >= 400 ) {
                const errorMessage = typeof(responsePayload.error) === 'string' && responsePayload.error.length > 0 ?  responsePayload.error : 'An error has occured, please try again';

                // Set the formError field with the error text
                document.querySelector(`#${formId} .formError`).innerHTML = errorMessage;

                //Unhide the error field for form
                document.querySelector(`#${formId} .formError`).style.display = 'block';
            } else {
                // If successful, send to form response processor
                app.formResponseProcessor(formId, payload, responsePayload);
            }
        });
    });
};

// Form response processor
app.formResponseProcessor = function(formId,requestPayload,responsePayload){
    var functionToCall = false;
    if(formId == 'accountCreate'){
      // @TODO Do something here now that the account has been created successfully
    }
  };

// Init (bootstrapping)
app.init = function(){
    // Bind all form submissions
    app.bindForms();
  };
  
  // Call the init processes after the window loads
  window.onload = function(){
    app.init();
  };