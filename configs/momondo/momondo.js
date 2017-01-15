/* start jQuery setup */
var jsdom = require('jsdom');
var $ = null;

jsdom.env("", function (err, window) {
   		$ = require('jquery')(window);
 	}	
);
/* end jQuery */ 

var path = require('path');
var configs = require(path.resolve(__dirname, "configs.js" ));
var phantom = require('phantom');

var Momondo = function(){};

/**
* opts = {
* 	departureSegments = [], // ICAO codes (ie: YUL == Montreal Trudeau Airport. Use the Momondo website for the codes)
*	arrivalSegments = [], //idem as departureSegments
* 	tripType =  int // 1 = One way, 2 = Return trip, 4 = Multi City
* 	departureDates = [], // DD-MM-YYYY; more than one if tripType == 4
* 	returnDate = DD-MM-YYYY, // used only if tripType == 2
* 	adults = int
* }
* TODO in the future: Ticket class, Direct preferred, include nearby airports, # of childs
*/
Momondo.prototype.getLowestPrice = function(opts, callback, time){
	if(!time)
		time = 20000;

	var sitepage = urlSetup(opts);
	var phInstance = null;

	phantom.create(["--ssl-protocol=any"])
	.then(instance => {
		console.log("Phantom instance created");
    	phInstance = instance;
    	return instance.createPage();
	})
	.then(page => {
		console.log("Page opened. Wait approx. 5-10 seconds for Momondo to load completely...");
		page.open(sitepage)
		.then(function(status){
			var sitelink = sitepage;

			global.setTimeout(function () {
				page.evaluate(function() {
					console.log("Page loaded. Getting cheapest price... ");
					var cheapestPriceDiv = document.querySelectorAll('[data-flight-pos="0"]')[0];

				    return cheapestPriceDiv.innerHTML;
				}).then(function(html){
					var priceDiv = $.parseHTML(html);
					var price = $(priceDiv).find(".value")[0].innerHTML;

					callback(price, sitelink);

					page.close();
					console.log("Page closed");
					phInstance.exit();
					console.log("Phantom instance exited");
				});
			}, time);
		});
	})
	.catch(error => {
    	console.log(error);
    	phInstance.exit();
    	callback(0, null);
	});
}

function urlSetup(opts)
{
	var url = configs.MOMONDO_FLIGHT_SEARCH_URL;
	var tripType = opts.tripType;

	if(tripType == 1)
		url += getOneWaySearchQuery(opts);
	else if(tripType == 2)
		url += getReturnSearchQuery(opts);
	else if (tripType == 4)
		url += getMultiSearchQuery(opts);
	else {
		console.log("Invalid tripType.");
		return;
	}

	url += configs.MOMONDO_FLIGHTS_SEARCH_URL_SEARCH_QUERY_SUFFIX
	console.log("Url being used: " + url);
	return url;
}

function getOneWaySearchQuery(opts){
	var searchQuery = "";
	searchQuery += "&TripType=" + opts.tripType
				+ "&SegNo=1"
				+ "&SO0=" + opts.departureSegments[0]
				+ "&SD0=" + opts.arrivalSegments[0]
				+ "&SDP0=" + opts.departureDates[0]
				+ "&AD=" + opts.adults;

	return searchQuery;
}

function getReturnSearchQuery(opts){
	var searchQuery = "";
	searchQuery += "&TripType=" + opts.tripType
				+ "&SegNo=2"
				+ "&SO0=" + opts.departureSegments[0]
				+ "&SD0=" + opts.arrivalSegments[0]
				+ "&SDP0=" + opts.departureDates[0]
				+ "&SO1=" + opts.arrivalSegments[0]
				+ "&SD1=" + opts.departureSegments[0]
				+ "&SDP1=" + opts.returnDate
				+ "&AD=" + opts.adults;

	return searchQuery;
}

function getMultiSearchQuery(opts){
	var searchQuery = "";
	var segNo = opts.departureSegments.length;
	searchQuery += "&TripType=" + opts.tripType
				+ "&SegNo=" + segNo;

	for(var i = 0; i < segNo; i++){
		searchQuery += "&SO" + i + "=" + opts.departureSegments[i];
		searchQuery += "&SD" + i + "=" + opts.arrivalSegments[i];
		searchQuery += "&SDP" + i + "=" + opts.departureDates[i];
	}

	searchQuery += "&AD=" + opts.adults;

	return searchQuery;
}

module.exports = new Momondo();