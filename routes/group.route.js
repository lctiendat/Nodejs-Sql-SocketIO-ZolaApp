var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const groupValidator = require('../validator/group.validator');
const groupController = require('../controllers/group.controller')
const path = require('path')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

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

    /**
     * Gửi tin nhắn hình ảnh
     */
    app.post('/group/send-image', upload.single('file'), urlencodedParser, groupController.saveMsgImage)

    /**
     * Gửi tin nhắn kèm file
     */
    app.post('/group/send-file', upload.single('file'), urlencodedParser, groupController.saveMsgFile)

    /**
     * Lấy danh sách bạn bè không có trong nhóm chat
     */
    app.post('/group/get-friend-not-in-group', urlencodedParser, groupController.getListFriendNotInGroup)

    /**
     * Thêm bạn bè vào nhóm chat
     */
    app.post('/group/add-friend-to-group', urlencodedParser, groupValidator.addFriendToGroup(), groupController.addFriendToGroup)

    /**
     * Lấy chủ nhóm chat
     */
    app.post('/group/get-owner-group', urlencodedParser, groupController.getGroupOwner)

    /**
     * Thay đỏi tên nhóm chat
     */
    app.post('/group/change-group-name', urlencodedParser, groupController.changeGroupName)

    /**
     * Lấy tất cả thành viên trong nhóm chat
     */
    app.post('/group/get-member', urlencodedParser, groupController.getAllMembersInGroup)

    /**
     * Xóa thành viên khỏi nhóm chat
     */
    app.post('/group/remove-member', urlencodedParser, groupController.removeMemberInGroup)

    /**
     * Rời khỏi nhóm chat
     */
    app.post('/group/leave-group', urlencodedParser, groupController.leaveGroup)

    /**
     * Thu hồi tin nhắn
     */
    app.post('/group/recall-msg', urlencodedParser, groupController.recallMsg)
}