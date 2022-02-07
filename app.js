var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const userController = require('./controllers/user.controller');
const homeController = require('./controllers/home.controller')
const friendController = require('./controllers/friend.controller')
const passport = require('passport');
const cookieSession = require('cookie-session')



var app = express();

app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({ secret: 'session', saveUninitialized: true, resave: true }));
//app.use(express.static('assets'));
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
userController(app);
homeController(app)
friendController(app)

app.use(function (req, res, next) {
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;