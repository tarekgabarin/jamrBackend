const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');


router.post('/', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.find({

        loc: {

            $nearSphere: {

                $geometry: {


                    type: "Point",

                    coordinates: req.decoded.loc.coordinates


                }


            }


        },

        skills: {

            $in: [req.body.skill]


        },

        username: {

            $ne: req.decoded.username

        }


    }).then((users) => {

        res.json(users)

    })
});

module.exports = router;