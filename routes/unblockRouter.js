const authentication = require('../controllers/authentication');
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');

router.post('/:userId', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findOne({_id: req.decoded.id, creationDate: req.decoded.creationDate}).then((self) => {

        User.findById(req.params.userId).then((other) => {

            self.blockedUsers.pull(String(other._id));

            self.save();

            other.blockedBy.pull(String(self._id));

            other.save();

            res.send('User blocked');


        })


    });


});

module.exports = router;