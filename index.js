var express = require('express')
var app = express()
var p = require('./usage.js');

app.get('/', function (req, res) {
  	res.send('Hello World!');
  	p.startSearch();
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})