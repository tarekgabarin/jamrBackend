const jwt = require('jsonwebtoken');

exports.generateUserToken = function (user){


    return jwt.sign({id: user._id, creationDate: user.creationDate, username: user.username, profilePic: user.profilePic}, config.secretKey);



};