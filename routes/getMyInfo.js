const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const authentication = require('../controllers/authentication');
const User = require('../models/user');
mongoose.Promise = Promise;


router.get('/', authentication.verifyOrdinaryUser, (req, res) => {

    User.findOne({username: req.decoded.username, creationDate: req.decoded.creationDate}).then(user => {

        res.json(user)

    }).catch(err => {

        console.log(err);

    })


});

module.exports = router;

