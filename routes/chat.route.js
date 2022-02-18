var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const chatController = require('../controllers/chat.controller');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads' )
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
    app.post('/chat/friend',urlencodedParser, chatController.getFriendMessage)

    /**
     * Lưu tin nhắn
     */
    app.post('/chat/save',urlencodedParser, upload.single('file'),chatController.saveMessage)
}