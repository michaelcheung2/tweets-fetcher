#!/usr/bin/env node

// Initialize variables
var request = require('request');
var filestream = require('fs');
var dictionary = {};
var rowcount = 0;
var file;
const sApiUrlPath = 'https://badapi.iqvia.io/api/v1/Tweets';
const sStartDate = "2016-01-01T00:00:00.000Z";
const sEndDate = "2017-12-31T23:59:59.999Z";
var sApiUrlPathWithParameters = sApiUrlPath + '?startDate=' + sStartDate + '&endDate=' + sEndDate;
var options = {
    url: '',
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

// Gets all tweets in the specified range.
function getAllTweets() {
    file = filestream.createWriteStream('tweetsresults.txt');
    console.log("\nStarted fetching tweets, please wait...\n");
    console.time('Execution Time');
    function getMoreTweets(sApiUrlPathWithParameters) {
        // Initiate actual calls to the live REST API.
        return getTweets(sApiUrlPathWithParameters).then(function(results) {
            // If the HTTP GET request to the API succeeds, then parse results and proceed.
            let json = JSON.parse(results);
            if (json.length > 0) {
                for (var i = 0; i <= json.length - 1; i++) {
                    let tweetid = json[i].id;
                    // Check for duplicates.
                    if (!(tweetid in dictionary)) {
                        rowcount++;
                        dictionary[tweetid] = '1';
                        // Write this tweet to a text file.
                        file.write(rowcount + '. id: ' + tweetid + ' | stamp: ' + json[i].stamp + ' | text: ' + json[i].text + '\r\n');
                    }
                }
                if (json.length == 100) {
                    let lastdate = json[json.length - 1].stamp;
                    // Clean up the date format, remove text like "+00:00"
                    if (lastdate.indexOf('+') > -1) { 
                        lastdate = lastdate.substring(0, lastdate.indexOf('+'));
                    }
                    // Recursively call the API using the date of the last tweet from the previous API call, as the new startDate.
                    sApiUrlPathWithParameters = sApiUrlPath + '?startDate=' + lastdate + '&endDate=' + sEndDate;
                    return getMoreTweets(sApiUrlPathWithParameters);
                } else {
                    console.log('Finished fetching ' + rowcount + ' tweets!');
                    console.timeEnd('Execution Time');
                }
            } else {
                file.end();
                return 'ERROR: No data returned.';
            }
        });
    }
    return getMoreTweets(sApiUrlPathWithParameters);
}

// Initiate actual calls to the live REST API.
function getTweets(sUrl) {
    return new Promise(function(resolve, reject) {
        if (sUrl !== undefined) {
            options.url = sUrl;
        }
        // Make an HTTP GET request.
        request(options, function(err, res, body) { 
            if (err || body == null) return reject(err);
            resolve(body);
        });
    });
}

// Run our getAllTweets function when starting the app.
getAllTweets();