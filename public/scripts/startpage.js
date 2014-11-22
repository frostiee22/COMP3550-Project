(function (window) {
    "use strict";
    $(document).ready(function () {


        defineTableButtons();

    });


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







}(this));
