var mysql = require("mysql"),
	//crypto = require('crypto'),
	connection;

connection = mysql.createConnection({
	host: "localhost",
	user: "comp3550project",
	password: "password",
	database: "comp3550project"
});

connection.connect(function(err){
	if (err){
		console.log("Error Connecting to the serverL: "+err.stack);
		return;
	}
	console.log("Successfully connected to the database");
	 //Top5Tags();
	//retrieveEntities();
});


function CountHashTags(tweet){

	var el = tweet.entities.hashtags;

	for (var i = 0; el.length > i; i++) {
		var tag = el[i].text;
		var sql = "INSERT INTO `hashtags` (`tag`) VALUES ('"+ tag +"');";

		connection.query(sql, function(err, result){
			if (err){
				var update = "UPDATE `hashtags` set `times` =  `times`+1  where `tag` = '"+ tag + "';";
				connection.query(update, function(err, result){
					if (err){
						// console.log("Update Error occured "+ err);
						 return;
					}
					// was updated
				});
				//console.log("Insert Error occured "+ err);
				return;
			}
			//console.log("Inserted record with id" + result.insertId);
		});
	}
}


function retrieveEntities(){
	connection.query( 'SELECT * FROM `hashtags`', function(err, rows) {
		console.log("Found %d records ", rows.length);
		console.log(rows);
	});
}

function Top5Tags(){
	connection.query('SELECT * FROM `hashtags` group by `times`desc ORDER BY `times` DESC limit 0,5',function(err,rows){
		console.log(rows);
	});
}




exports.CountHashTags = CountHashTags;
exports.retrieveEntities = retrieveEntities;
