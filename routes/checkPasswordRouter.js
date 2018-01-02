const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');

const bcrypt = require('bcryptjs');

router.post('/',  (req, res, next) => {

    User.findOne({email: req.body.email}).then((user) => {

        bcrypt.compare(req.body.password, user.password, function (err, result) {

            if (err) console.log(err);

            if (result === true){

                res.send('CORRECT_PASSWORD');

            }
            else if (result === false){

                res.send('INCORRECT_PASSWORD');

            }
            
        })



    }).catch(err => {

        if (err) console.log(err);

    })

});

module.exports = router;