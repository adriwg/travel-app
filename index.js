var des = "London";
var arrival_date = "2023-04-20";
var departure_date = "2023-04-25";
var baseURL_desInfo = "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete?";
var baseURL_hotels = "https://apidojo-booking-v1.p.rapidapi.com/properties/list?";



const settings = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "bb4ee377damshe923f8ad26d0750p15f027jsnb05735e0afb1",
		"X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com"
	}
};

getDestInfo();

function getDestInfo() {
    var queryParams_desInfo = {
        text: des,
        languagecode: "en-us"
    };
    settings.url = baseURL_desInfo + $.param(queryParams_desInfo);
    $.ajax(settings).done(function (response) {
        var destInfo ={
            "dest_id": response[0].dest_id,
            "dest_type": response[0].dest_type
        };
        //console.log(destInfo);
        getHotels(destInfo);
        //return destInfo;
    });
}



function getHotels(desInfo) {
    console.log("desInfo", desInfo);
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
    console.log(settings.url);
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}


