var { check, validationResult } = require('express-validator')

function searchFriend() {
    return [
        check('email', 'Email không được để trống').not().isEmpty(),
        check('email', 'Email không đúng định dạng').isEmail(),
    ]
}

module.exports = {
    searchFriend
}