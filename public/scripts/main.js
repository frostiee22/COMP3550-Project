(function (window) {
    "use strict";
    $(document).ready(function () {
        var socket = io.connect();

        socket.on('new tweet', function (tweet) {

            // incomming twitter stream form the server


        });

        loadAllRecs(function (data) {
            populateTable(data);
        });

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

        $tbl.dataTable();
    }


    function transformRec(rec) {
        var nRec = {};
        nRec.tag = rec.tag;
        nRec.count = rec.times;
        return nRec;
    }


    function generateRowHTML(rec) {
        var str = "<tr>";
        str += "<td>" + rec.tag + "</td>";
        str += "<td>" + rec.count + "</td>";
        str += "</tr>";
        return str;
    }


    function removeTable(tablebodyid) {
        var tbId = tablebodyid || "tblBody",
            $tBody = $("#" + tbId);

        $tBody.empty();
    }


    function loadAllRecs(callback) {
        $.get("/api/hashtags", function (data) {
            callback(data);
        });
    }

    function loadTop15(callback) {
        $.get("/api/hashtags/top15tags", function (data) {
            console.log(data.length);
            callback(data);
        });
    }




    function defineTableButtons() {
        //configure buttons by assigning functionality programatically
        $("#btnAll").click(function () {
            console.log("All Button Clicked");
            loadAllRecs(function (data) {
                removeTable(); // Remove records before adding new records
                populateTable(data);
            });
        });
        $("#btnTop15").click(function () {
            console.log("top15 Button Clicked");
            loadTop15(function (data) {
                removeTable(); // Remove records before adding new records
                populateTable(data);
            });

        });
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}(this));
