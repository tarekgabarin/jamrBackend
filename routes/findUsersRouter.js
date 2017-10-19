const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');


router.get('/', authentication.verifyOrdinaryUser, (req, res, next) => {


    ///TODO This works but you don't want the user to also get himelf/herself in the queries

    console.log('req.decoded is...' + req.decoded);


    User.find({

        loc: {

            $nearSphere: {

                $geometry: {


                    type: "Point",

                    coordinates: req.decoded.loc.coordinates


                }


            }


        }


    }).then((users) => {


        res.json(users);


    })


});

module.exports = router;