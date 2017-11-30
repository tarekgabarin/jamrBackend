const express = require('express');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const LocalStrategy = require('passport-local').Strategy;
let path = require('path');
let mongoose = require('mongoose');
let config = require('./config/config');
let bodyParser = require('body-parser');


let cors = require('cors');

const app = express();


const messageRouter = require('./routes/messageRouter');

const blockUserRouter = require('./routes/blockUserRouter');

const unblockRouter = require('./routes/unblockRouter');

const viewUserRouter = require('./routes/viewUserRouter');

const findSkillRouter = require('./routes/findSkillRouter');

const loginRouter = require('./routes/loginRouter');

const uploadProfilePicRouter = require('./routes/uploadProfilePicRouter');

const registerRouter = require('./routes/registerRouter');

const findUsersRouter = require('./routes/findUsersRouter');

const notInterestedRouter = require('./routes/notInterestedRouter');

const checkOutLaterRouter = require('./routes/checkOutLaterRouter');

const checkOutSavedRouter = require('./routes/checkOutSavedRouter');

const setDiscoveryPreferences = require('./routes/setDiscoveryPreferences');

const discoverRouter = require('./routes/discoveryRouter');

const updateInfoRouter = require('./routes/updateInfoRouter');

const getMyInfo = require('./routes/getMyInfo');

const demoFindAll = require('./routes/demoFindAll');





mongoose.connect(config.mongoUrl);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");
});

app.use(morgan('combined'));

app.use(cors());

app.options('*', cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

app.use('/message', messageRouter);

app.use('/block', blockUserRouter);

app.use('/unblock', unblockRouter);

app.use('/findBySkill', findSkillRouter);

app.use('/notInterested', notInterestedRouter);

app.use('/upload', uploadProfilePicRouter);

app.use('/update', updateInfoRouter);

app.use('/user', viewUserRouter);

app.use('/checkOutLater', checkOutLaterRouter);

app.use('/checkOutSaved', checkOutSavedRouter);

app.use('/setPreferences', setDiscoveryPreferences);

app.use('/discover', discoverRouter);

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.use('/find', findUsersRouter);

app.use('/demoFind', demoFindAll);

app.use('/getMyInfo', getMyInfo);




const port = process.env.PORT || 8080;
const server = http.Server(app);
server.listen(port);

let io = require('socket.io')(server);

const Message = require('./models/message');

io.on('connection', function (socket) {

    socket.on('message', function(conversationId){

            console.log('message event recieved by socket ', conversationId );


        setInterval(function() {

            Message.find({conversationId: conversationId}).then(messages => {

                console.log('sending messages on the backend', messages);

                socket.emit('serverMessages', messages);

            });


        }, 100);


            // Message.find({conversationId: conversationId}).then(messages => {
            //
            //     console.log('sending messages on the backend', messages);
            //
            //     socket.emit('serverMessages', messages);
            //
            // });


    });

});
