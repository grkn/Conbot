var express = require('express');
var cors = require('cors');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var MessengerPlatform = require('facebook-bot-messenger');
var FaceBookClass = require('./facebook');
var Client = require('node-rest-client').Client;

var client = new Client();

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

app.get('/',function(req,res){
    res.sendFile(__dirname + '/MessageDefinitionForIntent.html');
});
app.get('/asset/js/messages.js',function(req,res){
    res.sendFile(__dirname + '/asset/js/messages.js');
});
app.get('/asset/js/index.js',function(req,res){
    res.sendFile(__dirname + '/asset/js/index.js');
});

app.get("/get/witai/entities",function(req,res){
  var wit = {
    data : {
      parameters: {}
    },
    headers : {
      "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
      "Content-Type": "application/json"
    }

  }
  client.get("https://api.wit.ai/entities/intent",wit,function(response){
    res.send(response);
  });

})

app.post("/post/intent/expressions",function(req,res){
  var wit = {
    data : {
		value : req.body.value,
		expressions : req.body.expressions
    },
    headers : {
      "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
      "Content-Type": "application/json"
    }
  }
  client.post("https://api.wit.ai/entities/intent/values",wit,function(response){
    res.send(response);
  });

});

app.delete("/delete/intent/expressions",function(req,res){
	var wit = {
		data : {
		},
		headers : {
		  "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
		  "Content-Type": "application/json"
		}
	}
	client.delete("https://api.wit.ai/entities/intent/values/"+req.body.value+"/expressions/"+req.body.expression,wit,function(response){
		res.send(response);
	});
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


app.get('/projectinfo/get',cors(), function (req, res) {
	res.setHeader('content-type', 'application/json');
	var ref = firebase.database().ref("/projectInfo");
	ref.once("value", function(snapshot) {
		res.send(snapshot);
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
});
app.post('/projectinfo/post', cors(), function (req, res) {
	console.log(req.body.projectInfo);
	var ref = firebase.database().ref("/projectInfo").update(req.body.projectInfo);
	var facebookClass = new FaceBookClass(req.body.projectInfo.projectName,req.body.projectInfo.projectLocation,
  req.body.projectInfo.projectType);
	facebookClass.botListen();
	res.send({data : "OK"});
});

app.listen(8000);
