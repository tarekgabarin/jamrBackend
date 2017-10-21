const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const authentication = require('../controllers/authentication');
const User = require('../models/user');
mongoose.Promise = Promise;

router.get('/:userId', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findById(req.params.userId).then((user) => {

        res.send(user);

    })

});

module.exports = router;