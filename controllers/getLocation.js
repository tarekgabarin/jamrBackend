const axios = require('axios');

const request = require('request');


function getCoordinates(street, city, country){

    let data = undefined;

    let isFinished = false;

    function formatStrings(str) {

        str = str.split('');

        for (let i = 0; i < str.length; i++) {

            if (str[i] === ' ') {

                str[i] = '+';

            }
        }

        return str.join('');
    }

    street = formatStrings(street);

    city = formatStrings(city);


    const address = `https://maps.googleapis.com/maps/api/geocode/json?address=${street}, +${city}, +${country}&key=AIzaSyCZGDHMtmb2WAoZG1VukVSumsjz9kNGJOw`;

    request(address, (error, response, body) => {

        let local = JSON.parse(body);

        data = local['results'][0]['geometry'].location;

        console.log(data);

        isFinished = true;




    })




   //
   // if (isFinished === true && data === ){
   //
   //     console.log('If block running');
   //
   //      return data
   //
   //  }







}


let result = getCoordinates('460 King St. W', 'Toronto', 'CA');
console.log('result is...' + result);