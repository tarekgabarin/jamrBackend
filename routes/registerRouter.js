const bcrypt = require('bcryptjs');
const authentication = require('../controllers/authentication');
const express = require('express');
const passport = require('passport');
const passportService =require('../services/passport');
const config = require('../config/config');

const axios = require('axios');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = Promise;

const generateToken = require('../controllers/generateToken');



const User = require('../models/user');

const request = require('request');


function generateUserToken(user){


    return jwt.sign({id: user._id, creationDate: user.creationDate, username: user.username, profilePic: user.profilePic}, config.secretKey);



}


router.post('/', (req, res, next) => {


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
            .then( (response) => {
                return response.data.results[0].geometry;




            })
            .catch(function (error) {
                console.log(error);
            });


    };


    getSrc().then((response)=>{
        console.log('lat lat lat: ', response.location);

        User.findOne({email: req.body.email})

            .then((user) => {

                if (!user){

                    let password = req.body.password;

                    bcrypt.genSalt(10, function(err, salt){

                        if (err) throw err;

                        bcrypt.hash(password, salt, function(err, hash){

                            if (err) throw err;


                            User.create({

                                firstName: req.body.firstName,

                                lastName: req.body.lastName,

                                email: req.body.email,

                                password: hash,

                                skills: req.body.skills,

                                gender: req.body.gender,

                                age: req.body.age,

                                myLocation: [response.location.lng, response.location.lat],

                                city: req.body.city,

                                country: req.body.country,

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





                                })




                        })





                    })







                }




            })




       ///res.send(response.location);





    });










});

module.exports = router;
