var des = "Birmingham";
var arrival_date = "2023-04-22";
var departure_date = "2023-04-25";
var hotels = [];
var hotel_images = [];
var searched_cities = [];
var baseURL_desInfo = "https://booking-com.p.rapidapi.com/v1/hotels/locations?";
var baseURL_hotels = "https://booking-com.p.rapidapi.com/v1/hotels/search?";
var base_hotelPhoto = "https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos?";

const settings = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
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
                review_score : response.result[i].review_score,
                gross_price: response.result[i].gross_price,
                currency: response.result[i].currency
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
        hotel_list += '<div class="card">';
        hotel_list += '<img src="'+hotels[i].hotel_image+'" class="card-img-top" alt="image of '+hotels[i].hotel_name+'" class="card-img-top">';
        hotel_list += '<div class="ratings">'+hotels[i]. review_score+'</div>';
        hotel_list += '<div class="card-body">';
        hotel_list += '<div class="card-title">'+hotels[i].hotel_name+'</div>';
        hotel_list += '<p class="card-text"><i class="fa-sharp fa-solid fa-location-dot location"></i>  '+hotels[i].address+'</p>';
        hotel_list += '</div>';
        hotel_list += '</div>';
        hotel_list += '</div>';
    }
    $("#hotels").append(hotel_list);
}




