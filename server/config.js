// program options parser
var program = require('commander');
var read = require('read-file');
var fs = require('fs');
var resolvepath = require('./resolvepath');


// parse command line options
program.version('1.0.0')
	.option('-c, --config [config]', 'config file to use')
	.parse(process.argv);


cfg = {
        port: 3000,
        root: '~/Documents/notes'
}

cfgfile = (program.config === undefined) ? '~/.notecloudrc' : program.config;
cfgfile = resolvepath(cfgfile);

// attempt to load the file
try {
        console.log('loading ' + cfgfile)
        cfgfile = JSON.parse(read.sync(cfgfile, 'utf8'));
} catch (e) {
        cfgfile = {}
}

for (key in cfgfile) {
        if (cfgfile.hasOwnProperty(key)) {
                cfg[key] = cfgfile[key];
        }
}

// patch path keys
cfg.root = resolvepath(cfg.root);

module.exports = exports = cfg;
