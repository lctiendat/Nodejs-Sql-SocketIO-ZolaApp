var { check, validationResult } = require('express-validator');
const serverConfig = require('../config/server.config');
const appCpm = require('../components/app.component');

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

module.exports = {
    createGroup
}