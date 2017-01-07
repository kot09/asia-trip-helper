var express = require('express')
var app = express()

var momondo = require('./configs/momondo/momondo.js');

app.get('/', function (req, res) {
  res.send('Hello World!')
  	var opts = {
  		tripType : 1,
  		departureSegments : ["YUL"],
  		arrivalSegments : ["OSA"],
  		departureDates : ["01-07-2017"],
  		adults : 1
  	};

	momondo.getLowestPrice(opts);

	//phantom.kill();
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})