var { check, validationResult } = require('express-validator')

/**
 * Tạo nhóm
 */
function creatGroup() {
    return [
        check('name', 'Tên nhóm không được để trống').not().isEmpty(),
    ]
}

function addFriendToGroup() {
    return [
        check('listFriend', 'Bạn chưa chọn bạn bè').not().isEmpty(),
    ]
}


module.exports = {
    creatGroup,
    addFriendToGroup
}