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

router.get('/inbox', authentication.verifyOrdinaryUser, (req, res) => {


    User.findOne({username: req.decoded.username, creationDate: req.decoded}).then((user) => {


        res.json(user.conversationHistories);


    })


});

router.get('/:userId', authentication.verifyOrdinaryUser, (req, res) => {

    User.findOne({username: req.decoded.username, creationDate: req.decoded.creationDate})

        .then(self => {

            let verifyIfConversationExists = () => {


                return new Promise((resolve, reject) => {

                    let doesExist = undefined;

                    let selfList = self.conversationHistories;

                    let conversationList = [];

                    console.log('selfList is....' + selfList);

                    for (var l = 0; l < selfList.length; l++) {

                        if (selfList[l].respondentId === req.params.userId) {

                            conversationList.push(self.conversationHistories[l]);
                            doesExist = true;
                            break;

                        }

                    }

                    if ((l === self.conversationHistories.length) && conversationList.length === 0) {

                        resolve(conversationList)

                    }
                    else if (doesExist === true && conversationList.length > 0) {

                        resolve(conversationList)

                    }


                    // let conversationList = self.conversationHistories.map(function(obj){
                    //
                    //     if (obj.respondentId === req.params.userId) {
                    //
                    //                 return obj;
                    //
                    //             }
                    //
                    // });

                    // let conversationList = self.conversationHistories.filter(function (obj) {
                    //     if (obj.respondentId === req.params.userId) {
                    //
                    //         return obj;
                    //
                    //     }
                    // });

                    /*console.log('conversationList is....' + conversationList.le);

                    if (conversationList.length === 0) {

                        doesExist = false

                    }
                    else if (conversationList.length === 1) {

                        doesExist = true

                    }

                    if (doesExist !== undefined && conversationList !== undefined) {

                        resolve(conversationList);

                    }
                    else {

                        reject("verifyIfConvoExist did not run succesfully");

                    }*/


                    // for (let i = 0; i < conversationList.length; i++){
                    //
                    //     if (conversationList[i].respondentId === req.params.userId){
                    //         respondedObj = conversationList[i];
                    //         doesExist = true;
                    //         break;
                    //
                    //
                    //     }
                    //
                    //
                    //
                    // }
                    //
                    // if ()


                })


            };

            verifyIfConversationExists().then((conversationList) => {

                console.log('then callback,  conversationList is...' + conversationList);

                if (conversationList.length === 0) {

                    User.findById(req.params.userId).then(other => {

                        let selfCD = self.creationDate;

                        let otherCD = other.creationDate;

                        let conversationCD = (selfCD + otherCD) % 12;

                        let currentDate = moment().format('LL');

                        let now = moment().format('LTS');

                        let selfId = String(self._id);

                        let otherId = String(other._id);

                        let usersNamesArray = [self.username, other.username].sort();

                        let conversationData = [];

                        let selfObj = {

                            creationDate: selfCD,

                            userId: selfId,

                            username: self.username,

                            profilePic: self.profilePic

                        };

                        let otherObj = {
                            creationDate: otherCD,

                            userId: otherId,

                            username: other.username,

                            profilePic: other.profilePic


                        };

                        conversationData.push(selfObj);

                        conversationData.push(otherObj);

                        conversationData = alphaOrder(conversationData);

                        Conversation.create({


                            conversationCD: conversationCD,

                            participants: conversationData,

                            usersNames: usersNamesArray


                        }).then((newConversation) => {

                            let newEntryForSelf = {

                                conversationId: String(newConversation._id),

                                respondentId: String(other._id),

                                respondentCD: otherCD,

                                latestMessage: '',

                                timeSent: now,

                                dateSent: currentDate

                            };

                            let newEntryForOther = {

                                conversationId: String(newConversation._id),

                                respondentId: String(self._id),

                                respondentCD: selfCD,

                                latestMessage: '',

                                timeSent: now,

                                dateSent: currentDate


                            };

                            let newSelf = self.conversationHistories;

                            if (newSelf.length === 0) {

                                newSelf.push(newEntryForSelf)
                            }
                            else {

                                for (let l = 0; l < newSelf.length; l++) {

                                    if (newSelf[l].respondentId === String(other._id)) {

                                        newSelf[l] = newEntryForSelf

                                    }

                                }
                            }

                            let newOther = other.conversationHistories;

                            if (newOther.length === 0) {

                                newOther.push(newEntryForOther)

                            }
                            else {


                                for (let l = 0; newOther.length; l++) {

                                    if (newOther[l].respondentId === String(self._id)) {

                                        newOther[l] = newEntryForOther
                                    }

                                }
                            }


                            self.set('conversationHistories', newSelf);

                            self.save();

                            other.set('conversationHistories', newOther);

                            other.save();

                            res.json(newConversation);


                        })


                    })


                }
                else if (conversationList.length === 1) {

                    console.log('else if runs');


                    res.json(conversationList)


                }


            })

        })


});


router.post('/:userId', authentication.verifyOrdinaryUser, (req, res) => {


    /* In the client I will have already have the conversationHistories by then which means I have


        the conversationId

        the participants





     */

    console.log('req.decoded.username is...' + req.decoded.username);


    User.findOne({username: req.decoded.username, creationDate: req.decoded.creationDate}).then(self => {

        User.findById(req.params.userId).then(other => {

            let selfBlockedList = self.blockedBy;

            let otherBlockedByList = other.blockedUsers;

            if ((selfBlockedList.indexOf(String(other._id)) === -1) && (otherBlockedByList.indexOf(String(self._id)) === -1)) {

                let currentDate = moment().format('LL');

                let now = moment().format('LTS');

                let conversationList = self.conversationHistories.map(function (obj) {

                    if (obj.respondentId === String(req.params.userId)) {

                        return obj

                    }

                });

                console.log('conversationList is...' + conversationList);


                let convoObj = conversationList[0].conversationId;

                console.log('convoObj is...' + convoObj);

                Conversation.findById(convoObj).then(Obj => {

                    Message.create({

                        conversationId: String(Obj._id),

                        conversationCD: Obj.conversationCD,

                        participants: Obj.participants,

                        sentBy: self._id,

                        sentTo: other._id,

                        messageSent: req.body.message,

                        sentAt: now,

                        dateOfMessage: currentDate

                    }).then((message) => {

                        console.log('message is...' + message);

                        res.json(message.conversationId);

                    });


                });


            }


        });


    });


});


module.exports = router;