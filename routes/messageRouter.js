const authentication = require('../controllers/authentication');
const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../models/user');
const Conversation = require('../models/conversation');

const Message = require('../models/message');

const moment = require('moment');


function alphaOrder(arr) {

    //// rearranges the order of objects in array by alphabetical order


    return arr.sort((a, b) => {

        return a.username.toLowerCase().localeCompare(b.username.toLowerCase())

    });

}


router.post('/:username', authentication.verifyOrdinaryUser, (req, res, next) => {

    /// TODO I need to make sure that two messages have the same conversationId and that two conversationIds are not created

    User.findOne({username: req.decoded.username, creationDate: req.decoded.creationDate}).then((self) => {


        User.findOne({username: req.params.username}).then((other) => {

            let selfCD = self.creationDate;

            let otherCD = other.creationDate;

            let selfId = String(self._id);

            let otherId = String(other._id);

            let conversationCD = (selfCD + otherCD) % 12;

            let currentDate = moment().format('LL');

            let conversationData = [];

            let selfObj = {

                creationDate: selfCD,

                userId: selfId,

                username: self.username

            };

            let otherObj = {
                creationDate: otherCD,

                userId: otherId,

                username: other.username


            };

            conversationData.push(selfObj);

            conversationData.push(otherObj);

            let usersNamesArray = [self.username, other.username].sort();

            conversationData = alphaOrder(conversationData);

            console.log('conversationData is..' + conversationData);

            Conversation.findOne({
                //  participants: conversationData,
                usersNames: usersNamesArray,
                conversationCD: conversationCD
            }).then((conversation) => {


                if (!conversation) {


                    Conversation.create({


                        conversationCD: conversationCD,

                        participants: conversationData,

                        usersNames: usersNamesArray


                    })

                        .then((newConversation) => {

                            let now = moment().format('LTS');

                            Message.create({

                                conversationId: newConversation._id,

                                conversationCD: conversationCD,

                                participants: conversationData,

                                sentBy: self._id,

                                sentTo: other._id,

                                messageSent: req.body.message,

                                sentAt: now,

                                dateOfMessage: currentDate

                            }).then((message) => {


                                let newEntryForSelf = {

                                    conversationId: message.conversationId,

                                    respondentId: other._id,

                                    respondentCD: otherCD,

                                    latestMessage: message.messageSent,

                                    timeSent: now,

                                    dateSent: currentDate

                                };

                                let newEntryForOther = {

                                    conversationId: message.conversationId,

                                    respondentId: self._id,

                                    respondentCD: selfCD,

                                    latestMessage: message.messageSent,

                                    timeSent: now,

                                    dateSent: currentDate


                                };

                                self.conversationHistories.push(newEntryForSelf);

                                self.save();

                                other.conversationHistories.push(newEntryForOther);

                                other.save();

                                res.json(message);


                            })


                        })


                }

                else {

                    let now = moment().format('LTS');

                    Message.create({

                        conversationId: conversation._id,

                        conversationCD: conversationCD,

                        participants: conversationData,

                        sentBy: self._id,

                        sentTo: other._id,

                        messageSent: req.body.message,

                        sentAt: now,

                        dateOfMessage: currentDate

                    }).then((message) => {

                        // self.update({'conversationId': message.conversationId}, {
                        //
                        //
                        //     '$set': {
                        //
                        //
                        //         'conversationHistories.$.timeSent': now,
                        //
                        //         'conversationHistories.$.dateSent': currentDate,
                        //
                        //         'conversationHistories.$.latestMessage': String(req.body.message)
                        //
                        //
                        //     }
                        //
                        //
                        // });


                        /// TODO why the F*&$# isn't this working? Deal with this bullshit later


                        User.update({'conversationHistories.conversationId': message.conversationId}, {


                            $set: {


                                'conversationHistories.$.timeSent': now,

                                'conversationHistories.$.dateSent': currentDate,

                                'conversationHistories.$.latestMessage': String(req.body.message)


                            }


                        });

                        ///    User.save();

                        ///      self.save();

                        // other.update({'conversationHistories.conversationId': message.conversationId}, {
                        //
                        //
                        //     '$set': {
                        //
                        //
                        //         'conversationHistories.$.timeSent': now,
                        //
                        //         'conversationHistories.$.dateSent': currentDate,
                        //
                        //         'conversationHistories.$.latestMessage': String(req.body.message)
                        //
                        //
                        //     }
                        //
                        //
                        // });
                        //
                        // other.save();

                        res.json(message);


                    })


                }


            })


        })


    });


});

router.get('/:username', authentication.verifyOrdinaryUser, (req, res, next) => {

    User.findById(req.decoded.id).then((self) => {

        User.findOne({username: req.params.username}).then((other) => {

            let checkConversationHistory = () => {



                let conversationCD = (self.creationDate + other.creationDate) % 12


                let dataObj = {};

                return new Promise((resolve, reject) => {


                    for (let i = 0; i < self.conversationHistories.length; i++) {

                        if (self.conversationHistories[i].respondentId === String(other._id)) {
                            dataObj.conversationId = self.conversationHistories[i].conversationId;
                            dataObj.conversationCD = conversationCD;
                            resolve(dataObj);

                        }


                    }


                })

            };

            checkConversationHistory().then((dataObj) => {


                Message.find({conversationId: dataObj.conversationId, conversationCD: dataObj.conversationCD})

                    .then((messages) => {

                    

                        res.json(messages);

                    })


            });

        });


    });

});


module.exports = router;