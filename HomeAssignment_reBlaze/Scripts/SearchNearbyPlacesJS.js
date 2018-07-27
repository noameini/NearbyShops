var temp_lat = '';
var temp_lng = '';
var map;
var infowindow;

function initialize() {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    if (document.getElementById("ShowRegister") == null && document.getElementById("ShowLogin") == null) {
        if (temp_lat == "" || temp_lng == "") {
            $.ajax({
                type: 'POST',
                url: "/Home/checkLanLng/?temp_lat=" + temp_lat + "&temp_lng=" + temp_lng,

                success: function (result) {
                    //debugger
                    if (result != "") {
                        var ans = result.split(" ");
                        temp_lat = ans[0];
                        temp_lng = ans[1];
                    }
                    else {
                        temp_lat = 51.507222; //set default lat value
                        temp_lng = -0.1275; //set default lng value
                    }
                    initMap();
                }
            });
        }
    }
}

function showPosition(position) {
    //debugger
    temp_lat = position.coords.latitude;
    temp_lng = position.coords.longitude;

    $.ajax({
        type: 'POST',
        url: "/Home/checkLanLng/?temp_lat=" + temp_lat + "&temp_lng=" + temp_lng,
    });
}

function initMap() {
    //debugger
    var loc = {
        lat: parseFloat(temp_lat),
        lng: parseFloat(temp_lng)
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: loc,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: loc,
        radius: 1000,
        type: ['store']
    }, callback);
}

function callback(results, status) {
    //debugger
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var count = 0; var str = "";
        for (var i = 0; i < results.length; i++) {
            if (count == 3) {
                count = 0;
                str += "<div class=\"row text-center\">" +
                    "<div class=\"col-md-3 col-sm-6 hero-feature\">" +
                    "<div class=\"thumbnail\">" +
                    "<div class=\"caption\">" +
                    "<h3>" + (i + 1) + ".&nbsp" + results[i].name + "</h3>" +
                    "<img src=" + results[i].icon + " style=\"width:200px;height:200px;\">" +
                    "<div style=\"text-align: center;\"><a href=\"#\" class=\"btn btn-success\" id=" + i + " onclick=\"addPreferredShop(event)\">Like</a>" +
                    "<input type=\"hidden\" id=\"" + i + "a\" value=\"" + (results[i].name) + "\">" +
                    "<input type=\"hidden\" id=\"" + i + "b\" value=\"" + (results[i].icon) + "\">" +
                    "&nbsp&nbsp<a href=\"#\" class=\"btn btn-danger\">Dislike</a></div>" +
                    "</div></div></div></div>"
            }
            else {
                count++;
                str += "<div class=\"col-md-3 col-sm-6 hero-feature\">" +
                    "<div class=\"thumbnail\">" +
                    "<div class=\"caption\">" +
                    "<h3>" + (i + 1) + ".&nbsp" + results[i].name + "</h3>" +
                    "<img src=" + results[i].icon + " style=\"width:200px;height:200px;\">" +
                    "<div style=\"text-align: center;\"><a href=\"#\" class=\"btn btn-success\" id=" + i + " onclick=\"addPreferredShop(event)\">Like</a>" +
                    "<input type=\"hidden\" id=\"" + i + "a\" value=\"" + (results[i].name) + "\">" +
                    "<input type=\"hidden\" id=\"" + i + "b\" value=\"" + (results[i].icon) + "\">" +
                    "&nbsp&nbsp<a href=\"#\" class=\"btn btn-danger\">Dislike</a></div>" +
                    "</div></div></div></div>"
            }
        }
        $("#StoreList").append(str);
    }
}

var addPreferredShop = function () {
    var res1 = $("#" + event.target.id + "a").val();
    var res2 = $("#" + event.target.id + "b").val();
    $.ajax({
        type: 'POST',
        url: "/Home/addPreferredShop?name=" + res1 + "&icon=" + res2,

        success: function (result) {
            if (result == 1) {
                swal(
                   'This shop added to your referred shops!',
                   ' ',
                   'success'
                    );
            }
            else {
                swal(
                  'This shop already exist your referred shops',
                  ' ',
                  'error'
                   );
            }
        }
    });

}

