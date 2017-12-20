const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');

router.get('/:email', (req, res) => {


    User.findOne({email: req.params.email}).then(email => {

        if (email){

            res.json('EMAIL_TAKEN')

        }
        else if (!email) {

            res.json('EMAIL_AVAILABLE')
        }



    })


});

module.exports = router;