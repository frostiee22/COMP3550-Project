(function (window) {
    "use strict";
    $(document).ready(function () {


        defineTableButtons();

    });


    function defineTableButtons() {
     //configure buttons by assigning functionality programatically
     $("#startpage").click(function () {
         console.log("login Button Clicked");
         location.href = "/";
     });
     $("#registerpage").click(function () {
         console.log("register Button Clicked");
         location.href = "/register.html";

     });
 }
}(this));
