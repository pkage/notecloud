// server setup
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); // patch in sockets
var config = require('./server/config');

console.log(config);

// serve static application files
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));
app.use('/img', express.static('static/img'));
app.use('/', express.static('static/html'));

// api
var api = require('./server/api');

// start listening
app.listen(config.port, _ => console.log('note cloud started!'));
