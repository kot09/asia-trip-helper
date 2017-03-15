var argv = require('minimist')(process.argv.slice(2));
var asiaTripHelper = require('./usage.js');

asiaTripHelper.startSearch(argv);