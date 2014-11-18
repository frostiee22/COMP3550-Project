var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Twitter = require('twit'),
    config = require('./config.json'),
    twitter = new Twitter(config),
    port = 3000;



http.listen(port, function () {
    console.log("Listening on http://127.0.0.1:" + port);
});

app.use(express.static(__dirname + '/public'));


//mysql file
var mysqldb = require('./mysql');


// https://github.com/ttezel/twit
var stream = twitter.stream('statuses/sample', {
    language: 'en'
});



io.on('connection', function (socket) {
    console.log('User connected ... Starting Stream connection');

    //In order to minimise API usage, we only start stream from twitter when user connected
    stream.on('tweet', function (tweet) {
        //When Stream is received from twitter
        io.emit('new tweet', tweet); //Send to client via a push
        mysqldb.CountHashTags(tweet);

    });

    // socket.on('insert',function(insert){
    // 	io.emit('new insert',mysqldb.populateEntities(insert));
    // });

    socket.on('disconnect', function () {
        console.log("User disconnected");
        stream.stop();
    });
});



//Method 1
app.get("/api/tags", function (req, res) {
    // to do read values from database
    //send values read to client using res.send or res.json
    var query = mysqldb.Top5Tags();
    res.json(query);

});


//var interId = setInterval(function () {
//    //
//    var dataFromServer = dataRead();
//    mysqldb.read(function (data) {
//        io.emit('tags', data);
//    })
//
//
//}, 500);





function setUpListeners(socket) {

}
