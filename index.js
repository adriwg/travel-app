var des = "New York";
var arrival_date = "2023-05-15";
var departure_date = "2023-05-25";
var hotels = [];
var hotel_images = [];
var searched_cities = [];
var baseURL_desInfo = "https://booking-com.p.rapidapi.com/v1/hotels/locations?";
var baseURL_hotels = "https://booking-com.p.rapidapi.com/v1/hotels/search?";
var baseURL_description = "https://booking-com.p.rapidapi.com/v1/hotels/description?";

const settings = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
        'content-type': 'application/octet-stream',
		"X-RapidAPI-Key": "3ba3d3f340msh0310df6d354c212p1fbeacjsne80795a396e8",
		"X-RapidAPI-Host": "booking-com.p.rapidapi.com"
	}
};

getDestInfo();

//Get destination info
function getDestInfo() {
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
        getHotels(destInfo);
    });
}

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
    console.log(settings.url);
    $.ajax(settings).done(function (response) {
        for (var i = 0; i < 9; i++) {// get the first 9 hotels info
            var hotel = {
                hotel_name: response.result[i].hotel_name,
                address:response.result[i].address,
                hotel_id : response.result[i].hotel_id,
                hotel_image: response.result[i].max_photo_url,
                distance: response.result[i].distances[0].text,
                review_score : response.result[i].review_score,
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
        var d = hotels[i].distance.split("•");
        var hotel_distance = d[1];
        hotel_list += '<div class="card-container col-lg-4 col-md-6 col-sm-12">';
        hotel_list += '<div class="card" onclick="getHotelDesc('+i+')">';
        hotel_list += '<img src="'+hotels[i].hotel_image+'" class="card-img-top" alt="image of '+hotels[i].hotel_name+'">';
        hotel_list += '<div class="ratings">'+hotels[i].review_score+'</div>';
        hotel_list += '<div class="card-body">';
        hotel_list += '<div class="card-title">'+hotels[i].hotel_name+'</div>';
        hotel_list += '<p class="card-text"><i class="fa-sharp fa-solid fa-location-dot icn_bullet"></i><span>'+hotels[i].address+'</span></p>';
        hotel_list += '<p class="card-text"><i class="fa-solid fa-diagram-project icn_bullet"></i><span>'+hotel_distance+'</span></p>';
        hotel_list += '<div class="price"><span class="currency">'+hotels[i].currency+'</span><span class="g_price">'+hotels[i].gross_price.toFixed(0)+'</span></div>';
        hotel_list += '</div>';
        hotel_list += '</div>';
        hotel_list += '</div>';
    }
    displayCityName();
    $("#hotels").append(hotel_list);
}

//Display ciity name
function displayCityName() {
    $("#city_name").text(des);
}

// Hotel details modal
function popup_hotel_details(hotel_index, desc) {
    var d = hotels[hotel_index].distance.split("•");
    var hotel_distance = d[1];
    $("#modal_hotel").modal("show");
    $("#hotel_name").text(hotels[hotel_index].hotel_name);
    $("#ratings_modal").text(hotels[hotel_index].review_score);
    $("#hotel_image").html('<img src="'+hotels[hotel_index].hotel_image+'" alt="image of '+hotels[hotel_index].hotel_name+'">');
    $("#address").text(hotels[hotel_index].address);
    $("#distance").text(hotel_distance);
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
        console.log(response.description);
        popup_hotel_details(hotel_index, response.description);
    });
}







