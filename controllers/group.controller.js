var { check, validationResult } = require('express-validator');
const serverConfig = require('../config/server.config');
const appCpm = require('../components/app.component');
const groupCPN = require('../components/group.component');
/**
 * Tạo nhóm chat
 */
function createGroup(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json(error.array());
    }
    const userEmail = req.session.User.email
    const groupName = req.body.name
    const listMember = (req.body.listMember) != null ? req.body.listMember : []
    const groupCode = serverConfig.getToken()
    listMember.push(userEmail)

    let data = [{
        group_owner: userEmail,
        name: groupName,
        code: groupCode,
        created: serverConfig.getCurrenTime(),
        modified: serverConfig.getCurrenTime()
    }]

    appCpm.save('groups', data).then(insertResult => {
        listMember.forEach(member => {
            let data = [{
                group_code: groupCode,
                email: member,
                created: serverConfig.getCurrenTime(),
            }]
            appCpm.save('members_of_group', data).then(resultInsert => { }).catch(err => {

            })
        });
        return res.json({
            status: true,
            msg: 'Tạo nhóm chat thành công'
        })
    }).catch(err => {
        console.log(err);
    })
}

/**
 * Lấy tất cả tin nhắn trong nhóm chat
 */
function getMsgInGroup(req, res) {
    const group_code = req.body.groupCode
    groupCPN.getMsgInGroup(group_code)
        .then(listMsg => {
            groupCPN.getGroupByCode(group_code).then(group => {
                return res.json({
                    status: true,
                    listMsg,
                    group
                })
            })
        })
        .catch(err => {
            console.log(err);
        })
}

function saveMsgText(req, res) {
    const group_code = req.body.code
    const email = req.session.User.email
    const content = req.body.content
    const type = 'text'
    const data = [{
        group_code,
        email,
        content,
        type,
        created: serverConfig.getCurrenTime(),
    }]
    appCpm.save('messages_of_group', data).then(result => {
        return res.json({
            status: true,
            msg: 'Gửi tin nhắn thành công'
        })
    }).catch(err => {
        console.log(err);
    })
}

module.exports = {
    createGroup,
    getMsgInGroup,
    saveMsgText
}