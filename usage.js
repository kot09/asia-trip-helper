var momondo = require('./configs/momondo/momondo.js');
var _ = require('lodash');
var fs = require('fs');
var out = "";

var n = 0;
var json;
var jsonEntries;
var totalSimulations = 25;
var file = 'momondo.json';

function startSearch(argv){
	const PATH = 'ressources/'
	setArguments(argv);

	json = JSON.parse(fs.readFileSync(PATH+file, 'utf8'));
	jsonEntries = json.length;

	flightSimulation(json[n]);
}

function setArguments(argv){
	if(argv.file)
		file = argv.file;

	if(argv.sims)
		totalSimulations = argv.sims;
}

function flightSimulation(opts){
	var simulationNumber = 0;
	const TIMEOUT = 20000;

	function getLowestPriceCallback(result, link){
		out += "Cheapest price for your criterias: " + result.price + "\n";
		out += "Flight time: " + JSON.stringify(result.durations) + "\n";
		out += "Link: " + link + "\n";

		if(simulationNumber+1 < totalSimulations){
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
				+today.getDate()+"-"
				+today.getTime()+"_"
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
		const DIVIDER = "================================================================================\n";
		console.log(DIVIDER);
		out += DIVIDER;
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
			var date = new Date(opts.returnDate);
			date.setDate(date.getDate() + simulationNumber);
			returnDate = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
			searchParameters.returnDate = returnDate;
		}

		out += JSON.stringify(searchParameters) + "\n";
		momondo.getLowestPrice(searchParameters, getLowestPriceCallback);
	}

	getLowestPrice();
}


module.exports = {
	startSearch : startSearch
};