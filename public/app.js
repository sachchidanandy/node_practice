/*
 * Frontend Logic for application
 *
*/

//Container for the frontend application
var app = {};

//config
app.config = {
    'sessionToken' : false
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

    //Append session token if present
    if (app.config.sessionToken) {
        requestHeader.append('token', app.config.sessionToken.token);
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
    //Check if form is present in the page 
    if (document.querySelector('form')) {
        //Get all forms
        const allForms = document.querySelectorAll('form');

        for (const key in allForms) {
            if (allForms.hasOwnProperty(key)) {
                allForms[key].addEventListener('submit', (event) => {
                    //Stop it from submitting
                    event.preventDefault();
        
                    //Get form related information
                    const form = event.currentTarget;
                    const formId = form.id;
                    let method = form.method.toUpperCase();
                    const action = form.action;
                    
                    // Hide the error message (if it's currently shown due to a previous error)
                    document.querySelector(`#${formId} .formError`).style.display = 'hidden';
        
                    // Turn the inputs into a payload
                    const payload = {};
                    const allElementsObject = form.elements;
                    for (const key in allElementsObject) {
                        if (allElementsObject.hasOwnProperty(key)) {
                            //Check for multi value selector
                            if (allElementsObject[key].className === 'multiselect intval') {
                                if (payload.hasOwnProperty('successCode')) {
                                    allElementsObject[key].checked ? payload['successCode'].push(allElementsObject[key].value) : null;
                                } else {
                                    payload['successCode'] = [];
                                    allElementsObject[key].checked ? payload['successCode'].push(allElementsObject[key].value) : null;
                                }
                            } else {
                                let valueOfElement = allElementsObject[key].type === 'checkbox' ? allElementsObject[key].checked : allElementsObject[key].type === 'select' ? allElementsObject[key].options[allElementsObject[key].selectedIndex].value : allElementsObject[key].value;
                                if (allElementsObject[key].name === '_method') {
                                    method = valueOfElement.toUpperCase();
                                } else {
                                    let elementName = allElementsObject[key].name === 'httpmethod' ? 'method' : allElementsObject[key].name;
                                    payload[elementName] = valueOfElement;   
                                }
                            }
                        }
                    }
        
                    //Turn input into query string object
                    const queryStringObject = method === 'DELETE' ? payload : {};

                    // Call the api
                    app.client.request(undefined, action, method, queryStringObject, payload, (statusCode,responsePayload) => {
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
            }
        }
    }
};

// Form response processor
app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
    var functionToCall = false;

    // If account creation was successful, try to immediately log the user in
    if (formId == 'accountCreate'){
        //Take phone number and password from request payload
        const newPayload = {
            'phone' : requestPayload.phone,
            'password' : requestPayload.password
        };

        //Create token for the user
        app.client.request(undefined, 'api/token', 'POST', undefined, newPayload, (newStatusCode, newResponse) => {
            if (newStatusCode >= 400) {
                //Set error message
                window.querySelector(`#${formId} .formError`).innerHTML = 'Sorry, an error has occured. Please try again.';
                
                //Show the error div
                window.querySelector(`#${formId} .formError`).style.display = 'block';
            } else {
                app.setSessionToken(newResponse);
                window.location = '/checks/all';
            }
        });
    }

    //If login success
    if (formId === 'sessionCreate') {
        app.setSessionToken(responsePayload);
        window.location = '/checks/all'
    }

    // If forms saved successfully and they have success messages show them
    if(['accountEdit1', 'accountEdit2'].indexOf(formId) > -1){
        document.querySelector(`#${formId} .formSuccess`).style.display = 'block';
    }

    // If user deletes the account
    if (formId === 'accountEdit3') {
        app.logUserOut(false);
        window.location = '/account/deleted'
    }

    // If new check added success
    if (formId === 'checksCreate') {
        window.location = '/checks/all'
    }
};

//Set token in the sessionToken as well as into the local storage 
app.setSessionToken = token => {
    //Set sessionToken to config.
    app.config.sessionToken = token;

    //Set token into the local storage
    const tokenString = JSON.stringify(token);
    localStorage.setItem('token', tokenString);
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = add => {
    var target = document.querySelector("body");
    if (add){
      target.classList.add('loggedIn');
    } else {
      target.classList.remove('loggedIn');
    }
};

//Get token from localstorage
app.getTokenFromLocalStorage = () => {
    //get token string
    const tokenString = localStorage.getItem('token');
    
    if (typeof(tokenString) === 'string') {
        try {
            const token = JSON.parse(tokenString);
            //Validate token Object
            if (typeof(token) === 'object' && token.hasOwnProperty('token')) {
                //set config token object
                app.config.sessionToken = token;
                //set login class 
                app.setLoggedInClass(true);
            } else {
                //set config token object
                app.config.sessionToken = false;
                //set login class 
                app.setLoggedInClass(false);
            }
        } catch (error) {
            //set config token object
            app.config.sessionToken = false;
            //set login class
            app.setLoggedInClass(false);
        }
    }
};

//Function to renew token
app.renewToken = callback => {
    //token object
    const tokenObject = app.config.sessionToken;
    if (typeof(tokenObject) === 'object' && tokenObject.hasOwnProperty('token')) {
        //create new payload
        const payload = {
            'token' : tokenObject.token,
            'extend' : true
        }

        //call api to extend token
        app.client.request(undefined, 'api/token', 'PUT', undefined, payload, (statusCode, responseObject) => {
            if (Number(statusCode) === 200) {
                //Create queryStringObject for request
                const queryStringObject = {
                    token : tokenObject.token
                };
                //Get token
                app.client.request(undefined, 'api/token', 'GET', queryStringObject, undefined, (statusCode, responseObject) => {
                    if (Number(statusCode) === 200) {
                        app.setSessionToken(responseObject);
                        callback(false);
                    } else {
                        app.setSessionToken(false);
                        callback(true);
                    }
                });
            } else {
                app.setSessionToken(false);
                callback(true);
            }
        });
    } else {
        //set config token object
        app.config.sessionToken = false;
        //set login class
        app.setLoggedInClass(false);
    }
}; 

// Loop to renew token often
app.tokenRenewalLoop = () => {
    setInterval(function(){
      app.renewToken(function(err){
        if(!err){
          console.log("Token renewed successfully @ "+Date.now());
        }
      });
    },1000 * 60);
};

//Handle delete session (log our)
app.logUserOut = () => {
    //get token from config
    const token = app.config.sessionToken.hasOwnProperty('token') ? app.config.sessionToken.token : false;
    //Prepare query string object
    const queryString= {
        'token' : token
    };

    //request to delete tocken
    app.client.request(undefined, 'api/token', 'DELETE', queryString, undefined, (statusCode, response) => {
        
        //delete session from local memory
        app.setSessionToken(false);

        //redirect to logout page
        window.location = '/session/deleted';
    });
};

//Binding logout button to listener
app.bindLogoutButton = () => {
    document.getElementById('logoutButton').addEventListener('click', (event) => {
        // Stop it from redirecting anywhere
        event.preventDefault();

        // Log the user out
        app.logUserOut();
    });
};

// Load data on the page
app.loadDataOnPage = () => {
    // Get the current page from the body class
    var bodyClasses = document.querySelector("body").classList;
    var primaryClass = typeof(bodyClasses[0]) === 'string' ? bodyClasses[0] : false;

    // Logic for account settings page
    if(primaryClass === 'accountEdit'){
        app.loadAccountEditPage();
    }

    //Load data on dashboard    
    if(primaryClass === 'checksList'){
        app.loadChecksListPage();
    }
};

//Load data for edit page specially
app.loadAccountEditPage = () => {
    //get phone number from config
    const phone = app.config.sessionToken.hasOwnProperty('phone') ? app.config.sessionToken.phone : false;

    if (phone) {
        //Create queryObject
        const queryStringObject = {
            'phone' : phone
        }
        //Fetch data of the user
        app.client.request(undefined, 'api/user', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
            if (Number(statusCode) === 200) {
                //Set value in the form
                document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
                document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
                document.querySelector("#accountEdit1 .displayPhoneInput").value = responsePayload.phone;

                // Put the hidden phone field into both forms
                const hiddenPhoneFields = document.querySelectorAll("input.hiddenPhoneNumberInput");
                for (const key in hiddenPhoneFields) {
                    if (hiddenPhoneFields.hasOwnProperty(key)) {
                        const hiddenPhoneField = hiddenPhoneFields[key];
                        hiddenPhoneField.value = responsePayload.phone;
                    }
                }
            } else {
                app.logUserOut();
            }
        });
    } else {
        app.logUserOut();
    }
};

//(Dashboard Page) Load all checks and insert data into table
app.loadChecksListPage  = () => {
    //get user phone number 
    const phone = app.config.sessionToken.hasOwnProperty('phone') ? app.config.sessionToken.phone : false;

    //Check phone number is valid
    if (Number(phone) && phone.length === 10) {
        //Get user details
        app.client.request(undefined, 'api/user', 'GET', {'phone' : phone}, undefined, (statusCode, responseObject) => {
            if (Number(statusCode) === 200) {
                const allChecks = responseObject.hasOwnProperty('checks') ? responseObject.checks : [];

                if (allChecks.length) {
                    const checkTable = document.getElementById('checksListTable');
                    //Get data of each check
                    allChecks.map(checkId => {
                        app.client.request(undefined, 'api/check', 'GET', {checkId}, undefined, (statusCode, check) => {
                            if (Number(statusCode) === 200) {
                                //Create row for check (-1) is to insert row at last
                                const tableRow = checkTable.insertRow(-1);
                                if (typeof(check) === 'object') {
                                    tableRow.insertCell(0).innerHTML = check.hasOwnProperty('method') ? check.method.toUpperCase() : null;
                                    tableRow.insertCell(1).innerHTML = check.hasOwnProperty('protocol') ? `${check.protocol}://` : null;
                                    tableRow.insertCell(2).innerHTML = check.hasOwnProperty('url') ? check.url : null;
                                    tableRow.insertCell(3).innerHTML = check.hasOwnProperty('lastState') &&  check.lastState ? check.lastState : 'unknown';
                                    tableRow.insertCell(4).innerHTML = `<a href = "/checks/edit?id=${check.checkId}">View / Edit / Delete</a>`;
                                }
                            } else {
                                console.log(`Can't able to load detail of check Id : ${checkId}`);
                            }
                        });
                    });

                    if (allChecks.length < 5) {
                        //Show message to create new check
                        document.getElementById("createCheckCTA").style.display = 'block';
                    }
                } else {
                    //Show message if not have any check
                    document.getElementById('noChecksMessage').style.display = 'table-row';

                    //Show message to create new check
                    document.getElementById("createCheckCTA").style.display = 'block';
                }
                //show message if there is no check present
            } else {
                // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
                app.logUserOut()
            }
        });
    } else {
        //Invalid phone number
        app.logUserOut();
    }
};

// Init (bootstrapping)
app.init = () => {
    // Bind all form submissions
    app.bindForms();

    //Fetch token from local
    app.getTokenFromLocalStorage();

    //Renew token loop
    app.tokenRenewalLoop();

    //Bind logout button
    app.bindLogoutButton();

    // Load data on Edit page
    app.loadDataOnPage();
};
  
// Call the init processes after the window loads
window.onload = () => {
    app.init();
};