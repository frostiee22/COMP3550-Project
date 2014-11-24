var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    Twitter = require('twit'),
    config = require('./config.json'),
    twitter = new Twitter(config),
    mysql = require("mysql"),
    crypto = require('crypto'),
    connection,
    salt = "12AxBy98",
    port = 3000;



http.listen(port, function () {
    console.log("Listening on http://127.0.0.1:" + port);
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

        //setTimeout(CountHashTags(tweet), 8000);
        CountHashTags(tweet);
        CountTweetsInLocation(tweet);


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

});




// ************************* MYSQL CODES  TO SEND TO CLIENT *******************************


function CountHashTags(tweet) {

    var el = tweet.entities;

    if (tweet.entities != null) {
        if (tweet.entities.hashtags != null) {
            var el = tweet.entities.hashtags;

            for (var i = 0; el.length > i; i++) {
                var tag = el[i].text;
                var sql = "INSERT INTO `hashtags` (`tag`) VALUES ('" + tag + "');";

                connection.query(sql, function (err, result) {
                    if (err) {
                        var update = "UPDATE `hashtags` set `times` =  `times`+1  where `tag` = '" + tag + "';";
                        connection.query(update, function (err, result) {
                            if (err) {
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
}


function CountTweetsInLocation(tweet) {
    //console.log("outside " + tweet.location);

    var value,
        //loc = tweet.user.location;
        loc = (tweet.user.location).trim();

    value = loc.charCodeAt(0);
    //  loc != null || loc != '' || loc != ' '

    if ( (value > 54 && value < 91) || (value > 96 && value < 123) ) {

        var sql = "INSERT INTO `locations` (`location`) VALUES ('" + loc + "');";

        connection.query(sql, function (err, insert) {
            if (err) {
                var update = "UPDATE `locations` set `tweets` =  `tweets`+1  where `location` = '" + loc + "';";
                connection.query(update, function (err, change) {
                    if (err) {
                        // ERROR updating
                        return err;
                    } else {
                        // was UPDATED
                    }
                });
            } else {
                //console.log("Inserted record with id" + result.insertId);
            }
        });
    }
}
// getting all the tweets for a particular location
app.get('/api/location/tweets', function (req, res) {
    connection.query('SELECT * FROM `locations`', function (err, rows) {
        if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
})



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


app.get('/api/location/top15locations', function(req, res){
    connection.query('SELECT * FROM `locations` ORDER BY `tweets` DESC limit 0, 15 ', function(err, rows){
         if (err) {
            return err;
        } else {
            res.json(rows);
        }
    });
});

setInterval(function RemoveLeastUsed() {
    connection.query('DELETE FROM `hashtags`WHERE `times` < 10000', function (err, rows) {
        if (err) {
            return err;
        } else {
            console.log("removed unused  hashtags");
        }

    });
    connection.query('DELETE FROM `locations`WHERE `tweets` < 10000', function (err, rows) {
        if (err) {
            return err;
        } else {
            console.log("removed locations");
        }
    });
}, 25000);

//function RemoveLeastUsed(num) {
//    connection.query('DELETE FROM `hashtags`WHERE `times` < "' + num + "';", function (err, rows) {
//        console.log("removed rows");
//    });
//}




// ************************* END MYSQL CODES **************************



// ******************  USER LOG IN ******************************

function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send(401, "You are not authorized to view this page");
        res.redirect("/");
    } else {
        console.log("didnt work");
        next();
    }
}

app.get('/home/', checkAuth, function (req, res) {
    res.send("priviledge page");
    console.log("blocked page");
});

app.post('/register', function (req, res) {
    var newuser = {};
    newuser.username = req.body.loginName;
    newuser.password1 = req.body.loginPassword1;
    newuser.password2 = req.body.loginPassword2;

    if (newuser.password1 == newuser.password2) {
        if (checkIfUserExist(newuser.username)) {
            console.log("user " + newuser.username + " exist");
            res.send("user " + newuser.username + " exist");
        } else {
            addUser(newuser.username, newuser.password1, salt, 0);
            res.redirect('/login.html');
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
})


app.post('/login', function (req, res) {
    var user = {};
    user.username = req.body.loginName;
    user.password = req.body.loginPassword;

    CheckLogin(user.username, user.password, req, res);
});




function addUser(username, password, salt, type) {

    password = crypto.createHash('sha1').update(password + salt).digest('hex');

    var sql = "INSERT INTO `users` (`username`, `password`, `salt`, `type`) VALUES ('" + username + "', '" + password + "' ,'" + salt + "'," + type + ");";

    connection.query(sql, function (err, result) {
        if (err) {
            console.log("Error occured " + err);
        } else {
            console.log("Inserted user with ID : " + result.insertId);
        }
    });
}

function checkIfUserExist(name) {
    var sql = "SELECT `username` FROM `users` WHERE `username` =  '" + name + "';";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log("Error occured " + err);
        } else {
            var rows = JSON.stringify(result);
            if (rows != null) {
                console.log(rows);
                if (rows[0].username == name) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });
}


function CheckLogin(username, password, req, res) {
    password = crypto.createHash('sha1').update(password + salt).digest('hex');

    var sql = "SELECT `id`, `username`,`password` FROM `users` WHERE `username` =  '" + username + "'and `password` = '" + password + "';";
    connection.query(sql, function (err, user) {
        if (err) {
            console.log("Error occured " + err);
            return;
        } else {
            if (user[0] != null) {
                console.log("user found");
                req.session.user_id = user[0].id;
                console.log(user[0].id);
                req.session.save(function (err) {
                    if (!err) {
                        console.log("session saved");
                    }
                })
                res.redirect('/home');

                var loginstatus = "UPDATE `users` set `loginstatus` = 1 where `username` = '" + username + "' and `password` = '" + password + "';";
                connection.query(loginstatus, function (err, update) {
                    if (err) {
                        console.log("Error occured " + err);
                    } else {
                        // was updated
                    }
                });
            } else {
                console.log("user NOT found");
                res.redirect('/login.html');
                return 0;
            }
        }
    });

}

function logout(username, res) {
    var loginstatus = "UPDATE `users` set `loginstatus` = 0 where `username` = '" + username + "';";
    connection.query(loginstatus, function (err, updata) {
        if (err) {
            console.log("Error occured " + err);
        } else {
            res.redirect("/");
        }
    })

}






// ******************* END USER LOG IN ****************************
