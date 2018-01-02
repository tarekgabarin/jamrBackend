const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');

router.post('/',  (req, res, next) => {

    User.findOne({email: req.body.email}).then((user) => {

        user.passwordComparison(req.body.password, function(err, doesMatch){
            if (err){return done(err)}

            if (doesMatch){
                res.send('PASSWORD_CORRECT')
            }
            else {
                res.send('PASSWORD_INCORRECT')
            }
        })



    })

});

module.exports = router;