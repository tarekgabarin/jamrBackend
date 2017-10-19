const bcrypt = require('bcryptjs');
const authentication = require('../controllers/authentication');
const express = require('express');
const passport = require('passport');
const passportService =require('../services/passport');
const config = require('../config/config');

const axios = require('axios');

const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
mongoose.Promise = Promise;

const generateToken = require('../controllers/generateToken');



router.post('/', passport.authenticate('localLogin', {session: false}), (req, res, err) => {

    if (err) console.log(err);

    let userToken = generateToken.generateUserToken(req.user);

    console.log('req.user is...' + req.user);

    res.header('x-auth', userToken).send(userToken);



});

module.exports = router;