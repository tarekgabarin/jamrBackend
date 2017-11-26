const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const authentication = require('../controllers/authentication');
const User = require('../models/user');
mongoose.Promise = Promise;

const axios = require('axios');

router.put('/', authentication.verifyOrdinaryUser, (req, res) => {

    function formatStrings(str) {

        str = str.split('');

        for (let i = 0; i < str.length; i++) {

            if (str[i] === ' ') {

                str[i] = '+';

            }
        }

        return str.join('');
    }

    let street = formatStrings(String(req.body.street));

    let city = formatStrings(String(req.body.city));

    let country = String(req.body.country);

    const address = `https://maps.googleapis.com/maps/api/geocode/json?address=${street}, +${city}, +${country}&key=AIzaSyCZGDHMtmb2WAoZG1VukVSumsjz9kNGJOw`;

    let getSrc = () => {


        return axios.get(address)
            .then((response) => {
                console.log('address is..' + address);
                return response.data.results[0].geometry;


            })
            .catch(function (error) {
                console.log(error);
            });


    };


    getSrc().then(response => {


        User.findOneAndUpdate({_id: req.decoded.id, creationDate: req.decoded.creationDate}, {


            $set: {

                loc: {

                    type: 'Point',
                    coordinates: [response.location.lng, response.location.lat]
                },

                city: req.body.city,

                provinceState: req.body.provinceState,

                street: req.body.street,

                firstName: req.body.firstName,

                lastName: req.body.lastName,

                iWantToMake: req.body.iWantToMake,

                gender: req.body.gender,

                skills: req.body.skills,

                imLookingFor: req.body.imLookingFor

            }

        }, {

            new: true

        }).then(user => {

            res.json(user)

        })

    })

});

module.exports = router;