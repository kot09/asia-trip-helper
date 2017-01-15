var momondo = require('./configs/momondo/momondo.js');
var _ = require('lodash');
var fs = require('fs');
var out = "";

var n = 1;
var json;
var jsonEntries;

function startSearch(){
	json = JSON.parse(fs.readFileSync('ressources/momondo.json', 'utf8'));
	jsonEntries = json.length;

	//returnTrip(json[n]);
	flightSimulation(json[n]);
}


function returnTrip(opts){
  	var i = 0;
  	var limit = 20;
	var d = new Date(opts.departureDates[0]);
	var dd = new Date(opts.returnDate);

	function getLowestPriceCallback(result){
		var momondoPrice = result;
		out += "Cheapest price for your criterias: " + momondoPrice + "\n";

		if(i+1 < limit){
			i++;
			getLowestPrice();
		}else{
			var today = new Date();

			console.log("******************************");
			console.log("WRITING TO FILE...");
			console.log("******************************");
			fs.writeFile("ouput/" + opts.outputFileName+"_"
				+today.getFullYear()+"-"
				+(today.getFullMonth()+1)+"_"
				+today.getDate(), out, function(e){});

			out = "";

			if(n+1 < jsonEntries){
				n += 1;
				returnTrip(json[n]);
			}else{
				console.log("Search complete");
			}
		}
	}

	function getLowestPrice(){
		console.log("================================================================================\n");
		out += "================================================================================\n";
		console.log("Currently (Simulation, Loop Number)" + ": (" + n + "," + i + ")");//

		var depDateOne = new Date();
		depDateOne.setTime(d.getTime());
		depDateOne.setDate(d.getDate() + i);
		
		var depDateTwo = new Date();
		depDateTwo.setTime(dd.getTime());
		depDateTwo.setDate(dd.getDate() + i);

		var depDateOneStr = depDateOne.getDate() + "-" + (depDateOne.getMonth()+1) + "-" + depDateOne.getFullYear();
		var depDateTwoStr = depDateTwo.getDate() + "-" + (depDateTwo.getMonth()+1) + "-" + depDateTwo.getFullYear();
		var departureDates = [depDateOneStr];
		var returnDate = depDateTwoStr;

		opts.departureDates = departureDates;
		opts.returnDate = returnDate;

		out += JSON.stringify(opts) + "\n";
		momondo.getLowestPrice(opts, getLowestPriceCallback, 30000);
	}


	getLowestPrice();
}

function flightSimulation(opts){
	var simulationNumber = 0;
	const TOTAL_SIMULATIONS = 20;

	function getLowestPriceCallback(result, link){
		out += "Cheapest price for your criterias: " + result + "\n";
		out += "Link: " + link + "\n";

		if(simulationNumber+1 < TOTAL_SIMULATIONS){
			simulationNumber++;
			getLowestPrice();
		}else{
			fs.writeFile(opts.outputFileName, out, function(e){});

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

// function multiSegTrip(opts){

// }

// function four(opts){
//   	var momondoPrice;

// 	function getLowestPriceCallback(result){
//   		momondoPrice = result;
//   		console.log("Cheapest price for your criterias: " + momondoPrice);

//   		out += "Cheapest price for your criterias: " + momondoPrice + "\n";

//   		if(i+1 < limit){
//   			i++;
//   			getLowestPrice();
//   		}else{
//   			fs.writeFile('results_YUL-SEL-OSA-YUL.txt', out, function(e){});
//   			console.log("Search complete");
//   		}
//   	}

//   	var i = 0;
//   	var limit = 20;
// 	var d = new Date("07/01/2017");

// 	function getLowestPrice(){
// 		out += "================================================================================\n";

// 		var depDateOne = new Date();
// 		depDateOne.setTime(d.getTime());
// 		depDateOne.setDate(d.getDate() + i);
		
// 		var depDateTwo = new Date();
// 		depDateTwo.setTime(d.getTime());
// 		depDateTwo.setDate(depDateOne.getDate() + 21);

// 		var depDateOneStr = depDateOne.getDate() + "-" + (depDateOne.getMonth()+1) + "-" + depDateOne.getFullYear();
// 		var depDateTwoStr = depDateTwo.getDate() + "-" + (depDateTwo.getMonth()+1) + "-" + depDateTwo.getFullYear();
// 		var departureDates = [depDateOneStr, depDateTwoStr];

// 		opts.departureDates = departureDates;

// 		out += JSON.stringify(opts) + "\n";
// 		momondo.getLowestPrice(opts, getLowestPriceCallback);
// 	}

// 	getLowestPrice();
// }

// function two(){
// 	var opts = {
// 		tripType : 2,
// 		departureSegments : ["YUL"],
// 		arrivalSegments : ["OSA"],
// 		departureDates : ["01-07-2017"],
// 		returnDate : "22-07-2017",
// 		adults : 1
// 	};

// 	var momondoPrice;
// 	function getLowestPriceCallback(result){
//   		momondoPrice = result;
//   		console.log("Cheapest price for your criterias: " + momondoPrice);

//   		out += "Cheapest price for your criterias: " + momondoPrice + "\n";

//   		if(i+1 < limit){
//   			i++;
//   			getLowestPrice();
//   		}else{
//   			fs.writeFile("result2.txt", out, function(e){});
//   			console.log("Search complete");
//   		}
//   	}

// 	var i = 0;
//   	var limit = 20;

//   	function getLowestPrice(){
//   		out += "================================================================================\n";
//   		out += JSON.stringify(opts) + "\n";
//   		momondo.getLowestPrice(opts, getLowestPriceCallback, 30000);
//   	}

//   	getLowestPrice();
// }

module.exports = {
	//planOne : planOne,
	//planTwo : planTwo,
	//planThree : planThree,
	//planFour : planFour,
	startSearch : startSearch
};