// have separate http and websocket event handlers

// server operations
var tree = require('directory-tree');
var marked = require('marked')
var read = require('read-file');
var path = require('path');
var cfg = require('./config');


var build_root_dir = function() {
	var dir = tree(cfg.root);

        console.log(dir);

	var flatten = (node) => {
		if (!('children' in node)) {
			return [node];
		}
		sum = [];
		for (x in node.children) {
			sum = sum.concat(flatten(node.children[x]));
		}
		return sum;
	}

	return flatten(dir).map((el) => {
                el.path = el.path.replace(cfg.root, '');
		return el;
	});

}

var getextension = function(filepath) {
        return filepath.slice(filepath.lastIndexOf('.'));
}

var get_note = function(note_path) {
        full_path = path.join(cfg.root, note_path);

	var file = read.sync(full_path, 'utf8');

	return {
                ext: getextension(note_path),
                raw: file,
                path: path.join('/', note_path)
	}
}



module.exports = {
	build_root_dir: _ => {
		return {
			files: build_root_dir()
		}
	},
	get_note: get_note
}
