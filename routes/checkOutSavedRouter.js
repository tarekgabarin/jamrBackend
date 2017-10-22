const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');



router.get('/', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findOne({_id: req.decoded.id, creationDate: req.decoded.creationDate}).then((self) => {

        User.find({_id: {$in: self.checkOutLater}}).then((users) => {

            res.json(users);

        })


    })

});

module.exports = router;
