var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const chatController = require('../controllers/chat.controller');
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
     * Lấy tin nhắn với bạn bè
     */
    app.post('/chat/friend', urlencodedParser, chatController.getFriendMessage)

    /**
     * Lưu tin nhắn
     */
    app.post('/chat/save', urlencodedParser, chatController.saveMessage)

    /**
     * Gửi tin nhắn hình ảnh
     */
    app.post('/chat/image', upload.single('file'), urlencodedParser, chatController.sendMsgImg)

    /**
     * Gửi tin nhắn kèm file
     */
    app.post('/chat/file', upload.single('file'), urlencodedParser, chatController.sendMsgFile)
}