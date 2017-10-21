const express = require('express');
const mongoose = require('mongoose');
////const messageSchema = require('../models/message');

const Schema = mongoose.Schema;

let conversationSchema = new Schema({


    dateOfConversation: {

        type: String,


    },

    conversationCD: {

        type: Number

    },

    participants: [{

        creationDate: {
            type: Number
        },

        userId: {
            type: String

        },

        username: {

            type: String,

        }

    }],

    usersNames: {
        type: Array

    }


});

let Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;