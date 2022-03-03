const userController = require('../controllers/user.controller');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const userValidator = require('../validator/user.validator');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleConfig = require('../config/google.config')
const userCpm = require('../components/user.component');
const appCpm = require('../components/app.component');
const serverConfig = require('../config/server.config');
const facebookConfig = require('../config/facebook.config')
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

/**
 * Config Login Google
 */
passport.use(new GoogleStrategy({
    clientID: googleConfig.googleClientID,
    clientSecret: googleConfig.googleClientSecret,
    callbackURL: googleConfig.callbackURL
}, (accessToken, refreshToken, profile, done) => {
    userCpm.checkEmail(profile.emails[0].value).then(isExisted => {
        if (isExisted) {
            return done(null, profile);
        }
        let data = [{
            name: profile.displayName,
            email: profile.emails[0].value,
            password: '',
            token: serverConfig.getToken(),
            created: serverConfig.getCurrenTime(),
            modified: serverConfig.getCurrenTime()
        }];
        appCpm.save('users', data).then(resultInsert => {
            return done(null, profile);
        });
    })
}))

/**
 * Config Login Facebook
 */
passport.use(new FacebookStrategy({
    clientID: facebookConfig.FACEBOOK_APP_ID,
    clientSecret: facebookConfig.FACEBOOK_APP_SECRET,
    callbackURL: facebookConfig.callbackURL
}, (accessToken, refreshToken, profile, done) => {

    userCpm.checkEmail(`${profile.id}@facebook.com`).then(isExisted => {
        if (isExisted) {
            return done(null, profile);
        }
        let data = [{
            name: profile.displayName,
            email: `${profile.id}@facebook.com`,
            password: '',
            token: serverConfig.getToken(),
            created: serverConfig.getCurrenTime(),
            modified: serverConfig.getCurrenTime()
        }];
        appCpm.save('users', data).then(resultInsert => {
            return done(null, profile);
        });
    })

}))

module.exports = (app) => {

    /**
     * Đăng ký
     */
    app.get('/signup', (req, res) => {
        res.render('user/signup');
    });
    app.post('/signup', urlencodedParser, userValidator.signup(), userController.signup)

    /**
    * Đăng nhập
    */
    app.get('/signin', (req, res) => {
        res.render('user/signin');
    })
    app.post('/signin', urlencodedParser, userValidator.signin(), userController.signin)

    /**
     * Đăng xuất
     */
    app.get('/signout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    })

    /**
     * Lấy thông tin người dùng
     */
    app.post('/user/getinfor', urlencodedParser, userController.getInforUser)

    /**
     * Thay đổi thông tin người dùng
     */
    app.post('/user/changeinfor', urlencodedParser, userValidator.changeinfor(), userController.updateInforUser)

    /**
     * Quên mật khẩu
     */
    app.get('/forget', (req, res) => {
        res.render('user/forget');
    })

    app.post('/forget', urlencodedParser, userController.forget)

    /**
     * Đăng nhập bằng Google
     */
    app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/google/callback', passport.authenticate('google'), (req, res) => {
        req.session.User = {
            email: req.user.emails[0].value
        }
        res.redirect('/');
    })

    /**
     * Đăng nhập bằng Facebook
     */
    app.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

    app.get('/facebook/callback', passport.authenticate('facebook'), (req, res) => {
        req.session.User = {
            email: `${req.user.id}@facebook.com`
        }
        res.redirect('/');
    })
}