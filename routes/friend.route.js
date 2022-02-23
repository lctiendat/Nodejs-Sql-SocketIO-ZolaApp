var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const friendValidator = require('../validator/friend.validator');
const isAuth = require('../middlewares/isAuth.middleware')
const friendController = require('../controllers/friend.controller')
module.exports = (app) => {

    /**
     * Tìm kiếm bạn bè
     */
    app.post('/friend/search', urlencodedParser, friendValidator.searchFriend(), friendController.searchFriend)

    /**
     * Thêm bạn bè
     */
    app.post('/friend/add', urlencodedParser, friendController.addFriend)

    /**
    * Danh sách bạn bè
    */
    app.get('/friend/list', isAuth.isAuthorize, friendController.listFriend)

    /**
    * Chấp nhận lời mời kết bạn
    */
    app.post('/friend/accept', urlencodedParser, friendController.acceptFriendRequest)

    /**
     * Từ chối lời mời kết bạn
     */
    app.post('/friend/cancel', urlencodedParser, friendController.cancelFriendRequest)

    /**
     * Lấy danh sách bạn bè
     */
    app.post('/friend/get', urlencodedParser, friendController.getListFriend)
}