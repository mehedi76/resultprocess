var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var multer = require('multer');

var mongoose = require('mongoose');
mongoose.connect('mongodb://rps:12345@ds147995.mlab.com:47995/userstory');//('mongodb://localhost:27017/rps');
require("./models/model.js");

var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
// -------------- for session -------------
app.use(session({
	secret: "any String",
	saveUninitialized: true,
	resave: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// -------------- for passport -------------
app.use(passport.initialize());
app.use(passport.session());
//Initialize passport 
var initPassport = require('./passport-init.js');
initPassport(passport);


app.use('/api', api);
app.use('/auth', authenticate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
