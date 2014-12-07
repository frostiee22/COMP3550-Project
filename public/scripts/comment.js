(function (window) {
        "use strict";
        $(document).ready(function () {



            setInterval(function(){
                loadAllComments(function (data) {
                populateTable(data);
                $("#submit").click(function () {
                 reset();
             });

            });
	           },5000);




        });




        function loadAllComments(callback) {
            $.get("/api/comments", function (data) {
                callback(data);
            });
        }


        function populateTable(users, tableid, tablebodyid) {
            var tbId = tablebodyid || "commentsList",
                $tBody = $("#" + tbId);
                $tBody.empty();

            users.forEach(function (el){
                var rec = transformRec(el);
                $tBody.append(generateRowHTML(rec));
            });

        }

        function transformRec(rec) {
            var nRec = {};
            nRec.name = rec.name;
            nRec.comment = rec.comment;
            nRec.time = rec.timestamp;
            return nRec;
        }




    function generateRowHTML(rec) {
        var str = '<li>';
        str += '<div class="commenterImage">';
        str += '<img src = "http://americanmuslimconsumer.com/wp-content/uploads/2013/09/blank-user.jpg"/>';
        str += '</div>';
        str += '<div class="commentText">';
        str += '<p class=""><h4>'+ rec.name +'</h4>'+ rec.comment +'</p><span class="date sub-text">'+rec.time+'</span>';
        str += '</div>';
        str += ' </li>';
        return str;
    }

}(this));
