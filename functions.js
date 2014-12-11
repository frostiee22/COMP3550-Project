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






module.exports = {
    'CountHashTags': CountHashTags,
    'CountTweetsInLocation': CountTweetsInLocation
}
