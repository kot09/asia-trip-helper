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

var FlightHub = function(){};

FlightHub.prototype.getLowestPrice = function(opts, callback, time){
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
		console.log("Page opened. Wait approx. 5-10 seconds for FlightHub to load completely...");
		page.open(sitepage)
		.then(function(status){
			var sitelink = sitepage;

			global.setTimeout(function () {
				page.evaluate(function() {
					console.log("Page loaded. Getting cheapest price... ");
					var cheapestPriceDiv = $(".packages-os-container").children().first();

					if(cheapestPriceDiv)
				    	return $(cheapestPriceDiv).html();
				    else
				    	callback(null, sitelink);
				}).then(function(html){
					try{
						var priceDiv = $.parseHTML(html);
						var price = $(priceDiv).find(".price-whole")[0].innerHTML;
						price += ".";
						price += $(priceDiv).find(".price-fraction")[0].innerHTML;

						var durations = [];

						$(priceDiv).find(".select-segment-left").each(function(){
							var text = encodeURI($(this).text());
							text = text.replace(/%0A|%20/g, "");
							durations.push(text);
						});

						var retObj = {
							price : price,
							durations : durations
						}

						page.close();
						console.log("Page closed");
						phInstance.exit();
						console.log("Phantom instance exited");

						callback(retObj, sitelink);
					}
					catch(err){
						callback(null, sitelink);
					}
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
	var url = configs.FH_SEARCH_URL;
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

	url += configs.FH_SEARCH_URL_SUFFIX
	console.log("Url being used: " + url);
	return url;
}

function getOneWaySearchQuery(opts){
	var searchQuery = "";
	searchQuery += "seg0_from=" + opts.departureSegments[0]
				+ "&seg0_to=" + opts.arrivalSegments[0]
				+ "&seg0_date=" + opts.departureDates[0]
				+ "&seg1_from_code=" + opts.arrivalSegments[0] //not really useful, imo
				+ "&seg1_to_code=" + opts.departureSegments[0] //not really useful, imo
				+ "&num_adults=" + opts.adults;

	return searchQuery;
}

function getReturnSearchQuery(opts){
	var searchQuery = "";
	searchQuery += "&seg0_from=" + opts.departureSegments[0]
				+ "&seg0_to=" + opts.arrivalSegments[0]
				+ "&seg0_date=" + opts.departureDates[0]
				+ "&seg1_from=" + opts.arrivalSegments[0]
				+ "&seg1_to=" + opts.departureSegments[0]
				+ "&seg1_date=" + opts.returnDate
				+ "&num_adults=" + opts.adults;

	return searchQuery;
}

function getMultiSearchQuery(opts){
	var searchQuery = "";
	var segNo = opts.departureSegments.length;

	for(var i = 0; i < segNo; i++){
		searchQuery += "seg" + i + "_from=" + opts.departureSegments[i];
		searchQuery += "&seg" + i + "_to=" + opts.arrivalSegments[i];
		searchQuery += "&seg" + i + "_date=" + opts.departureDates[i];
		searchQuery += "&";
	}

	searchQuery += "num_adults=" + opts.adults;

	return searchQuery;
}

module.exports = new FlightHub();