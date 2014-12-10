
var crypto = require('crypto'),
    salt = "$0m3R@nD0mP@$$w0rD";


function CountHashTags(connection, tweet) {

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


 function CountTweetsInLocation(connection, tweet) {
     //console.log("outside " + tweet.location);
     var value,
         //loc = tweet.user.location;
         loc = (tweet.user.location).trim();

     value = loc.charCodeAt(0);
     //  loc != null || loc != '' || loc != ' '

     if ((value > 54 && value < 91) || (value > 96 && value < 123)) {

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




function addUser(connection, username, password, salt, type, res) {

    password = crypto.createHash('sha1').update(password + salt).digest('hex');

    var sql = "INSERT INTO `users` (`username`, `password`, `salt`, `type`) VALUES ('" + username + "', '" + password + "' ,'" + salt + "'," + type + ");";

    connection.query(sql, function (err, result) {
        if (err) {
            console.log("ADD USER - Error occured " + err);
            res.redirect('register.html');
        } else {
            console.log("Inserted user with ID : " + result.insertId);
            res.redirect('login.html');
        }
    });
}

function checkIfUserExist(connection, name) {
    var sql = "SELECT `username` FROM `users` WHERE `username` =  '" + name + "';";
    connection.query(sql, function (err, result) {
        if (err) {
            console.log("checkIfUserExist - Error occured " + err);
        } else {
            if (result[0] != null) {
                if (result[0].username == name) {
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


function CheckLogin(connection, username, password, req, res) {
    password = crypto.createHash('sha1').update(password + salt).digest('hex');

    var sql = "SELECT `id`, `username`,`password` FROM `users` WHERE `username` =  '" + username + "'and `password` = '" + password + "';";
    connection.query(sql, function (err, user) {
        if (err) {
            console.log("CheckLogin - Error occured " + err);
            return;
        } else {
            if (user[0] != null) {
                console.log("user found");
                req.session.user_id = user[0].id;
                req.session.save(function (err) {
                    if (!err) {
                        console.log("session saved");
                    }
                });
                res.redirect('/home');

                //                var loginstatus = "UPDATE `users` set `loginstatus` = 1 where `username` = '" + username + "' and `password` = '" + password + "';";
                //                connection.query(loginstatus, function (err, update) {
                //                    if (err) {
                //                        console.log("Error occured " + err);
                //                    } else {
                //                        // was updated
                //                    }
                //                });
            } else {
                console.log("user NOT found");
                res.redirect('/login.html');
                return 0;
            }
        }
    });

}

function logout(connection, username, res) {
    var loginstatus = "UPDATE `users` set `loginstatus` = 0 where `username` = '" + username + "';";
    connection.query(loginstatus, function (err, updata) {
        if (err) {
            console.log("Logout - Error occured " + err);
        } else {
            res.redirect("/");
        }
    });

}

module.exports = {
    'CountHashTags' : CountHashTags,
    'CountTweetsInLocation' : CountTweetsInLocation,
    'addUser' : addUser,
    'checkIfUserExist' : checkIfUserExist,
    'CheckLogin' : CheckLogin,
    'logout' : logout
}
