var express = require('express')
var app = express()

var momondo = require('./configs/momondo/momondo.js');

app.get('/', function (req, res) {
  	res.send('Hello World!');

  	var momondoPrice;
	function getLowestPriceCallback(result){
  		momondoPrice = result;
  		console.log("Cheapest price for your criterias: " + momondoPrice);
  	}

	var opts = {
		tripType : 1,
		departureSegments : ["YUL"],
		arrivalSegments : ["OSA"],
		departureDates : ["01-07-2017"],
		adults : 1
	};

	momondo.getLowestPrice(opts, getLowestPriceCallback);

	//phantom.kill();
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})