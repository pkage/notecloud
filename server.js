// server setup
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server); // patch in sockets
var chokidar = require('chokidar'); // file watcher
var config = require('./server/config');

console.log(config);

// serve static application files
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));
app.use('/img', express.static('static/img'));
app.use('/', express.static('static/html'));
app.use('/raw', express.static(config.root));

// api
var api = require('./server/api');
app.get('/api/root', (req, res) => res.json(api.build_root_dir()));
app.get('/api/note/*', (req, res) => {
	res.send(api.get_note(req.params[0]));
});
app.get('/api/reload', (req, res) => {
	io.emit('reload');
	res.send('');
});

chokidar.watch(config.root).on('all', (ev, path) => {
        // skip most temp files
        if (path.indexOf('~') != -1) return;

        // notify clients
	io.emit('change', {
		event: ev,
		path: path
	})
})

io.on('connection', (sock) => {
	console.log('connected a new client');
	sock.on('disconnect', _ => console.log('client disconnected'));
});



// start listening
server.listen(config.port, _ => {
	console.log('note cloud started!');
	// io.emit('reload');
});
