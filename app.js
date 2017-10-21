const express = require('express');
const passport = require('passport');
const http = require('http');
const morgan = require('morgan');
const LocalStrategy = require('passport-local').Strategy;
let path = require('path');
let mongoose = require('mongoose');
let config = require('./config/config');
let bodyParser = require('body-parser');

const messageRouter = require('./routes/messageRouter');

const registerRouter = require('./routes/registerRouter');

const loginRouter = require('./routes/loginRouter');

const findUsersRouter = require('./routes/findUsersRouter');

let cors = require('cors');

const app = express();

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

app.use('/register', registerRouter);

app.use('/login', loginRouter);

app.use('/find', findUsersRouter);



const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);