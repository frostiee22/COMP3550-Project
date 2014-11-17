(function (window) {

    $(document).ready(function () {
        var socket = io.connect();

        socket.on('new tweet', function (tweet) {
            AtToHTMLPage(tweet);
            // var html = generateRow(tweet);
            // $("#tblBody").append(html);

            // console.log(tweet)
            // $('#tweet_logs').append(tweet.user.name);
        });
    });


    function AtToHTMLPage(tweet) {
        var html = generateRow(tweet);
        $("#tblBody").append(html);
    }


    function generateRow(el) {
        //if ((el.user.location).match(/Trinidad/g)){
        var str = "<tr>";
        str += "<td><img scr='" + el.user.profile_image_url_https + "' alt='profile image' /></td>";
        str += "<td>" + el.text + "</td>";
        str += "<td>" + el.user.screen_name + "</td>";
        str += "<td>" + getfriends(el.entities.user_mentions) + "</td>";
        str += "<td>" + el.user.location + "</td>";
        str += "<td>" + el.timestamp_ms + "</td>";
        str += "</tr>";
        return str;
        var socket = io.connect();
        //socket.on('new insert',function(el));

        //}
    }


    function getfriends(el) {
        var friends = "";
        for (var i = 0; el.length > i; i++) {
            if (el.length === 1)
                friends += el[i].screen_name;
            else {
                if (el.length === i + 1)
                    friends += el[i].screen_name;
                else
                    friends += el[i].screen_name + ", ";
            }
        }

        return friends;

    }


}(this));
