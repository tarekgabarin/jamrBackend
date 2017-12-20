const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');

router.get('/:email', (req, res) => {


    User.findOne({email: String(req.params.email)}).then(email => {

        if (!email) {

            res.send('EMAIL_TAKEN');

        }
        else {

            res.send('EMAIL_AVAILABLE');



        }

    })
        .catch(err => {

            if (err) throw err;

        })


});

module.exports = router;