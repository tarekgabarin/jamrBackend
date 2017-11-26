/// TODO For this look up the $nin operator and make sure that User model has the notInterestedArray

const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');

router.put('/:userId', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findOne({_id: req.decoded.id, creationDate: req.decoded.creationDate}).then((self) => {

        self.notInterested.addToSet(req.params.userId);

        self.save().then(() => {

            let ultimateIgnoreList = self.notInterested.concat(self.blockedUsers);

            let radianDistance = self.discoveryPreferences.miles / 3963.2;

            console.log('radianDistance is...' + radianDistance);

            User.find({

                _id: {

                    $nin: ultimateIgnoreList

                },

                age: {

                    $gte: self.discoveryPreferences.lowestAge,

                    $lte: self.discoveryPreferences.highestAge


                },

                loc: {

                    $nearSphere: {

                        $geometry: {


                            type: "Point",

                            coordinates: req.decoded.loc.coordinates,

                            $maxDistance: radianDistance


                        },


                    },


                },

                skills: {

                    $in: [self.imLookingFor]


                },

                gender: {

                    $in: self.discoveryPreferences.gender
                },

                iWantToMake: {

                    $in: self.iWantToMake

                }


            }).then((users) => {

                res.json(users)

            });


        });


    });

});

module.exports = router;