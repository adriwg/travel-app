var des = "London";
var arrival_date = "2023-04-20";
var departure_date = "2023-04-25";
var hotels = [];
var hotel_images = [];
var searched_cities = [];
var baseURL_desInfo = "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?";
var baseURL_hotels = "https://apidojo-booking-v1.p.rapidapi.com/properties/list?";
var base_hotelPhoto = "https://apidojo-booking-v1.p.rapidapi.com/properties/get-hotel-photos?";

const settings = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "c1f202a7cbmsh8b90010ef43997bp1724c4jsna7e8b9d9879c",
		"X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com"
	}
};

getDestInfo();

//Get destination info
function getDestInfo() {
    var queryParams_desInfo = {
        text: des,
        languagecode: "en-us"
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
        offset: 0,
        guest_qty: 2,
        room_qty:1,
        price_filter_currencycode:"USD",
        order_by:"popularity",
        languagecode:"en-us",
        travel_purpose:"leisure"
    };
    queryParams_hotels.arrival_date = arrival_date;
    queryParams_hotels.departure_date = departure_date;
    queryParams_hotels.dest_ids = desInfo.dest_id;
    queryParams_hotels.search_type = desInfo.dest_type;
    settings.url = baseURL_hotels + $.param(queryParams_hotels);
    $.ajax(settings).done(function (response) {
        for (var i = 0; i < 9; i++) {// get the first 9 hotels info
            var hotel = {
                hotel_name: response.result[i].hotel_name,
                address:response.result[i].address,
                hotel_id : response.result[i].hotel_id,
                review_score : response.result[i].review_score
            };
            getHotelImage(response.result[i].hotel_id, hotel);
        }
        console.log(hotels);
    });
    
}

//Get hotel hi res image
function getHotelImage(hotelID, hotel) {
    var queryParams_hotelPhoto = {
        hotel_ids:hotelID
    };
    settings.url = base_hotelPhoto + $.param(queryParams_hotelPhoto);
    $.ajax(settings).done(function (imgData) {
        var image = "https://cf.bstatic.com"+imgData.data[hotelID][0][4];
        hotel.hotel_image = image;
        hotels.push(hotel);
    });  
}



