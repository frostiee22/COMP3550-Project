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
connection = mysql.createConnection({
    host: "localhost",
    user: "comp3550project",
    password: "password",
    database: "comp3550project"
});



// online database
//connection = mysql.createConnection({
//    host: "www.db4free.net",
//    user: "comp3550project",
//    password: "password123",
//    database: "comp3550project"
//});

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

var streamOnCheck = false;

io.on('connection', function (socket) {
    console.log('User connected ... Starting Stream connection');

    if (streamOnCheck === false) {
            stream.start();
            streamOnCheck = true;
        } else {
            // do nothing
        }


    //In order to minimise API usage, we only start stream from twitter when user connected
    stream.on('tweet', function (tweet) {
        //When Stream is received from twitter
        io.emit('new tweet', tweet); //Send to client via a push
        CountHashTags(tweet);
    });



    socket.on('disconnect', function () {
        console.log("User disconnected");
        if (streamOnCheck === true) {
                 stream.stop();
                 streamOnCheck = false;
             } else {
                 // do nothing
             }

    });



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


});




// ************************* MYSQL CODES  TO SEND TO CLIENT *******************************


function CountHashTags(tweet) {

    var el = tweet.entities;

    if (tweet.entities.hashtags != null) {
        var el = tweet.entities.hashtags;

        for (var i = 0; el.length > i; i++) {
            var tag = el[i].text;
            var sql = "INSERT INTO `hashtags` (`tag`) VALUES ('" + tag + "');";

            connection.query(sql, function (err, result) {
                if (err) {
                    var update = "UPDATE `hashtags` set `times` =  `times`+1  where `tag` = '" + tag + "';";
                    connection.query(update, function (err, result) {
                        if (err){
                            return err;
                        }
                        // was UPDATED
                    });
                    // ERROR updating
                    return err;
                }
                //console.log("Inserted record with id" + result.insertId);
            });
        }
    }
}


// getting all data from table hashtags
app.get('/api/hashtags', function (req, res) {
    connection.query('SELECT * FROM `hashtags`', function (err, rows) {
        if (err){
            return err;
        }else{
            //console.log("Found %d records ", rows.length);
            res.json(rows);
        }

    });
});



// getting the top 15 most used tags
app.get('/api/hashtags/top15tags', function (req, res) {
    connection.query('SELECT * FROM `hashtags` group by `times`desc ORDER BY `times` DESC limit 0,15', function (err, rows) {
        if (err){
            return err;
        }   else{
            res.json(rows);
        }

    });
});

setInterval(function RemoveLeastUsed() {
    connection.query('DELETE FROM `hashtags` WHERE `times`  < 10000', function (err, rows) {
        if (err){
            return err;
        } else {
            console.log("removed unused rows");
        }


    });
}, 120000);

//function RemoveLeastUsed(num) {
//    connection.query('DELETE FROM `hashtags` WHERE `times`  < "' + num + "';", function (err, rows) {
//        console.log("removed rows");
//    });
//}




// ************************* END MYSQL CODES **************************
