const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');


router.get('/', authentication.verifyOrdinaryUser, (req, res, next) => {

    console.log('req.decoded is...' + req.decoded);

    User.findOne({_id: req.decoded.id, creationDate: req.decoded.creationDate}).then((self) => {

        let ultimateIgnoreList = self.notInterested.concat(self.blockedUsers);



        User.find({

            loc: {

                $nearSphere: {

                    $geometry: {


                        type: "Point",

                        coordinates: req.decoded.loc.coordinates


                    },

                    $maxDistance: 100000


                },


            },

            username: {

                $ne: req.decoded.username

            },

            _id: {

                $nin: ultimateIgnoreList
            }


        }).then((users) => {


            res.json(users);


        })


    })


});

//// This is for the user to view another users profile


module.exports = router;