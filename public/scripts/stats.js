(function (window) {
    $(document).ready(function () {
        defineChartButtons();

        //        loadLocationTweets(function (data) {
        //            var recs = data.map(transformRec)
        //            drawColumnChartByLocation(recs);
        //        });


    });

    function loadLocationTweets(callback) {
        $.get('/api/location/tweets/0/150', function (data) {
            callback(data);
        });
    }

    function loadTop15Tags(callback) {
        $.get('/api/hashtags/DESC/0/15', function (data) {
            callback(data);
        });
    }

    function loadTop15Locations(callback) {
        $.get('/api/location/DESC/0/15', function (data) {
            callback(data);
        })
    }


    function transformRec(rec) {
        var nRec = {};
        nRec.location = rec.location;
        nRec.tweets = rec.tweets;
        return nRec;
    }



    function drawColumnChartByLocation(tweets) {
        var chartid = "chartSec";
        var count = {};
        //Extract the values
        tweets.forEach(function (el) {
            if (count[el.location] === undefined) {
                count[el.location] = 0;
            }
            count[el.location] = el.tweets;
        });


        var data = [];

        for (var location in count) {
            var dObj = {};
            dObj.name = location;
            dObj.data = [count[location]];

            data.push(dObj);
        }

        $("#" + chartid).highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: "Tweets distribution"
            },
            xAxis: {
                categories: [
                    "Locations"
                ]
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Occurances'
                }
            },
            series: data
        })
    }


    function drawPieChartByTop15Tags(tweets) {
        var chartid = "chartSec";

        var count = {};
        //Extract the values
        tweets.forEach(function (el) {
            if (count[el.tag] === undefined) {
                count[el.tag] = 0;
            }

            count[el.tag] += el.times;
            console.log(el.times);
        });


        // Format the data in the way the library expects
        var recs = [];
        for (var tag in count) {
            recs.push([tag, count[tag]]);
        }


        $("#" + chartid).highcharts({
            title: {
                text: "top 15 tags"
            },
            series: [{
                type: 'pie',
                name: '#tags',
                data: recs
   }]
        })
    }


    function drawColumnChartByTop15Locations(tweets) {
        var chartid = "chartSec";

        var count = {};
        //Extract the values
        tweets.forEach(function (el) {
            if (count[el.location] === undefined) {
                count[el.location] = 0;
            }

            count[el.location] += el.tweets;
            console.log(el.tweets);
        });


        // Format the data in the way the library expects
        var recs = [];
        for (var location in count) {
            recs.push([location, count[location]]);
        }


        $("#" + chartid).highcharts({
            title: {
                text: "top 15 locations"
            },
            series: [{
                type: 'pie',
                name: 'locations',
                data: recs
   }]
        })
    }




    function defineChartButtons() {
        $("#btnChartLocation").click(function () {
            console.log("Locations Button Clicked");
            $(".lead").html("Bar chart showing amount of tweets in a particular location");
            loadLocationTweets(function (data) {
                var recs = data.map(transformRec)
                drawColumnChartByLocation(recs);
            });
        });

        $("#btnChartTop15Locations").click(function () {
            console.log("Top15Locations Button Clicked");
            $(".lead").html("Pie chart showing the top 15 locations");
            loadTop15Locations(function (data) {
                drawColumnChartByTop15Locations(data);
            });
        });


        $("#btnChartTop15Tags").click(function () {
            console.log("Top15Tags Button Clicked");
            $(".lead").html("Pie chart showing the top 15 hashtags used");

            loadTop15Tags(function (data) {
                drawPieChartByTop15Tags(data);
            });
        });


    }





}(this));
