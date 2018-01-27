var express = require('express');
var cors = require('cors');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var MessengerPlatform = require('facebook-bot-messenger');
var FaceBookClass = require('./facebook');


var app = require('express')();



firebase.initializeApp({
    databaseURL: 'https://conbot-34186.firebaseio.com',
    serviceAccount: 'google-services.json',
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); //
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');


    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});
 app.get('/hello',cors(), function (req, res) {
	var ref = firebase.database().ref("/");

ref.once("value", function(snapshot) {
		res.send(snapshot);
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

});
app.get('/chatbotdeploy/get',cors(), function (req, res) {
	res.setHeader('content-type', 'application/json');

	var ref = firebase.database().ref("/chatBotDeployment");

	ref.once("value", function(snapshot) {
		res.send(snapshot);
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});

});

app.post('/chatbotdeploy/post', cors(), function (req, res) {
	console.log(req.body.chatbotDeployment);
	var ref = firebase.database().ref("/chatBotDeployment").update(req.body.chatbotDeployment);
	var facebookClass = new FaceBookClass(req.body.chatbotDeployment.pageId,req.body.chatbotDeployment.appId,
  req.body.chatbotDeployment.appSecret,req.body.chatbotDeployment.accessToken,req.body.chatbotDeployment.verifyToken);
	facebookClass.botListen();
	res.send({data : "OK"});
});


app.listen(8000);
