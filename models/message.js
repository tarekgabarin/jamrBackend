const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let messageSchema  = new Schema();


messageSchema.add({

    sentBy: {
        type: String

    },



    messageSent: {

        type: String

    },

    sentAt: {

        type: String,
        default: new Date()
    }





});