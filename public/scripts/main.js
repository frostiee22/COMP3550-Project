(function (window) {
    "use strict";
    $(document).ready(function () {
        var socket = io.connect(),
            check = 0;

        // incomming twitter stream form the server
        socket.on('new tweet', function (tweet) {
            if (check == 0) {
                //console.log(tweet);
                check = 1;
            }
        });


        setInterval(function () {
            check = 0;
        }, 5000);




        loadAllHashTags(function (data) {
            var tbH = "hashtagsHead",
                $tHead = $("#" + tbH);
            $tHead.append("<tr><th>tags</th><th>count</th></tr>");
            populateTable(data, "hashtags", "hashtagsBody");

            $("#hashtags").dataTable({
                "pagingType": "full_numbers"
            });
        });

        LoadAllLocations(function (data) {
            var tbH = "locationsHead",
                $tHead = $("#" + tbH);
            $tHead.append("<tr><th>locations</th><th>count</th></tr>");
            populateTable(data, "locations", "locationsBody");


            $("#locations").dataTable({
                "pagingType": "full_numbers"
            });
        })

        defineTableButtons();

    });





    function populateTable(users, tableid, tablebodyid) {
        var tbId = tablebodyid || "tblBody",
            tId = tableid || "mainTbl",
            $tBody = $("#" + tbId),
            $tbl = $("#" + tId);


        users.forEach(function (el) {
            var rec = transformRec(el);
            $tBody.append(generateRowHTML(rec));
        });

//        $tbl.dataTable({
//            "pagingType": "full_numbers"
//        });



    }


    function transformRec(rec) {
        var nRec = {};
        if (rec.tag != undefined) {
            nRec.name = rec.tag;
            nRec.count = rec.times;
            return nRec;
        } else {
            nRec.name = rec.location;
            nRec.count = rec.tweets;
            return nRec;
        }

    }


    function generateRowHTML(rec) {
        var str = "<tr>";
        str += "<td>" + rec.name + "</td>";
        str += "<td>" + rec.count + "</td>";
        str += "</tr>";
        return str;
    }


    function removeTable(tableheadid, tablebodyid) {
        var tbId = tablebodyid || "tblBody",
            $tBody = $("#" + tbId),
            tbH = tableheadid || "tblHead",
            $tHead = $("#" + tbH);

        $tHead.empty();
        $tBody.empty();
    }


    function loadAllHashTags(callback) {
        $.get("/api/hashtags", function (data) {
            callback(data);
        });
    }

    function LoadAllLocations(callback) {
        $.get("/api/location/tweets/0/150", function (data) {
            callback(data);
        });
    }




    function defineTableButtons() {
        //configure buttons by assigning functionality programatically
        $("#btnAll").click(function () {
            console.log("All Button Clicked");
            $("#info").empty();
            $("#info").append("Showing the amount of times a #tag was used");

            var tbH = "hashtagsHead",
                $tHead = $("#" + tbH);

            // Remove records before adding new records
            removeTable(tbH, "hashtagsBody");
            loadAllHashTags(function (data) {
                $tHead.append("<tr><th>tags</th><th>count</th></tr>");
                populateTable(data, "hashtags", "hashtagsBody");
            });
        });

        $("#btnTop15").click(function () {
            console.log("top15 Button Clicked");
            $("#info").empty();
            $("#info").append("Showing amount of tweets in a location");

            var tbH = "locationsHead",
                $tHead = $("#" + tbH);

            // Remove records before adding new records
            removeTable(tbH, "locationsBody");
            LoadAllLocations(function (data) {
                $tHead.append("<tr><th>locations</th><th>count</th></tr>");
                populateTable(data, "locations", "locationsBody");
            });
        });
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}(this));
