var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const userRouter = require('./routes/user.route');
const friendRouter = require('./routes/friend.route');
const homeRouter = require('./routes/home.route');
const chatRouter = require('./routes/chat.route');

process.env.TZ = "Asia/Ho_Chi_Minh";

console.log(Date(Date.now()));

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'somesecret',
  cookie: { expires : Date.now() + (30 * 86400 * 1000) },
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
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

app.use((req, res, next) => {

})

module.exports = app;
