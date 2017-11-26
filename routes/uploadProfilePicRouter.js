const bcrypt = require('bcryptjs');
const authentication = require('../controllers/authentication');
const express = require('express');
const passport = require('passport');
const passportService = require('../services/passport');


const config = require('../config/config.js');

const axios = require('axios');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = Promise;

const fs = require('fs');

const AWS = require('aws-sdk');

const generateToken = require('../controllers/generateToken');

const multer = require('multer');

const multerS3 = require('multer-s3');


AWS.config.update({

    accessKeyId: process.env.API_KEY,

    secretAccessKey: process.env.SECRET_API_KEY,

    region: "ca-central-1"




});
const s3 = new AWS.S3();




let upload = multer({

    storage: multerS3({

        s3: s3,

        bucket: "jammr-app-bucket",

        acl: 'public-read',

        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString()); //use Date.now() for unique file keys
        }
    })

});


const User = require('../models/user');

router.put('/', authentication.verifyOrdinaryUser, upload.single('file'), (req, res) => {

    User.findOneAndUpdate({username: req.decoded.username, creationDate: req.decoded.creationDate},

        { $set: {

            profilePic: String(req.file.location)

        }},

        {new: true}

    ).then(user => {

        res.json(user)

    })

        .catch(err => {

            console.log(err);

        })

});

module.exports = router;
