var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const session = require('express-session')
const userRouter = require('./routes/user.route');
const friendRouter = require('./routes/friend.route');
const homeRouter = require('./routes/home.route');
const chatRouter = require('./routes/chat.route');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'somesecret',
  cookie: { maxAge: 60000 }
}));


app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

userRouter(app)
friendRouter(app)
homeRouter(app)
chatRouter(app)

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
