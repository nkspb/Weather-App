const https = require('https');
// for status codes
const http = require('http');
const api = require('./api.json');

// Print out temp details
function printWeather(weather){
    const message = `Current temperature in ${weather.name} is ${weather.main.temp}F`; 
    console.log(message);
}

// Print out error message
function printError(error) {
    console.error(error.message);
}

function get(query) {
    // connect to the API url
    // if user entered number, treat it as city ID
    if (query.typeof == 'number'){
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${query}&&APPID=${api.key}`;
    // otherwise as city name
    } else {
        // if city and country passed, seperate them by comma
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query.join(",")}&&APPID=${api.key}`;
    }
    // check if url is malformed
    try { 
        const request = https.get(apiUrl, response => {
        if (response.statusCode === 200) {
            let body = "";
            response.on('data', data => {
                // read the data
                body += data.toString();    
            });
            response.on('end', () => {
                try {
                    const weather = JSON.parse(body);
                    printWeather(weather);    
                } catch(error) {
                    printError(error);
                }
            });    
        } else {
            // Status code error
            const statusCodeError = new Error(`There was an error getting the message for ${query}. (${http.STATUS_CODES[response.statusCode]})`);
            printError(statusCodeError);
        }
    });    
    // wrong url
    request.on('error', printError);
    } catch(error) {
        printError(error);  
    }
}

module.exports.get = get;