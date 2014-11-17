var express = require('express'),
	app 	= express(),
	http 	= require('http').Server(app),
	io 		= require('socket.io')(http),
	Twitter = require('twit'),
	config 	= require('./config.json'),
	twitter = new Twitter(config),
	port 	= 3000;



http.listen(port, function(){
	console.log("Listening on http://127.0.0.1:"+port);
});

app.use(express.static(__dirname + '/public'));

// https://github.com/ttezel/twit
var stream = twitter.stream('statuses/sample', {language: 'en'});

//mysql file
var mysqldb = require('./mysql');

io.on('connection', function(socket){
	console.log('User connected ... Starting Stream connection');

	//In order to minimise API usage, we only start stream from twitter when user connected
	stream.on('tweet', function(tweet){
		//When Stream is received from twitter
			io.emit('new tweet' ,tweet); //Send to client via a push
			mysqldb.CountHashTags(tweet);
	});

	// socket.on('insert',function(insert){
	// 	io.emit('new insert',mysqldb.populateEntities(insert));
	// });

	socket.on('disconnect', function(){
		console.log("User disconnected");
		stream.stop();
	});
});





function setUpListeners(socket){

}


