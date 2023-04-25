var des = "";
var hotels = [];
var searched_cities = [];
var citiesLatitude;//a
var citiesLongitude;//a

// Base url for  booking.com api
var baseURL_desInfo = "https://booking-com.p.rapidapi.com/v1/hotels/locations?";
var baseURL_hotels = "https://booking-com.p.rapidapi.com/v1/hotels/search?";
var baseURL_description = "https://booking-com.p.rapidapi.com/v1/hotels/description?";

// Base url for accuWeather api
var baseURL_citySearch = "http://dataservice.accuweather.com/locations/v1/cities/search?";
var baseURL_currentWeather = "http://dataservice.accuweather.com/currentconditions/v1/";
var apiKey_weather = "pCT63hS0FIm6KJ7Sfo8dGQIulm2tBhKA";


const settings = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
        'content-type': 'application/octet-stream',
		"X-RapidAPI-Key": "ccdcd724a8msh75b86de5a1b83f5p14d1ddjsn3fdfe60e540c",
		"X-RapidAPI-Host": "booking-com.p.rapidapi.com"
	}
};

//a
        const settingsCities = {
            async: true,
            crossDomain: true,
            url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/locations/' + citiesLatitude + citiesLongitude + '/nearbyCities?radius=100',
            method: 'GET',
            headers: {
                'content-type': 'application/octet-stream',
                'X-RapidAPI-Key': '177596f740msh5e18310b8c4381cp186568jsne4cce452f7d0',
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        };

//a


$(document).ready(function () {
    
    init();

    $("#history").on("click", "button", function () {
        des = $(this).attr("data-city");
        $("#city-name").val(des);
        getDestInfo();
        getLocationKey();
    });

});

//Search hotels
function searchHotel(event) {
    event.preventDefault();
    des = $("#city-name").val().trim().toLowerCase();
    getDestInfo();
    getLocationKey();
}

//Get destination info
function getDestInfo() {
    showLoadingSpinner();
    var queryParams_desInfo = {
        name: des,
        locale: "en-gb"
    };
    settings.url = baseURL_desInfo + $.param(queryParams_desInfo);
    $.ajax(settings).done(function (response) {
        var destInfo ={
            "dest_id": response[0].dest_id,
            "dest_type": response[0].dest_type,
            "longitude": response[0].longitude,
            "latitude": response[0].latitude
        };
        citiesLatitude = destInfo.latitude;//a
        citiesLongitude = destInfo.longitude;//a
        getHotels(destInfo);
        getNearLocation();
    });
}

console.log("Latitude: " + citiesLatitude);//a
console.log("Longitude: " + citiesLongitude);//a
//a start

function getNearLocation(){
    $.ajax(settingsCities).done(function (response) {
        
        console.log(`settingsCities url: ${settingsCities.url}`);
        var citiesInfo = {
            "city": response.data[0].name
        }
        var firstCity = citiesInfo.name
        console.log(`I am response from getNearLocation():${firstCity}`);
    });
}

//a end




// Get hotels Info
function getHotels(desInfo) {
    var queryParams_hotels = {
        units:"metric",
        adults_number: 2,
        room_number:1,
        order_by:"popularity",
        filter_by_currency:"AED",
        locale:"en-gb"
    };
    queryParams_hotels.checkin_date = arrival_date;
    queryParams_hotels.checkout_date = departure_date;
    queryParams_hotels.dest_id = desInfo.dest_id;
    queryParams_hotels.dest_type = desInfo.dest_type;
    settings.url = baseURL_hotels + $.param(queryParams_hotels);
    hotels = [];
    $.ajax(settings).done(function (response) {
        for (var i = 0; i < 9; i++) {// get the first 9 hotels info
            var hotel = {
                hotel_name: response.result[i].hotel_name,
                address:response.result[i].address,
                hotel_id : response.result[i].hotel_id,
                hotel_image: response.result[i].max_photo_url,
                distance: response.result[i].distance_to_cc,
                review_score : response.result[i].review_score,
                stars: response.result[i].class,
                gross_price: response.result[i].composite_price_breakdown.product_price_breakdowns[0].gross_amount_per_night.value,
                currency: response.result[i].price_breakdown.currency,
                desc: response.result[i].unit_configuration_label
            };
            hotels.push(hotel);
        }
        displayHotels();
        
    });

}

//Display hotels
function displayHotels() {
    var hotel_list = "";
    for (var i = 0; i < hotels.length; i++) {
        hotel_list += '<div class="card-container col-lg-4 col-md-6 col-sm-12">';
        hotel_list += '<div class="card" onclick="getHotelDesc('+i+')">';
        hotel_list += '<img src="'+hotels[i].hotel_image+'" class="card-img-top" alt="image of '+hotels[i].hotel_name+'">';
        hotel_list += '<div class="stars">';
        hotel_list += displayStars(hotels[i].stars);
        hotel_list += '</div>';
        if(hotels[i].review_score==null){
            hotel_list += '<div class="ratings">5.5</div>';
        }else{
            hotel_list += '<div class="ratings">'+hotels[i].review_score+'</div>';
        }
        hotel_list += '<div class="card-body">';
        hotel_list += '<div class="card-title">'+hotels[i].hotel_name+'</div>';
        hotel_list += '<p class="card-text"><i class="fa-sharp fa-solid fa-location-dot icn_bullet"></i><span>'+hotels[i].address+'</span></p>';
        hotel_list += '<p class="card-text"><i class="fa-solid fa-diagram-project icn_bullet"></i><span>'+hotels[i].distance+' km from center</span></p>';
        hotel_list += '<div class="price"><span class="currency">'+hotels[i].currency+'</span><span class="g_price">'+hotels[i].gross_price.toFixed(0)+'</span></div>';
        hotel_list += '</div>';
        hotel_list += '</div>';
        hotel_list += '</div>';
    }
    displayCityName();
    $("#hotels").html(hotel_list);
    if (!searched_cities.includes(des)) {
        des = des.toLowerCase();
        searched_cities.push(des);
        localStorage.setItem("history",JSON.stringify(searched_cities));
        displaySearchHistory();
    }
    removeLoadingSpinner();
}

//Display ciity name
function displayCityName() {
    $("#city_name").text(des);
}

// Hotel details modal
function popup_hotel_details(hotel_index, desc) {
    $("#modal_hotel").modal("show");
    $("#hotel_name").text(hotels[hotel_index].hotel_name);
    $("#stars_modal").html(displayStars(hotels[hotel_index].stars));
    if(hotels[hotel_index].review_score==null){
        $("#ratings_modal").text("5.5");
    }else{
        $("#ratings_modal").text(hotels[hotel_index].review_score);
    }
    $("#hotel_image").html('<img src="'+hotels[hotel_index].hotel_image+'" alt="image of '+hotels[hotel_index].hotel_name+'">');
    $("#address").text(hotels[hotel_index].address);
    $("#distance").text(hotels[hotel_index].distance+ " km from center");
    $("#hotel_desc").text(desc);
    $("#currency").text(hotels[hotel_index].currency);
    $("#g_price").text(hotels[hotel_index].gross_price.toFixed(0));
}

//Get description of the hotel from API
function getHotelDesc(hotel_index) {
    var queryParams_description = {
        hotel_id: hotels[hotel_index].hotel_id,
        locale:"en-gb"
    };
    settings.url = baseURL_description + $.param(queryParams_description);
    $.ajax(settings).done(function (response) {
        popup_hotel_details(hotel_index, response.description);
    });
}

//Display stars
function displayStars(stars) {
    var star_list = "";
    for (var i = 0; i < stars; i++) {
        star_list += '<i class="fa-solid fa-star star"></i>';
    }
    return star_list;
}

// Init
function init() {
    // Set dafault search city and  date range
    des = "London";
    des = des.toLowerCase();
    arrival_date = moment(defaut_startDate, 'DD/MM/YYYY').format("YYYY-MM-DD");
    departure_date = moment(default_endDate, 'DD/MM/YYYY').format("YYYY-MM-DD");
    $("#city-name").val(des);
    getDestInfo();
    getLocationKey();
    // Get searched cities history from local storage if available
   if (localStorage.getItem("history") == null) {
       searched_cities = [];
   } else {
       searched_cities = JSON.parse(localStorage.getItem("history"));
       displaySearchHistory();
   }
}
   
//Display search history
function displaySearchHistory() {
    $("#history").empty(); // Clear the current displayed history
    for (var i = 0; i < searched_cities.length; i++) {
        var history ="<button class=\"btn\" data-city=\""+searched_cities[i]+"\">"+searched_cities[i]+"</button>";
        $("#history").append(history);
    }   
}

//Display loading spinner
function showLoadingSpinner() {
    var spinner ="";
    spinner += '<div class="overlay">';
    spinner += '<div class="loading_spinner"></div>';
    spinner += '</div>';
    $("body").append(spinner);
    $(".overlay").fadeIn();
}

// Remove loading spinner
function removeLoadingSpinner() {
    $(".overlay").fadeOut().remove();
}

// Get location key for the searched city
function getLocationKey() {
    var queryParams = {
        apikey: apiKey_weather,
        q: des
    };
    var queryURL_city = baseURL_citySearch+$.param(queryParams);
    $.ajax({
        url: queryURL_city,
        method: "GET"
    }).then(function(response) {
        getWeatherTemperature(response[0].Key);
    });
}

//Get current weather temperature of the searched city
function getWeatherTemperature(locKey){
    var queryParams = {
        apikey: apiKey_weather
    };
    var queryURL_currentWeather = baseURL_currentWeather+locKey+"?"+$.param(queryParams);
    $.ajax({
        url: queryURL_currentWeather,
        method: "GET"
    }).then(function(weatherInfo) {
        var temp = weatherInfo[0].Temperature.Metric.Value;
        var iconNum = weatherInfo[0].WeatherIcon;
        $("#temp").text(temp+"°C");
        $("#cond").html('<img src="images/weather_icons/w'+iconNum+'.png">');
    });
}
