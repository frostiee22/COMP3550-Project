(function (window) {
    $(document).ready(function () {


        defineTableButtons();

    });

    function defineTableButtons() {
        //configure buttons by assigning functionality programatically
        $("#startpage").click(function () {
            console.log("login Button Clicked");
            location.href = "/";
        });
        $("#loginpage").click(function () {
            console.log("register Button Clicked");
            location.href = "/login.html";

        });
    }


}(this));
