var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const groupValidator = require('../validator/group.validator');
const groupController = require('../controllers/group.controller')
module.exports = (app) => {

    /**
     * Tạo nhóm chat
     */
    app.post('/group/create', urlencodedParser, groupValidator.creatGroup(), groupController.createGroup)

    /**
     * Lấy tất cả tin nhắn trong mọt nhóm chat
     */
    app.post('/group/get-message', urlencodedParser, groupController.getMsgInGroup)

    /**
     * Lưu tin nhắn dạng text
     */
    app.post('/group/send-message', urlencodedParser, groupController.saveMsgText)
}