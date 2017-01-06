var express = require('express')
var app = express()
var phantom = require('phantom')

app.get('/', function (req, res) {
  res.send('Hello World!')
	var sitepage = "http://www.w3schools.com/";
	var phInstance = null;

	phantom.create()
	.then(instance => {
    	phInstance = instance;
    	return instance.createPage();
	})
	.then(page => {
		console.log('success');

		page.open(sitepage).then(function(status){
			page.evaluate(function() {
			    return document.title;
			}).then(function(html){
			    console.log(html);
			});
		});
		
		console.log('done');

	})
	.catch(error => {
    	console.log(error);
    	phInstance.exit();
	});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})