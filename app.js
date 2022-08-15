var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');

// ADDED:
const session = require('express-session');
const FileStore = require('session-file-store')(session); //The require function is returning another function as it's return value. Then we are immediately calling the return function with (session)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');

// ---
const mongoose = require('mongoose');

// const url = 'mongodb://localhost:27017/nucampsite';
const url = 'mongodb://localhost:27017/blog';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false, //When a new session is created, but no updates are made to it, then at the end of the request it won’t get saved, because it would be just an empty session without any useful information. So this helps prevent having a ton of empty cookies set up for no reason.
    resave: false,
    store: new FileStore() //This will create a new FileStore that will save our session information to the server’s hard disk, instead of just in the running application’s memory.
}));

//We had to move usersRouter up becuase we want clients to be able to access it to create an account before trying to log in. 
//We are now directing logged out users to the index page, so we need both of these above the auth function:
app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
    console.log(req.session);

    if (!req.session.user) {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    } else {
        if (req.session.user === 'authenticated') {
            return next();
        } else {
            const err = new Error('You are not authenticated!');
            err.status = 401;
            return next(err);
        }
    }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/blog', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
