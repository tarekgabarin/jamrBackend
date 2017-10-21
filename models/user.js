const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');





const Schema = mongoose.Schema;


let User = new Schema({


    firstName: {

        type: String,
        required: true
    },

    lastName: {

        type: String,
        required: true

    },

    gender: {

        type: String,
        required: true


    },

    username: {

        type: String,

        default: 'BLANK'


    },


    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },

            message: `{value} is not a valid email address.`
        }
    },

    password: {

        type: String,
        required: true

    },

    age: {

        type: Number,
        required: true

    },



    skills: {
        type: Array
    },

    profilePic: {

        type: String,
        default: 'BLANK'

    },

    loc: {

        type: {
            type: String,
            default: 'Point'

        },

        coordinates: [Number]




    },


    conversationHistories: [{

        conversationId: {

            type: String,
            required: true

        },

        respondentId: {

            type: String,
            required: true

        },

        respondentCD: {

            type: Number,

            required: true

        },

        latestMessage: {

          type: String,
          required: true
        },

        timeSent: {

            type: String,
            required: true

        },

        dateSent: {

            type: String,

            required: true

        }


    }],

    deviantArtLink: {

        type: String,
        default: 'BLANK'
    },

    soundCloudLink: {

        type: String,
        default: 'BLANK'

    },

    youTubeLink: {

        type: String,
        default: 'BLANK'

    },

    itchIO: {

      type: String,
      default: 'BLANK'

    },

    gitHubLink: {

        type: String,
        default: 'BLANK'

    },

    imLookingFor: {

        type: Array

    },



    isActive: {

        type: Boolean,
        default: true

    },

    creationDate: {
        type: Number,
        default: function(){

            return Math.floor(Math.random() * 11);

        },
        index: true
    },

    // usersFaves: [{
    //
    //     gameTitle: {
    //         type: String,
    //         required: true
    //     },
    //
    //     boxArt: {
    //
    //         type: String,
    //         required: true
    //
    //
    //     }
    //
    //
    // }],


    iWantToMake: {

        type: String,
        required: true


    },



    street: {

        type: String,
        required: true


    },

    city: {

        type: String,
        required: true

    },

    country: {

        type: String,
        required: true

    },

    provinceState: {

        type: String,
        required: true


    }

});

////User.index({ "loc": "2dsphere" });

User.methods.passwordComparison = function(candidate, callback){
    bcrypt.compare(candidate, this.password, function(err, doesMatch){
        if (err) {return callback(err)}
        callback(null, doesMatch);
    })
};


let options = ({missingPasswordError: "Incorrect password, try again"});

User.plugin(passportLocalMongoose, options);

User = mongoose.model('User', User);

module.exports = User;

