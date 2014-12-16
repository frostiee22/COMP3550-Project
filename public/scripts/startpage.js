(function (window) {
    "use strict";
    $(document).ready(function () {
        defineTableButtons();

        var socket = io.connect(),
            count = 0,
            check = 0;

        setInterval(function () {
            check = 0;
        }, 2500);

        socket.on('new tweet', function (tweet) {

//            $("#tweetcount").html('tweets : ' + count + '');
//            count = count + 1;
//            LastTags(tweet);
//            LastUserMention(tweet);

            if (check == 0) {
                LiveTweets("livetweets", tweet);
                check = 1;
            }



        });

    });


    function LiveTweets(id, tweet) {
        $("#" + id).empty();
        $("#" + id).append("<tr><th>name</th><th>message</th><th>location</th></tr>");
        $("#" + id).append("<tr><td>" + tweet.user.name + "</td><td>" + tweet.text + "</td><td>" + tweet.user.location + "</td></tr>");
    }



    function defineTableButtons() {
        //configure buttons by assigning functionality programatically
        $("#login").click(function () {
            console.log("login Button Clicked");
            location.href = "/login.html";
        });
        $("#register").click(function () {
            console.log("register Button Clicked");
            location.href = "/register.html";

        });
    }



    function LastTags(tweet) {

        if (tweet.entities != null) {
            if (tweet.entities.hashtags != null) {
                var el = tweet.entities.hashtags;

                for (var i = 0; el.length > i; i++) {
                    var tag = el[i].text;
                    $("#lasttag").html('last tag : ' + tag + '');

                }
            }
        }
    }


    function LastUserMention(tweet) {

        if (tweet.entities != null) {
            if (tweet.entities.user_mentions != null) {
                var el = tweet.entities.user_mentions;

                for (var i = 0; el.length > i; i++) {
                    var user = el[i].screen_name;
                    $("#lastmention").html('last mention : ' + user + '');

                }
            }
        }
    }




}(this));
