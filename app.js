var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session')
const passport = require('passport');
const userRouter = require('./routes/user.route');
const friendRouter = require('./routes/friend.route');
const homeRouter = require('./routes/home.route');
var app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io')
const io = new Server(server);

io.on('connection', (socket) =>{
    console.log('co nguoi ket noi');
})

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
app.use(passport.initialize());
app.use(passport.session());
//app.use(isAuth)

userRouter(app)
friendRouter(app)
homeRouter(app)
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
