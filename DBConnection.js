// ************ Database Connection ****************
var mysql = require("mysql"),
    connection;

//local database
// connection = mysql.createConnection({
//     host: "localhost",
//     user: "comp3550project",
//     password: "password",
//     database: "comp3550project"
// });



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


function returnDBConnection (){
    return connection;
}

// ******** END Database Connection **********



module.exports = {
    'returnDBConnection' : returnDBConnection
}
