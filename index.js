var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    Twitter = require('twit'),
    config = require('./config.json'),
    twitter = new Twitter(config),
    port = 3000,
    twitter2 = require('twitter');


    // functions to be used
    var FUNCTIONS = require('./functions');

// key for the google map
var twit = new twitter2({
    consumer_key: 'mZUxSWnJi8g13H7EQleYHRBXh',
    consumer_secret: 'dyrUs1kSBEA8ahZf7ky41JEwazo1hXQ1l9NB2eKxKrEPVOe88R',
    access_token_key: '45103249-bFHt2mFmpLQ1YfI6Ul572mrCvyqUekD0raCYCoQ1d',
    access_token_secret: 'TcrEcaZQU3Jg0PFh6GnsFc0J8trSLcRAyjwJN0HzQV5ax'
});



app.set('port', (process.env.PORT || port));
server.listen(app.get('port'), function () {
    console.log("Listening on http://127.0.0.1:" + app.get('port'));
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(session({
    secret: "sadf3234",
    cookie: {
        secure: true
    }
}));



// ************ Database Connection ****************

var DBACCESS = require('./DBConnection');

connection = DBACCESS.returnDBConnection();


// ******** END Database Connection **********


// https://github.com/ttezel/twit
var stream = twitter.stream('statuses/sample', {
    language: 'en'
});

var stream2 = null;

var streamOnCheck = false;



io.on('connection', function (socket) {
    console.log('User connected ... Starting Stream connection');

    if (streamOnCheck === false) {
        //stream.start();
        streamOnCheck = true;
    } else {
        // do nothing
    }


    //In order to minimise API usage, we only start stream from twitter when user connected
    stream.on('tweet', function (tweet) {

        //When Stream is received from twitter
        io.emit('new tweet', tweet); //Send to client via a push

        if (streamOnCheck === true) {
            setTimeout(function () {

               FUNCTIONS.CountHashTags(connection, tweet);
                FUNCTIONS.CountTweetsInLocation(connection, tweet);
                streamOnCheck = false;
            }, 25);

        }

    });


    stream.on('error', function (res) {
        //console.log("error occured");
    });


    socket.on('disconnect', function () {
        console.log("++++++++++++++ User disconnected  +++++++++++++++");
        if (streamOnCheck === true) {
            //stream.stop();
            streamOnCheck = false;
        } else {
            // do nothing
        }

    });



    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Used to supply the map with location data

    socket.on("start tweets", function () {
        //stream2.stop();
       if (stream2 === null) {
            //Connect to twitter stream passing in filter for entire world.
            twit.stream('statuses/filter', {
                'locations': '-180,-90,180,90'
            }, function (stream2) {
                stream2.on('data', function (data) {
                    // Does the JSON result have coordinates
                    if (data.coordinates) {
                        if (data.coordinates !== null) {
                            //If so then build up some nice json and send out to web sockets
                            var outputPoint = {
                                "lat": data.coordinates.coordinates[0],
                                "lng": data.coordinates.coordinates[1]
                            };

                            socket.broadcast.emit("twitter-stream", outputPoint);

                            //Send out to web sockets channel.
                            socket.emit('twitter-stream', outputPoint);
                        }
                        else if (data.place) {
                            if (data.place.bounding_box === 'Polygon') {
                                // Calculate the center of the bounding box for the tweet
                                var coord, _i, _len;
                                var centerLat = 0;
                                var centerLng = 0;

                                for (_i = 0, _len = coords.length; _i < _len; _i++) {
                                    coord = coords[_i];
                                    centerLat += coord[0];
                                    centerLng += coord[1];
                                }
                                centerLat = centerLat / coords.length;
                                centerLng = centerLng / coords.length;

                                // Build json object and broadcast it
                                var outputPoint = {
                                    "lat": centerLat,
                                    "lng": centerLng
                                };
                                socket.broadcast.emit("twitter-stream", outputPoint);

                            }
                        }
                    }
                                        stream.on('limit', function(limitMessage) {
                                         return console.log(limitMessage);
                                        });

                                        stream.on('warning', function(warning) {
                                          return console.log(warning);
                                        });

                                        stream.on('disconnect', function(disconnectMessage) {
                                          return console.log(disconnectMessage);
                                        });
                });
            });
        }
    });


    io.emit("connected");

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




});




// ************************* MYSQL CODES  TO SEND TO CLIENT *******************************



// getting all the tweets for a particular location
app.get('/api/location/tweets', function (req, res) {
    connection.query('SELECT * FROM `locations` limit 0, 150', function (err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
});



// getting all data from table hashtags
app.get('/api/hashtags', function (req, res) {
    connection.query('SELECT * FROM `hashtags`', function (err, rows) {
        if (err) {
            return err;
        } else {
            //console.log("Found %d records ", rows.length);
            res.json(rows);
        }

    });
});



// getting the top 15 most used tags
app.get('/api/hashtags/top15tags', function (req, res) {
    connection.query('SELECT * FROM `hashtags` ORDER BY `times` DESC limit 0, 15 ', function (err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }

    });
});

// getting the top 15 locations
app.get('/api/location/top15locations', function (req, res) {
    connection.query('SELECT * FROM `locations` ORDER BY `tweets` DESC limit 0, 15 ', function (err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
});

// getting the latest 5 comments
app.get('/api/comments', function (req, res) {
    connection.query('SELECT * FROM `comments` ORDER BY `timestamp` DESC limit 0, 5 ', function (err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
});


// adding comments to the Database
app.post('/comments', function (req, res) {
    var comment = {};
    comment.name = req.body.comment_name;
    comment.comments = req.body.comment_comment;


    if (comment.comments != []) {
        var sql;
        // if a user name was entered
        if(comment.name != []){
            sql = "INSERT INTO `comments` (`name`, `comment`) VALUES ('" + comment.name + "','" + comment.comments + "');";
            connection.query(sql, function (err, row) {
                if (err) {
                    return err;
                } else {
                    console.log("comment added!");
                }
            });
        }
        // if a user name was not entered
        else {
            sql = "INSERT INTO `comments` ( `comment`) VALUES ('" + comment.comments + "');";
            connection.query(sql, function (err, row) {
                if (err) {
                    return err;
                } else {
                    console.log("comment added!");
                }
            });
        }
    } else {
        console.log("null comment");
    }
});



// ************************* END MYSQL CODES **************************


/////////////////////////////////////////////////////////////////////////////////////////////////////

// Delete from tables in the database

var DELETE = require('./DeleteFromDB');


// setInterval(function() {
//     DELETE.DeleteTags(connection);
// }, 11000);

// setInterval(function (){
//     DELETE.DeleteLocTweets(connection);
// }, 23000);

setInterval(function () {
    DELETE.DeleteComments(connection);
},120000);

// 1800000

//14400000



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






// ******************  USER LOG IN ******************************

var USERLOG = require('./User');

app.get('/home', USERLOG.checkAuth, function (req, res) {
    res.send("priviledge page");
    console.log("blocked page");
});

app.post('/register', function (req, res) {
    var newuser = {};
    newuser.username = req.body.loginName;
    newuser.password1 = req.body.loginPassword1;
    newuser.password2 = req.body.loginPassword2;

    if (newuser.password1 == newuser.password2) {
        if (FUNCTIONS.checkIfUserExist(connection, newuser.username)) {
            console.log("user " + newuser.username + " exist");
            res.send("user " + newuser.username + " exist");
        } else {
            FUNCTIONS.addUser(connection, newuser.username, newuser.password1, salt, 0, res);
        }
    } else {
        console.log("passwords do not match up");
        res.send("passwords do not match up");
        //res.redirect(' / register.html ');
    }
});

app.get('/logout', function (req, res) {
    delete req.session.user_id;
    res.redirect('/');
});


app.post('/login', function (req, res) {
    var user = {};
    user.username = req.body.loginName;
    user.password = req.body.loginPassword;

    FUNCTIONS.CheckLogin(connection, user.username, user.password, req, res);
});

// ******************* END USER LOG IN ****************************
