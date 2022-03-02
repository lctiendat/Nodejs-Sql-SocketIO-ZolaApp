var { check, validationResult } = require('express-validator')

function signup() {
    return [
        check('email', 'Email không được để trống').not().isEmpty(),
        check('email', 'Email không đúng định dạng').isEmail(),
        check('password', 'Mật khẩu không được để trống').not().isEmpty(),
        check('name', 'Tên không được để trống').not().isEmpty(),
    ]
}

function signin() {
    return [
        check('email', 'Email không được để trống').not().isEmpty(),
        check('email', 'Email không đúng định dạng').isEmail(),
        check('password', 'Mật khẩu không được để trống').not().isEmpty(),
    ]
}

function changeinfor() {
    return [
        check('name', 'Tên không được để trống').not().isEmpty(),
        check('signature', 'Chữ ký không được để trống').not().isEmpty(),
        check('birthday', 'Vui lòng chọn ngày sinh').not().isEmpty(),
    ]
}

function forget() {
    return [
        check('email', 'Email không được để trống').not().isEmpty(),
        check('email', 'Email không đúng định dạng').isEmail(),
    ]
}
module.exports = {
    signup,
    signin,
    changeinfor,
    forget
}