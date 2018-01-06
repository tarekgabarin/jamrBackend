const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');

const authentication = require('../controllers/authentication');

router.get('/', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findOne({username: req.decoded.username, creationDate: req.decoded.creationDate})

        .then(user => {

            res.json(user.profilePic)


        })

        .catch(err => {

            if (err) console.log(err)

        })

});

module.exports = router;