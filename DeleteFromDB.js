function DeleteTags(connection) {
    connection.query('DELETE FROM `hashtags`WHERE `times` < 10000', function (err, rows) {
        if (err) {
            return err;
        } else {
            console.log("removed unused  hashtags");
        }
    });
}

function DeleteLocTweets(connection) {
    connection.query('DELETE FROM `locations`WHERE `tweets` < 10000', function (err, rows) {
        if (err) {
            return err;
        } else {
            console.log("removed locations");
        }
    });
}

function DeleteComments(connection) {
    connection.query('DELETE FROM `comments` WHERE `comment` IS NOT NULL', function (err, rows) {
        if (err) {
            return err;
        } else {
            console.log("removed comments");
        }
    });
}


//14400000

function DeleteAmtLocations(connection, num){
    connection.query('DELETE FROM `locations`WHERE `tweets`< ' + num, function (err, rows) {
        if (err) {
            return console.log(err);
        } else {
            console.log("removed locations");
        }
    });
}

function DeleteAmtTags(connection, num) {
    connection.query('DELETE FROM `hashtags`WHERE `times` < ' + num, function (err, rows) {
       if (err) {
            return console.log(err);
        } else {
            console.log("removed Tags");
        }
    });
}


module.exports = {
    'DeleteTags': DeleteTags,
    'DeleteLocTweets': DeleteLocTweets,
    'DeleteComments': DeleteComments,
    'DeleteAmtLocations' : DeleteAmtLocations,
    'DeleteAmtTags' : DeleteAmtTags
}
