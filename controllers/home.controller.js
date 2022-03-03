const chatCPM = require('../components/chat.component');
const groupCPM = require('../components/group.component');
const friendCPN = require('../components/friend.component');
/**
 * Trang chủ
 */
function index(req, res) {
    const email = req.session.User.email
    friendCPN.getFriend(email).then(listMsgFriend => {
        groupCPM.getListGroup(email).then(listGroup => {
            res.render('home/index', {
                listMsgFriend,
                listGroup,
                userEmail: req.session.User.email
            })
        })
    }).catch(e => {
        console.log(e)
    })
}

module.exports = {
    index,
}