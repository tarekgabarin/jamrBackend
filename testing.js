
let arr1 = [{


    firstname: 'Betty',

    lastname: 'adams'

    },
    {

    firstname: 'Betty',

    lastname: 'Brooks'


    }];

function alphaOrder (arr){

    //// rearranges the order of objects in array by alphabetical order


    return  arr.sort((a, b) =>  {

        if (a.firstname.toLowerCase() !== b.firstname.toLowerCase()) {

            return a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase())

        }

        else {

            return a.lastname.toLowerCase().localeCompare(b.lastname.toLowerCase());

        }



    });

}


function initialize(str) {
    let address = str;

    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            let Lat = results[0].geometry.location.lat();
            let Lng = results[0].geometry.location.lng();

            return [Lat, Lng]


        } else {
            alert("Something got wrong " + status);
        }
    });
}

console.log(alphaOrder(arr1));

console.log(initialize('Toronto, Ca'));


