$(document).ready(function() {
    $("#register").click(function() {
        var name = $("#loginName").val();
        var password = $("#loginPassword1").val();
        var cpassword = $("#loginPassword2").val();
        if (name == '' || email == '' || password == '' || cpassword == '') {
            alert("Please fill all fields...!!!!!!");
        } else if ((password.length) < 8) {
            alert("Password should atleast 8 character in length...!!!!!!");
        } else if (!(password).match(cpassword)) {
            alert("Your passwords don't match. Try again?");
        } else {
            alert('You have Successfully Registered.....');

        }
    });
});
