const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');

router.put('/', authentication.verifyOrdinaryUser, (req, res, next) => {

    let genderArr;

    if (req.body.gender === "Female") {

        genderArr = ["Female"]

    }
    else if (req.body.gender === "Male") {

        genderArr = ['Male']

    }

    else if (req.body.gender === 'Any') {

        genderArr = ['Male', "Female"]
    }

    User.findOneAndUpdate({_id: req.decoded.id, creationDate: req.decoded.creationDate},

        {

            $set: {

                discoveryPreferences: {

                    lowestAge: req.body.lowestAge,

                    highestAge: req.body.highestAge,

                    gender: genderArr,

                    miles: req.body.miles


                },

                imLookingFor: req.body.imLookingFor,


                iWantToMake: req.body.iWantToMake


            }

        },

        {new: true}
    ).then((self) => {

        res.json(self)


    })


});


module.exports = router;