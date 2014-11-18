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


// ************ Database Connection ****************

var mysql = require("mysql"),
    crypto = require('crypto'),
    connection;


//local database
//connection = mysql.createConnection({
//    host: "localhost",
//    user: "comp3550project",
//    password: "password",
//    database: "comp3550project"
//});

// online database
connection = mysql.createConnection({
    host: "www.db4free.net",
    user: "comp3550project",
    password: "password123",
    database: "comp3550project"
});

connection.connect(function (err) {
    if (err) {
        console.log("Error Connecting to the serverL: " + err.stack);
        return;
    }
    console.log("Successfully connected to the database");
});

// ******** END Database Connection **********




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
        CountHashTags(tweet);
    });


    socket.on('disconnect', function () {
        console.log("User disconnected");
        stream.stop();
    });
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






// ************************* MYSQL CODES *******************************


function CountHashTags(tweet) {

    var el = tweet.entities.hashtags;

    for (var i = 0; el.length > i; i++) {
        var tag = el[i].text;
        var sql = "INSERT INTO `hashtags` (`tag`) VALUES ('" + tag + "');";

        connection.query(sql, function (err, result) {
            if (err) {
                var update = "UPDATE `hashtags` set `times` =  `times`+1  where `tag` = '" + tag + "';";
                connection.query(update, function (err, result) {
                    if (err) {
                        //console.log("Update Error occured "+ err);
                        return;
                    }
                    // was UPDATED
                });
                // ERROR updating
                //console.log("Insert Error occured "+ err);
                return;
            }
            //console.log("Inserted record with id" + result.insertId);
        });
    }
}


// getting all data from table hashtags
app.get('/api/hashtags', function (req, res) {
    connection.query('SELECT * FROM `hashtags`', function (err, rows) {
        //console.log("Found %d records ", rows.length);
        res.json(rows);
    });
});



// getting the top 15 most used tags
app.get('/api/hashtags/top15tags', function (req, res) {
    connection.query('SELECT * FROM `hashtags` group by `times`desc ORDER BY `times` DESC limit 0,15', function (err, rows) {
        res.json(rows);
    });
});

setInterval(function RevomeLeastUsed() {
    connection.query('DELETE FROM `hashtags` WHERE `times`  < 100', function (err, rows) {
        console.log("removed unused rows");

    });
}, 300000);

function RevomeLeastUsed(num) {
    connection.query('DELETE FROM `hashtags` WHERE `times`  < "' + num + "';", function (err, rows) {
        console.log("removed rows");
    });
}




// ************************* END MYSQL CODES **************************
