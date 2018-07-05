# Overview (last updated: 7/4/2018)
* This documentation contains instructions on how to run a command line interface that pulls 2 years of tweets (2016 to 2017) using a client's REST API. The results are parsed and saved to a text file.

## Author
* Michael Cheung

## Prerequisites
* Windows OS
* Git installed (in order to pull down this repository's source code)
* Node/npm installed

## Instructions
1. Download all the source code from the Github repository that stores this solution.
2. Launch Node.js Command Prompt, and navigate to this project where you downloaded all the source code to. For example:
```
cd C:\TweetsFetcherProject
```
3. Type "npm install request" to install the request module.
4. Run the application by typing:
```
node cliapp
```
5. Open tweetsresults.txt to view all fetched tweets.
