
function DeleteTags(connection) {
    connection.query('DELETE FROM `hashtags`WHERE `times` < 5', function (err, rows) {
        if (err) {
            return err;
        } else {
            console.log("removed unused  hashtags");
        }
    });
}

function DeleteLocTweets(connection){
    connection.query('DELETE FROM `locations`WHERE `tweets` < 5', function (err, rows) {
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


function RemoveLeastUsed(connection ,num) {
   connection.query('DELETE FROM `hashtags`WHERE `times` < "' + num + "';", function (err, rows) {
       console.log("removed rows");
   });
}


module.exports = {
    'DeleteTags' : DeleteTags,
    'DeleteLocTweets' : DeleteLocTweets,
    'DeleteComments' : DeleteComments,
    'RemoveLeastUsed' : RemoveLeastUsed
}
