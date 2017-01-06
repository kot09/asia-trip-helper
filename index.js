var jsdom = require('jsdom');
var $ = null;

jsdom.env(
 "http://quaintous.com",
 function (err, window) {
   $ = require('jquery')(window);
 }
);
var express = require('express')
var app = express()

var phantom = require('phantom')

var momondo = require('./configs/momondo/momondo.js');

app.get('/', function (req, res) {
  res.send('Hello World!')
  	var opts = {
  		tripType : 1,
  		departureSegments : ["YUL"],
  		arrivalSegments : ["TYO"],
  		departureDates : ["25-01-2017"],
  		adults : 1
  	};

	var sitepage = momondo.getResults(opts);
	//sitepage = "http://www.w3schools.com/";
	var phInstance = null;

	phantom.create(["--ssl-protocol=any"])
	.then(instance => {
    	phInstance = instance;
    	return instance.createPage();
	})
	.then(page => {
		// page.property('onResourceError', function(resourceError) {
		//     //console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
  // 			//console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString)
		// });

		console.log('success');
		console.log(sitepage);
		page.open(sitepage).then(function(status){
			console.log(status);
			global.setTimeout(function () {
				console.log('page opened');
				page.evaluate(function() {
					var lol = document.querySelectorAll('[data-flight-pos="1"]')[0];

					//console.log("TITLE: " + a);
					// var mainDiv = $("#results-tickets").find("div[data-flight-pos='0']");
					//var priceDiv = $(lol).find(".price-pax");
					//var price = $(priceDiv).find(".value").innerHTML;
					//console.log("PRICE: " + lol.innerHTML);
					//console.log('done');
				    return lol.innerHTML;//document.title;
				}).then(function(html){
					var doc = $.parseHTML(html);
					var priceDiv = $(doc).find(".price-pax")[0];
					var price = $(priceDiv).find(".value")[0].innerHTML;
					console.log("PRICE: " + price);
					console.log('done');
				});
			}, 20000);

			
		});
		
		console.log('done');

	})
	.catch(error => {
    	console.log(error);
    	phInstance.exit();
	});

	//phantom.kill();
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})