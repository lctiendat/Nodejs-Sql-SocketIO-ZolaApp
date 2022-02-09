var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const userCPM = require('../components/user.component')
var { check, validationResult } = require('express-validator');
const friendValidator = require('../validator/friend.validator');
const appCpm = require('../components/app.component');
const friendCPM = require('../components/friend.component')
const serverConfig = require('../config/server.config');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
const isAuth = require('../middlewares/isAuth.middleware')

module.exports = (app) => {

    /**
     * Tìm kiếm bạn bè
     */
    app.post('/friend/search', urlencodedParser, friendValidator.searchFriend(), (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json(error.array());
        }
        const key = req.body.email
        userCPM.getUser(key).then((dataUser) => {
            if (dataUser.length == 0) {
                return res.json({
                    status: false,
                    msg: 'Người dùng không tồn tại trong hệ thống'
                })
            }
            const userEmail = req.session.User.email
            friendCPM.checkFriend(userEmail, key).then(data => {
                if (data.length == 0) {
                    return res.json({
                        status: true,
                        data: dataUser
                    })
                }
                if (data[0].userEmail == key) {
                    dataUser[0].order = 'before'
                }
                else {
                    dataUser[0].order = 'after'
                }
                dataUser[0].status = data[0].status
                return res.json({
                    status: true,
                    data: dataUser
                })

            })

        }).catch(err => {
            console.log(err)
            return res.json({
                status: false,
                msg: 'Có lỗi xảy ra'
            })
        })
    })

    /**
     * Thêm bạn bè
     */
    app.post('/friend/add', urlencodedParser, (req, res) => {
        const userId = req.session.User.email
        const friendId = req.body.email
        const data = [{
            userEmail: userId,
            friendEmail: friendId,
            created: serverConfig.getCurrenTime(),
            modified: serverConfig.getCurrenTime()
        }]
        appCpm.save('friends', data).then(result => {
            return res.json({
                status: true,
                msg: 'Đã gửi lời mời kết bạn'
            })
        }).catch(err => {
            console.log(err)
            return res.json({
                status: false,
                msg: 'Có lỗi xảy ra'
            })
        })
    }
    )

    /**
     * Danh sách bạn bè
     */
    app.get('/friend/list',isAuth.isAuthorize,(req, res) => {

        const userEmail = req.session.User.email
        friendCPM.getFriend(userEmail).then(listFriend => {
            friendCPM.getFriendRequest(userEmail).then(listFriendRequest => {
                return res.render('friend/list',
                    {
                        listFriend,
                        listFriendRequest
                    })
            }).catch(err => {
                console.log(err)
                res.json({
                    status: false,
                    msg: 'Có lỗi xảy ra'
                })
            })
        }).catch(err => {
            console.log(err)
            res.json({
                status: false,
                msg: 'Có lỗi xảy ra'
            })
        })

    })

    /**
     * Chấp nhận lời mời kết bạn
     */
    app.post('/friend/accept', urlencodedParser, (req, res) => {
        const userEmail = req.session.User.email
        const friendEmail = req.body.email
        friendCPM.acceptFriend(userEmail, friendEmail).then(result => {

            return res.json({
                status: true,
                msg: 'Đã chấp nhận lời mời kết bạn'
            })
        }).catch(err => {
            console.log(err)
            return res.json({
                status: false,
                msg: 'Có lỗi xảy ra'
            })
        })
    })
  
    /**
     * Từ chối lời mời kết bạn
     */
    app.post('/friend/cancel', urlencodedParser, (req, res) => {
        const userEmail = req.session.User.email
        const friendEmail = req.body.email
        friendCPM.cancelFriendRequest(userEmail, friendEmail).then(result => {
            return res.json({
                status: true,
                msg: 'Xoá yêu cầu kết bạn thành công'
            })
        }).catch(err => {
            console.log(err)
            return res.json({
                status: false,
                msg: 'Có lỗi xảy ra'
            })
        })
    })

}