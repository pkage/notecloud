// have separate http and websocket event handlers

// server operations
var tree = require('directory-tree');
var cfg = require('./config')


var build_tree = function(dir) {
        return tree(dir);
}

var build_root_tree = _ => build_tree(cfg.root);
