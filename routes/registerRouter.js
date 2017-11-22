const bcrypt = require('bcryptjs');
const authentication = require('../controllers/authentication');
const express = require('express');
const passport = require('passport');
const passportService = require('../services/passport');


const config = require('../config/config.js');

const axios = require('axios');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = Promise;

const AWS = require('aws-sdk');

const generateToken = require('../controllers/generateToken');

const multer = require('multer');

const multerS3 = require('multer-s3');

const accessKeyId = 'AKIAJM3IIBOYRVIZPZBQ';

const secretAccessKey = '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';

AWS.config.update({

    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "ca-central-1"

});

const fs = require('fs');

const s3 = new AWS.S3();

let upload = multer({

    storage: multerS3({

        s3: s3,

        bucket: "jammr-app-bucket",

        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString()); //use Date.now() for unique file keys
        }
    })

});


const User = require('../models/user');

router.post('/', upload.single('file'), (req, res, next) => {


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


    getSrc().then((response) => {
        console.log('lat lat lat: ', response.location);

        User.findOne({email: req.body.email})

            .then((user) => {

                if (!user) {

                    let password = req.body.password;

                    bcrypt.genSalt(10, function (err, salt) {

                        if (err) throw err;

                        bcrypt.hash(password, salt, function (err, hash) {

                            if (err) throw err;


                            let userName = `${req.body.firstName}_${req.body.lastName}`;

                            console.log(userName);


                            User.create({

                                firstName: req.body.firstName,

                                lastName: req.body.lastName,

                                email: req.body.email,

                                password: hash,

                                skills: req.body.skills,

                                gender: req.body.gender,

                                age: req.body.age,

                                username: userName,


                                //// myLocation: [response.location.lng, response.location.lat],

                                loc: {
                                    type: 'Point',
                                    coordinates: [response.location.lng, response.location.lat]
                                },

                                city: city,

                                profilePic: String(req.file.location),

                                country: country,

                                street: street,

                                provinceState: req.body.provinceState,

                                iWantToMake: req.body.iWantToMake,

                                youTubeLink: req.body.youTubeLink,

                                deviantArtLink: req.body.deviantArtLink,

                                itchIO: req.body.itchIO,

                                gitHubLink: req.body.gitHubLink,

                                imLookingFor: req.body.imLookingFor


                            })

                                .then((user) => {


                                    let userToken = generateToken.generateUserToken(user);


                                    res.header('x-auth', userToken).send(userToken);

                                    res.json(user);


                                })


                        })


                    })


                }


            })





    });


});

module.exports = router;
