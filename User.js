var crypto = require('crypto'),
    salt = "$0m3R@nD0mP@$$w0rD";


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

                req.session.user = {
                    userid: 1,
                    username: user[0].username
                };

                //req.session.user_id = user[0].id;
                req.session.save(function (err) {
                    if (!err) {
                        console.log("session saved");
                        res.redirect('/home');
                    } else {
                        res.status(500).send("unable to create session");
                    }
                });
                //res.send("Authentication Successful");

                //                var loginstatus = "UPDATE `users` set `loginstatus` = 1 where `username` = '" + username + "' and `password` = '" + password + "';";
                //                connection.query(loginstatus, function (err, update) {
                //                    if (err) {
                //                        console.log("Error occured " + err);
                //                    } else {
                //                        // was updated
                //                    }
                //                });
            } else {
                //res.send('incorrect username and password');
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


function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.send(401, "You are not authorized to view this page");
    } else {
        next();
    }
}


function returnSalt(){
    return salt;
}

module.exports = {
    'addUser': addUser,
    'checkIfUserExist': checkIfUserExist,
    'CheckLogin': CheckLogin,
    'logout': logout,
    'checkAuth': checkAuth,
    'returnSalt' : returnSalt
}
