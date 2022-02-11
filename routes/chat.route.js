var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const chatController = require('../controllers/chat.controller');


module.exports = (app) => {
    /**
     * Lấy tin nhắn với bạn bè
     */
    app.post('/chat/friend',urlencodedParser, chatController.getFriendMessage)
}