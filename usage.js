var momondo = require('./configs/momondo/momondo.js');
var _ = require('lodash');
var fs = require('fs');
var out = "";

var n = 0;
var json;
var jsonEntries;

function startSearch(){
	json = JSON.parse(fs.readFileSync('ressources/momondo.json', 'utf8'));
	jsonEntries = json.length;

	flightSimulation(json[n]);
}

function flightSimulation(opts){
	var simulationNumber = 0;
	const TOTAL_SIMULATIONS = 30;

	function getLowestPriceCallback(result, link){
		out += "Cheapest price for your criterias: " + result + "\n";
		out += "Link: " + link + "\n";

		if(simulationNumber+1 < TOTAL_SIMULATIONS){
			simulationNumber++;
			getLowestPrice();
		}else{
			var today = new Date();
			const dir = "output";

			if (!fs.existsSync(dir)){
			    fs.mkdirSync(dir);
			}

			console.log("******************************");
			console.log("WRITING TO FILE...");
			console.log("******************************");
			fs.writeFile("output" + "/" + today.getFullYear()+"-"
				+(today.getMonth()+1)+"-"
				+today.getDate()+"_"
				+opts.outputFileName
				, out, function(e){});

			out = "";

			if(n+1 < jsonEntries){
				n += 1;
				flightSimulation(json[n]);
			}else{
				console.log("Search complete");
			}
		}
	}

	function getLowestPrice(){
		console.log("================================================================================\n");
		out += "================================================================================\n";
		console.log("Currently (Simulation, Loop Number)" + ": (" + n + "," + simulationNumber + ")");

		var searchParameters = _.cloneDeep(opts);

		var departureDates = [];
		console.log(JSON.stringify(opts));
		for(var i = 0; i < opts.departureDates.length; i++){
			var initDate = new Date(opts.departureDates[i]);
			var date = new Date();
			date.setTime(initDate.getTime());
			date.setDate(initDate.getDate() + simulationNumber);
			departureDates.push(date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear());
		}
		searchParameters.departureDates = departureDates;

		var returnDate;
		if(opts.returnDate){
			console.log('hey');
			console.log(opts.returnDate);
			var date2 = new Date(opts.returnDate);
			date2.setDate(date2.getDate() + simulationNumber);
			console.log(date2.getDate());
			returnDate = date2.getDate() + "-" + (date2.getMonth()+1) + "-" + date2.getFullYear();
			searchParameters.returnDate = returnDate;
		}

		out += JSON.stringify(searchParameters) + "\n";
		momondo.getLowestPrice(searchParameters, getLowestPriceCallback, 30000);
	}

	getLowestPrice();
}


module.exports = {
	startSearch : startSearch
};