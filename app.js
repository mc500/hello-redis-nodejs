/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//console.log(appEnv.getServiceCreds('Redis Cloud-lb'));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var redis = require("redis");
var redisCredentials = appEnv.getServiceCreds('Redis Cloud-lb');
//var client=redis.createClient(credentials.uri);

var redisClient = redis.createClient({
    'host': redisCredentials.hostname,
    'port': redisCredentials.port,
    'password': redisCredentials.password
});

redisClient.on('error', function (err) {
    console.log('error event - ' + redisClient.host + ':' + redisClient.port + ' - ' + err);
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.put("/hset", function(request, response) {
	var key = "myhash";
	redisClient.hset(key, request.body.field, request.body.value, function(error, result) {
		if (error) {
			response.status(500).send(error);
		} else {
			response.send(result == 1 ? "created":"updated");
		}
    });
});

app.get("/hget", function(request, response) {
	var key = "myhash";
	redisClient.hget(key, request.query.field, function(error, result) {
		if (error) {
			response.status(500).send(error);
		} else {
			response.send(result);
		}
    });
});