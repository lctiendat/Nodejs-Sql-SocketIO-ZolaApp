var { check, validationResult } = require('express-validator')

/**
 * Tạo nhóm
 */
function creatGroup() {
    return [
        check('name', 'Tên nhóm không được để trống').not().isEmpty(),
    ]
}


module.exports = {
    creatGroup
}