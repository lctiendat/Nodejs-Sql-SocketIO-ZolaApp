const appCpm = require('../components/app.component');
const userCPM = require('../components/user.component')
var { check, validationResult } = require('express-validator');
const friendCPM = require('../components/friend.component')
const serverConfig = require('../config/server.config');

/**
 * Tìm kiếm bạn bè
 */
function searchFriend(req, res) {
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
}

/**
 * Thêm bạn bè
 */
function addFriend(req, res) {
    const userEmail = req.session.User.email
    const friendEmail = req.body.email
    const data = [{
        userEmail: userEmail,
        friendEmail: friendEmail,
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

/**
 * Danh sách bạn bè
 */
function listFriend(req, res) {
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
}

/**
 * Lấy danh sách bạn bè
 */
function getListFriend(req, res) {
    const userEmail = req.session.User.email
    friendCPM.getFriend(userEmail).then(listFriend => {
        return res.json({
            status: true,
            data: listFriend
        })
    }).catch(err => {
        console.log(err);
    })
}

/**
 * Đồng ý kết bạn
 */
function acceptFriendRequest(req, res) {
    const userEmail = req.session.User.email
    const friendEmail = req.body.email

    const dataMsg = [{
        userEmail,
        friendEmail,
        content: 'Chúng ta đã trở thành bạn bè',
        type: 'text',
        created: serverConfig.getCurrenTime()
    }]

    friendCPM.acceptFriend(userEmail, friendEmail).then(result => {
        appCpm.save('messages', dataMsg).then(result => {
            return res.json({
                status: true,
                msg: 'Đã chấp nhận lời mời kết bạn'
            })
        })
    }).catch(err => {
        console.log(err)
        return res.json({
            status: false,
            msg: 'Có lỗi xảy ra'
        })
    })
}

/**
 * Từ chối / Huỷ kết bạn
 */
function cancelFriendRequest(req, res) {
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
}

module.exports = {
    searchFriend,
    listFriend,
    addFriend,
    acceptFriendRequest,
    cancelFriendRequest,
    getListFriend
}