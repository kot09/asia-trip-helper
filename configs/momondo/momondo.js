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
* 	departureSegments = [], // ICAO codes (ie: YUL == Montreal Trudeau Airport)
*	arrivalSegments = [], //idem as departureSegments
* 	tripType =  int // 1 = One way, 2 = Return trip, 4 = Multi City
* 	departureDates = [], // DD-MM-YYYY; more than one if tripType == 4
* 	returnDate = DD-MM-YYYY, // used only if tripType == 2
* 	adults = int
* }
* TODO in the future: Ticket class, Direct preferred, include nearby airports, # of childs
*/
Momondo.prototype.getLowestPrice = function(opts){
	var sitepage = urlSetup(opts);
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

		page.open(sitepage)
		.then(function(status){
			global.setTimeout(function () {
				page.evaluate(function() {
					var lol = document.querySelectorAll('[data-flight-pos="0"]')[0];

				    return lol.innerHTML;
				}).then(function(html){
					var doc = $.parseHTML(html);
					var priceDiv = $(doc).find(".price-pax")[0];
					var price = $(priceDiv).find(".value")[0].innerHTML;
				});
			}, 20000);
		});
	})
	.catch(error => {
    	console.log(error);
    	phInstance.exit();
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

	return url + configs.MOMONDO_FLIGHTS_SEARCH_URL_SEARCH_QUERY_SUFFIX;
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

module.exports = new Momondo();