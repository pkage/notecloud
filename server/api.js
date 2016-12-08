const cfg = require('./config');
const ops = require('./ops');

// have separate http and websocket event handlers

var express = require('express');

var attach = function(app, io) {
        // attach api
        app.get('api/tree', function(req, res) {
                res.json(ops.build_root_tree);
        })
}

module.exports = {
	attach: attach
}
