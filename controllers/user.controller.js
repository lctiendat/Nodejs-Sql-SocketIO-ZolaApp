var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const userValidator = require('../validator/user.validator');
var { check, validationResult } = require('express-validator');
const appCpm = require('../components/app.component');
const userCpm = require('../components/user.component');
const md5 = require('md5')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const serverConfig = require('../config/server.config');

passport.use(
    new GoogleStrategy(
        {
            clientID: '892833350306-b76mrg6sm5e61s7lkljv6ui4a9r5ge9k.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/google/callback',
            passReqToCallback: true
        },
        accessToken => {
            // console.log(accessToken);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = (app) => {

    /**
     * Đăng ký
     */
    app.get('/signup', (req, res) => {
        res.render('user/signup');
    });

    app.post('/signup', urlencodedParser, userValidator.signup(), (req, res) => {
        if (req.method == 'POST') {
            const error = validationResult(req);

            if (!error.isEmpty()) {
                return res.json(error.array());
            }
            let email = req.body.email;
            let password = req.body.password;

            userCpm.checkEmail(email).then(isExisted => {
                if (isExisted) {
                    return res.json([{
                        param: 'email',
                        msg: 'Email đã tồn tại trong hệ thống'
                    }]);
                }
                let data = [{
                    email: email,
                    password: md5(password),
                    token: serverConfig.getToken(),
                    created: serverConfig.getCurrenTime(),
                    modified: serverConfig.getCurrenTime()
                }];

                appCpm.save('users', data).then(resultInsert => {
                    return res.json({
                        status: true,
                        msg: 'Đăng ký tài khoản thành công'
                    });
                });
            }).catch(e => {
                console.log(e)
                return res.json({
                    status: false,
                    msg: 'Đăng ký tài khoản thất bại'
                });
            });

        }
    });

    /**
     * Đăng nhập
     */
    app.get('/signin', (req, res) => {
        res.render('user/signin')
    })

    app.post('/signin', urlencodedParser, userValidator.signin(), (req, res) => {
        if (req.method == 'POST') {
            const error = validationResult(req);

            if (!error.isEmpty()) {
                return res.json(error.array());
            }
            let email = req.body.email;
            let password = md5(req.body.password)

            userCpm.checkUser(email, password).then(isExisted => {
                if (isExisted == false) {
                    return res.json({
                        status: false,
                        msg: 'Tài khoản hoặc mật khẩu không chính xác'
                    });
                }
                req.session.sessionEmail = email
                return res.json({
                    status: true,
                    msg: 'Đăng nhập thành công'
                })
            }).catch(e => {
                console.log(e)
                return res.json({
                    status: false,
                    msg: 'Đăng nhập thất bại'
                });
            });
        }
    });

    /**
     * Đăng nhập bằng Google
     */
    app.get('/login/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))

    app.get('/google/callback', passport.authenticate('google', {
        failureRedirect: '/signin',
        successRedirect: '/'
    }));

    /**
     * Lấy thông tin người dùng
     */
    app.post('/user/getinfor', urlencodedParser, (req, res) => {
        if (req.method == 'POST') {
            let email = req.session.sessionEmail;
            userCpm.getUserByEmail(email).then(result => {
                return res.json({
                    status: true,
                    data: result
                });
            }).catch(e => {
                console.log(e)
                return res.json({
                    status: false,
                    msg: 'Lấy thông tin người dùng thất bại'
                });
            });
        }
    })

    /**
     * Thay đổi thông tin người dùng
     */
    app.post('/user/changeinfor', urlencodedParser, userValidator.changeinfor(), (req, res) => {
        if (req.method == 'POST') {
            const error = validationResult(req);

            if (!error.isEmpty()) {
                return res.json(error.array());
            }
            let email = req.session.sessionEmail;
            let name = req.body.name;
            let signature = req.body.signature
            let birthday = req.body.birthday;
            let sex = req.body.sex

            const data = [{
                name: name,
                signature: signature,
                birthday: birthday,
                sex: sex
            }]
            userCpm.updateUser(email, data).then(data => {
                return res.json({
                    status: true,
                    msg: 'Thay đổi thông tin thành công'
                })
            })
        }
    })
};