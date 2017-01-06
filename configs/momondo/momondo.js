var path = require('path');
var configs = require( path.resolve( __dirname, "configs.js" ));

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

var getResults = function(opts)
{
	// if(!opts.segments || !opts.tripType || !opts.departureDates || !opts.returnDates || !opts.adults) {
	// 	console.log("Error. Missing field in `opts` parameter.");
	// 	return;
	// }

	var url = urlSetup(opts);
	return url;

	function urlSetup()
	{
		var url = configs.MOMONDO_FLIGHT_SEARCH_URL;
		var tripType = opts.tripType;

		if(tripType == 1)
			url += getOneWaySearchQuery();
		else if(tripType == 2)
			url += getReturnSearchQuery();
		else if (tripType == 4)
			url += getMultiSearchQuery();
		else {
			console.log("Invalid tripType.");
			return;
		}

		return url + configs.MOMONDO_FLIGHTS_SEARCH_URL_SEARCH_QUERY_SUFFIX;
	}

	function getOneWaySearchQuery(){
		var searchQuery = "";
		searchQuery += "&TripType=" + opts.tripType
					+ "&SegNo=1"
					+ "&SO0=" + opts.departureSegments[0]
					+ "&SD0=" + opts.arrivalSegments[0]
					+ "&SDP0=" + opts.departureDates[0]
					+ "&AD=" + opts.adults;

		return searchQuery;
	}

	function getReturnSearchQuery(){
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
}

module.exports.getResults = getResults;