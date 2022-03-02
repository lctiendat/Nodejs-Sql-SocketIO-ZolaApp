const userController = require('../controllers/user.controller');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const userValidator = require('../validator/user.validator');
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

    app.post('/forget', urlencodedParser, userValidator.forget(), userController.forget)
}