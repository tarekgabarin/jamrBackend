const passport = require('passport');
const User = require('../models/user');
const config = require('../config/config.js');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');





let jwtOptions = {

    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secretKey

};





passport.use('jwtAuth', new JwtStrategy(jwtOptions, function(payload, done){

    User.findById(payload.sub, (err, user) => {

        if (err) return done(err, false);


        if (!user){
            done(null, false)
        }
        else{
            done(null, user)
        }
    });


}));


passport.use('localLogin', new LocalStrategy({usernameField: 'email'}, function(email, password, done){


    User.findOne({email: email}).then((user) => {
        if (!user || user.isActive !== true){
            return done(null, false, {message: "User is not registered"});
        }
        user.passwordComparison(password, function(err, doesMatch){
            if (err){return done(err)}

            if (doesMatch){
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })


    });

}));


