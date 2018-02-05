var express = require('express');
var cors = require('cors');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var MessengerPlatform = require('facebook-bot-messenger');
var FaceBookClass = require('./facebook');
var app = require('express')();

var Client = require('node-rest-client').Client;

var client = new Client();





firebase.initializeApp({
    databaseURL: 'https://conbot-34186.firebaseio.com',
    serviceAccount: 'google-services.json',
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// html i ekrana basıyor
app.get('/',function(req,res){
    res.sendFile(__dirname + '/MessageDefinitionForIntent.html');
});
// Vue için javascript dosyasını browser a basıyor
app.get('/asset/js/messages.js',function(req,res){
    res.sendFile(__dirname + '/asset/js/messages.js');
});
// Bu da vue için ok
app.get('/asset/js/index.js',function(req,res){
    res.sendFile(__dirname + '/asset/js/index.js');
});


// intent i getiriyor
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


// Intent e cümle kaydetme apisi
app.post("/post/intent/expressions",function(req,res){
  console.log(req.body.expressions);
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


// Vue cümle silmek için
app.delete("/delete/intent/expressions",function(req,res){
  console.log(req.body.expression);
	var wit = {
		data : {
		},
		headers : {
		  "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
		  "Content-Type": "application/json"
		}
	}
	client.delete("https://api.wit.ai/entities/intent/values/"+req.body.value+"/expressions/"+encodeURIComponent(req.body.expression),wit,function(response){
    console.log(response);
		res.send(response);
	});
});

app.delete("/delete/intent",function(req,res){
  var wit = {
    data : {
    },
    headers : {
      "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
      "Content-Type": "application/json"
    }
  }
  client.delete("https://api.wit.ai/entities/intent/values/"+req.body.value,wit,function(response){
    console.log(response);
		res.send(response);
	});
})

app.post("/create/intent",function(req,res){
  var wit = {
    data : {
      "value":req.body.value
    },
    headers : {
      "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
      "Content-Type": "application/json"
    }
  }
  client.post("https://api.wit.ai/entities/intent/values",wit,function(response){
    console.log(response);
		res.send(response);
	});
})


// hello yazdığında database i basıyor ekrana
app.get('/hello',cors(), function (req, res) {
	var ref = firebase.database().ref("/");

ref.once("value", function(snapshot) {
		res.send(snapshot);
	}, function (errorObject) {
	  console.log("The read failed: " + errorObject.code);
	});
});

/** Anlamlu Cümle Tanımı**/
app.post('/send/meaningful/sentence',cors(), function (req, res) {
	var ref = firebase.database().ref("/answer");
  var set = { 'key' : req.body.intent, 'value' : req.body.message};
  ref.once('value', function(snapshot) {
    var array = snapshot.val();
    for(var key in array){
      if(array[key].key == req.body.intent){
          ref.child(key).remove();
      }
    }
    ref.push().set(set);
  });
  res.send({ resp : "OK"});
});
/** Anlamlu Cümle Tanımı**/
app.get('/get/meaningful/sentence',cors(), function (req, res) {
  var ref = firebase.database().ref("/answer");
  ref.once("value", function(snapshot) {
      var array = snapshot.val();
      for(var key in array){
        if(array[key].key == req.query.intent){
          res.send({resp : array[key].value});
          return;
        }
      }
        res.send({resp : "NOT_FOUND"});
  });
});
/** Anlamlu Cümle Tanımı**/
app.delete('/delete/meaningful/sentence',cors(), function (req, res) {
  var ref = firebase.database().ref("/answer");
  ref.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        ref.child('/').child(childSnapshot.key).once('value', function(itemSnapshot) {
          if(itemSnapshot.val().key == req.body.intent){
            ref.child("/").child(childSnapshot.key).remove();
            res.send({resp : "OK"});
          }
        });
      });
  });
});


//** WEB API for dialogflow**//
app.get('/api/getMessage/dialogFlow',cors(),function(req,res){
  var dialog = {
    data : {
              "lang": "en",
              "query": req.query.message,
              "sessionId": "12345",
              "timezone": "Asia/Istanbul"
            },
    headers : {
      "Authorization" : "Bearer 327778ba5583490284a126400602a3b0",
      "Content-Type": "application/json"
    }
  }
  client.post("https://api.dialogflow.com/v1/query?v=20183001",dialog,function(response){
    let text = response.result.fulfillment.speech;
    res.send({resp : text});
  });
})

// WEB API for wit.ai
app.get('/api/getMessage/witai',cors(),function(req,res){
  var wit = {
    data : {
      parameters: {}
    },
    headers : {
      "Authorization" : "Bearer DSWRM5DAQVXBGOH7BQWO455ERSGWRNR6",
      "Content-Type": "application/json"
    }
  }
  client.get("https://api.wit.ai/message?q="+encodeURIComponent(req.query.message),wit,function(response){
    if(response.entities && response.entities.intent && response.entities.intent.length > 0){

      var max = -1;
      var maxValue="";
      for(var i= 0 ; i < response.entities.intent.length ; i++ ){
        if(max <response.entities.intent[i].confidence){
          maxValue = response.entities.intent[i].value;
          max = response.entities.intent[i].confidence;
        }
      }

      var ref = firebase.database().ref("/answer");
      ref.once("value", function(snapshot) {

          snapshot.forEach(function(childSnapshot) {
            console.log(childSnapshot.key);
            ref.child('/').child(childSnapshot.key).once('value', function(itemSnapshot) {
              if(itemSnapshot.val().key == maxValue){
                res.send(itemSnapshot.val().value);
              }
            });
          });
      });
    }else{
        res.send({resp : 'Herhangi bir intent bulunmadı.'});
    }
  });
})


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
