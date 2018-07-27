
var Login = function () {
    //debugger
    if (!$("#loginForm").valid()) {
        return false;
    }
    var data = $("#loginForm").serialize();
    $.ajax({
        type: 'POST',
        url: "/Home/Login/",
        data: data,

        success: function (result) {
            $('#loginForm')[0].reset();
            if (result == "1") {
                swal(
                       'Wrong username or password....',
                       ' ',
                       'error'
                        );
            }
            else {
                //debugger
                $("#ShowRegister").hide();
                $("#ShowLogin").hide();
                $("#uname").text("Welcome " + result + "!");
                $(location).attr('href', history.go(0));
            }
        }
    });
}

var Register = function () {
    //debugger
    if (!$("#registerForm").valid()) {
        return false;
    }
    var data = $("#registerForm").serialize();
    $.ajax({
        type: 'POST',
        url: "/Home/Register/",
        data: data,

        success: function (result) {
            $('#registerForm')[0].reset();
            if (result == "0") {
                swal(
                       'Successfully registered!',
                       ' ',
                       'success'
                        );
                $('#loginForm')[0].reset();
                $("#ShowRegister").hide();
                $("#ShowLogin").show();
            }

            else {
                swal(
                      'Username already exist. Try again...',
                      ' ',
                      'Failed'
                       );
            }
        }
    });
}

var Logout = function () {
    //debugger
    $.ajax({
        type: 'POST',
        url: "/Home/Logout/",
     
        success: function (result) {
            if (result == "0") {
                $(location).attr('href', history.go(0));
            }

            else {
                swal(
                      'Something get wrong....',
                      ' ',
                      'Failed'
                       );
            }
        }
    });
}

var showOrHide = function () {
    var data = event.target.id;
    $("#ShowRegister").hide();
    $("#ShowLogin").hide();
    data = "#" + data.substring(2);
    $(data).show();
}