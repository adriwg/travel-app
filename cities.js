
// console.log(destInfo.longitude)
// console.log(destInfo.latitude)
// console.log(des);

// response comes, with city name 

let savedResponse = [
{id: 126893, wikiDataId: 'Q840678', type: 'CITY', city: 'Redondo Beach', name: 'Redondo Beach'},

{id: 126136, wikiDataId: 'Q828712', type: 'CITY', city: 'Hermosa Beach', name: 'Hermosa Beach'},

{id: 126493, wikiDataId: 'Q489197', type: 'CITY', city: 'Torrance', name: 'Torrance'},

{id: 3196368, wikiDataId: 'Q7966564', type: 'CITY', city: 'Walteria', name: 'Walteria'},

{id: 126133, wikiDataId: 'Q948149', type: 'CITY', city: 'Palos Verdes Estates', name: 'Palos Verdes Estates'}

]

// can access city name from response aray
 for (let i = 0; i < savedResponse.length; i++){
    console.log(savedResponse[i].city);
 }


let one = localStorage.getItem('currentLat');
let two = localStorage.getItem('currentLon');
console.log(one);//need to refresh page to retrieve from local storage to log to console
console.log(two);
