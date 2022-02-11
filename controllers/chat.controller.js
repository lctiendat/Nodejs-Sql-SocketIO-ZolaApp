const serverConfig = require('../config/server.config');
const chatCPM = require('../components/chat.component');

function getFriendMessage(req, res) {
    const userEmail = req.session.User.email
    const friendEmail = req.body.email

    chatCPM.getFriendMessage(userEmail, friendEmail).then(data => {
        console.log(data);
        return res.json({
            status: true,
            data: data
        })
    }).then(e => {
        console.log(e);
        return res.json({
            status: false,
            msg: 'Lấy tin nhắn bạn bè thất bại'
        })
    })
}

module.exports = {
    getFriendMessage
}