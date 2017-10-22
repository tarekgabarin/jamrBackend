/// TODO use the $in operator for this one and make sure there is a checkOutLater array in the user model

const User = require('../models/user');

const express = require('express');
const passport = require('passport');

const authentication = require('../controllers/authentication');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');

router.post('/:userId', authentication.verifyOrdinaryUser, (req, res, next) => {

   User.findOne({_id: req.decoded.id, creationDate: req.decoded.creationDate}).then((self) => {

       User.findOne({_id: req.params.userId}).then((other) => {

           self.checkOutLater.addToSet({id: other._id, creationDate: other.creationDate});

           self.save();

           res.send(self);

       })

   })

});

module.exports = router;