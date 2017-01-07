var express = require('express')
var app = express()
var fs = require('fs');

var momondo = require('./configs/momondo/momondo.js');
var out = "";

app.get('/', function (req, res) {
  	res.send('Hello World!');

  	var opts = {
		tripType : 4,
		departureSegments : ["YUL", "SEL"],
		arrivalSegments : ["OSA", "YUL"],
		departureDates : ["01-07-2017", "22-07-2017"],
		adults : 1
	};

  	var momondoPrice;
	function getLowestPriceCallback(result){
  		momondoPrice = result;
  		console.log("Cheapest price for your criterias: " + momondoPrice);

  		out += "Cheapest price for your criterias: " + momondoPrice + "\n";

  		if(i+1 < limit){
  			i++;
  			lol();
  		}else{
  			fs.writeFile('results.txt', out, function(e){});
  			console.log("Search complete");
  		}
  	}

  	var i = 0;
  	var limit = 20;
	var d = new Date("07/01/2017");

	function lol(){
		out += "================================================================================\n";

		var depDateOne = new Date();
		depDateOne.setTime(d.getTime());
		depDateOne.setDate(d.getDate() + i);
		
		var depDateTwo = new Date();
		depDateTwo.setTime(d.getTime());
		depDateTwo.setDate(depDateOne.getDate() + 21);

		var depDateOneStr = depDateOne.getDate() + "-" + (depDateOne.getMonth()+1) + "-" + depDateOne.getFullYear();
		var depDateTwoStr = depDateTwo.getDate() + "-" + (depDateTwo.getMonth()+1) + "-" + depDateTwo.getFullYear();
		var departureDates = [depDateOneStr, depDateTwoStr];

		opts.departureDates = departureDates;

		out += JSON.stringify(opts) + "\n";
		momondo.getLowestPrice(opts, getLowestPriceCallback);
	}

	lol();
	//TODO. Make loop through dates and find cheapest price

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})