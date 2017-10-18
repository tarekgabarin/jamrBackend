const express = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let conversationSchema = new Schema({

    participants: [{

        creationDate: {
            type: Number
        },

        userId: {
            type: String

        },

        firstName: {
            type: String

        },

        lastName: {
            type: String

        }

        }],

    text: {

    }








})