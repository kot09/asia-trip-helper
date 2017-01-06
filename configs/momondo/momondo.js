var configs = require('configs.js');

/**
* opts = {
* 	departureSegments = [], // ICAO codes (ie: YUL == Montreal Trudeau Airport)
*	arrivalSegments = [], //idem as departureSegments
* 	tripType =  int // 1 = One way, 2 = Return trip, 4 = Multi City
* 	departureDates = [], // more than one if tripType == 4
* 	returnDates = [], //more than one if tripType == 4
* 	adults = int
* }
* TODO in the future: Ticket class, Direct preferred, include nearby airports, # of childs
*/

function getResults(opts)
{
	// if(!opts.segments || !opts.tripType || !opts.departureDates || !opts.returnDates || !opts.adults) {
	// 	console.log("Error. Missing field in `opts` parameter.");
	// 	return;
	// }

	var url = urlSetup(opts);

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
	}

	function getOneWaySearchQuery(){
		var searchQuery = "";
		searchQuery += "&TripType=" + opts.tripType
					+ "&SegNo=1"
					+ "&SO0=" + opts.departureSegments[0]
					+ "&SD0=" + opts.arrivalSegments[0]
					+ "&SDP0=" + opts.departureDates[0]
					+ "&AD=" + opts.adults;
	}
}