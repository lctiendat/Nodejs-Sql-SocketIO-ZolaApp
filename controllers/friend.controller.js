var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const userCPM = require('../components/user.component')
var { check, validationResult } = require('express-validator');
const friendValidator = require('../validator/friend.validator');
const appCpm = require('../components/app.component');
const serverConfig = require('../config/server.config');

module.exports = (app) => {
    app.post('/friend/search', urlencodedParser, friendValidator.searchFriend(), (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json(error.array());
        }
        const key = req.body.email
        userCPM.getUser(key).then((row) => {
            if (row.length == 0) {
                return res.json({
                    status: false,
                    msg: 'Người dùng không tồn tại trong hệ thống'
                })
            }
            return res.json({
                status: true,
                data: row
            })
        }).catch(err => {
            console.log(err)
            return res.json({
                status: false,
                msg: 'Có lỗi xảy ra'
            })
        })
    })

    app.post('/friend/add', urlencodedParser, (req, res) => {
        const userId = req.session.sessionEmail
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
}