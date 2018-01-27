const http = require('http')
const Bot = require('messenger-bot')
var Client = require('node-rest-client').Client;

var client = new Client();


'use strict'
var facebookclass= class FacebookBotClass {

	constructor(pageId,appId,appSecret,pageToken,verifyToken) {
        this.bot  = new Bot({
								  token: pageToken,
								  verify: verifyToken,
								  app_secret: appSecret
								});

			this.token = pageToken;
  }

	botListen(){
		this.bot.on('error', (err) => {
		  console.log(err.message)
		})

		this.bot.on('message', (payload, reply) => {
		  let text = payload.message.text
			console.log(payload);
			var args = {
			    data: {
						"messaging_type": "Text",
						"recipient":{
							"id":payload.sender.id
						},
						"message": payload.message
					},
			    headers: { "Content-Type": "application/json" }
			};

			client.post("https://graph.facebook.com/v2.9/me/messages?access_token="+this.token, args, function (data, response) {
			});

			reply({ text }, (err) => {

			})

		})

		http.createServer(this.bot.middleware()).listen(8080)
	}

};



module.exports =facebookclass;
