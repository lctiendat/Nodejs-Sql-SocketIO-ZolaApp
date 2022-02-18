const chatCPM = require('../components/chat.component');
/**
 * Trang chủ
 */
function index(req, res) {
    const email = req.session.User.email
    chatCPM.getFriendHaveMessage(email).then(data => {
        res.render('home/index', {
            listMsgFriend: data,
            userEmail: req.session.User.email
        })
    }).catch(e => {
        console.log(e)
    })
}


module.exports = {
    index,
}