const jwt = require('jsonwebtoken');

const config = require('../config/config');

exports.generateUserToken = function (user){


    return jwt.sign({id: user._id, loc: user.loc, creationDate: user.creationDate, username: user.username, profilePic: user.profilePic}, config.secretKey);



};