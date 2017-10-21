const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let messageSchema  = new Schema();


messageSchema.add({

    conversationId: {

        type: String

    },

    conversationCD: {

        type: Number,
        index: true

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

    sentBy: {
        type: String

    },

    sentTo: {

        type: String

    },

    messageSent: {

        type: String

    },

    sentAt: {

        type: String,
        default: new Date()
    },

    dateOfMessage: {

        type: String

    }





});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;