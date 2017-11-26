//
// let arr1 = [{
//
//
//     username: 'Betty_Brooks'
//
//     },
//     {
//
//     username: 'Betty_Adams'
//
//
//     }];

// function alphaOrder (arr){
//
//     //// rearranges the order of objects in array by alphabetical order
//
//
//     return  arr.sort((a, b) =>  {
//
//
//
//             return a.username.toLowerCase().localeCompare(b.username.toLowerCase())
//
//
//
//
//
//
//     });
//
// }
//
//
//
//
// // function initialize(str) {
// //     let address = str;
// //
// //     let geocoder = new google.maps.Geocoder();
// //     geocoder.geocode({
// //         'address': address
// //     }, function(results, status) {
// //         if (status === google.maps.GeocoderStatus.OK) {
// //             let Lat = results[0].geometry.location.lat();
// //             let Lng = results[0].geometry.location.lng();
// //
// //             return [Lat, Lng]
// //
// //
// //         } else {
// //             alert("Something got wrong " + status);
// //         }
// //     });
// // }
//
// console.log(alphaOrder(arr1));

// console.log(initialize('Toronto, Ca'));

// let a = (1 + 12) % 12;
//
// let b = (6 + 11) % 12;
//
// let c = (4 + 4) % 12;
//
// console.log(a);
//
// console.log(b);
//
// console.log(c);
//
// const moment = require('moment');
//
// function getCurrentDate(){
//
//     return moment().format('LL');
//
//
//
// }
//
// console.log(getCurrentDate());


let image = 'https://jammr-app-bucket.s3.ca-central-1.amazonaws.com/1511310600120';

image = image.split('.');

image.shift();

image.shift();

image.unshift('http://s3');

let finishedImage = image.join('.');

console.log(finishedImage);
