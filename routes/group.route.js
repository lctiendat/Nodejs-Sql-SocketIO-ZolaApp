var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const groupValidator = require('../validator/group.validator');
const groupController = require('../controllers/group.controller')
module.exports = (app) => {

    /**
     * Tạo nhóm chat
     */
    app.post('/group/create', urlencodedParser, groupValidator.creatGroup(), groupController.createGroup)
}