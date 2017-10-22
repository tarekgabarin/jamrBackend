/// TODO For this look up the $nin operator and make sure that User model has the notInterestedArray

const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');

router.post('/:userId', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findOne({_id: req.decoded.id, creationDate: req.decoded.creationDate}).then((self) => {

        self.notInterested.addToSet(req.params.userId);

        self.save();


    })

});

module.exports = router;