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

/**
 * Gửi tin nhắn dạng text
 */
function saveMsgText(req, res) {
    const group_code = req.body.groupCode
    const code = req.body.code
    const email = req.session.User.email
    const content = req.body.content
    const type = 'text'
    const data = [{
        group_code,
        code,
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

/**
 * Gưi tin nhắn hình ảnh
 */
function saveMsgImage(req, res) {
    const email = req.session.User.email
    const newPath = (req.file.path).replace('/Users/lctiendat/Documents/ZolaApp', '')
    const group_code = req.body.groupCode
    const code = req.body.code
    const content = newPath
    const type = 'img'
    const data = [{
        group_code,
        code,
        email,
        content,
        type,
        created: serverConfig.getCurrenTime(),
    }]
    appCpm.save('messages_of_group', data).then(result => {
        return res.json({
            status: true,
            path: newPath
        });
    }).catch(err => {
        console.log(err);
    })
}

/**
 * Lưu tin nhắn kèm file
 */
function saveMsgFile(req, res) {
    const email = req.session.User.email
    const newPath = (req.file.path).replace('/Users/lctiendat/Documents/ZolaApp', '')
    const group_code = req.body.groupCode
    const code = req.body.code
    const content = newPath
    const type = 'file'
    const data = [{
        group_code,
        code,
        email,
        content,
        type,
        created: serverConfig.getCurrenTime(),
    }]
    appCpm.save('messages_of_group', data).then(result => {
        return res.json({
            status: true,
            path: newPath
        });
    }).catch(err => {
        console.log(err);
    })
}

/**
 * Lấy danh sácch bạn bè không có trong nhóm chat
 */
function getListFriendNotInGroup(req, res) {
    let group_code = req.body.groupCode
    const email = req.session.User.email
    groupCPN.getListFriendNotInGroup(group_code, email)
        .then(listFriend => {
            return res.json({
                status: true,
                listFriend
            })
        })
        .catch(err => {
            console.log(err);
        })
}

/**
 * Thêm bạn bè vào nhóm chat
 */
function addFriendToGroup(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.json(error.array());
    }
    const groupCode = req.body.groupCode
    const listFriend = req.body.listFriend

    listFriend.forEach(element => {
        const data = [{
            group_code: groupCode,
            email: element,
            created: serverConfig.getCurrenTime(),
        }]
        appCpm.save('members_of_group', data).then(result => {
        })
        return res.json({
            status: true,
            msg: 'Thêm bạn bè vào nhóm thành công'
        })
    });
}

/**
 * Lấy chủ nhóm chat
 */
function getGroupOwner(req, res) {
    const group_code = req.body.groupCode
    groupCPN.getGroupByCode(group_code).then(group => {
        if (group[0].group_owner == req.session.User.email) {
            return res.json({
                status: true,
                group
            })
        }
    })
}

/**
 * Thay đổi tên nhóm chat
 */
function changeGroupName(req, res) {
    const group_code = req.body.groupCode
    const group_name = req.body.groupName
    groupCPN.changeGroupName(group_code, group_name).then(result => {
        return res.json({
            status: true,
            msg: 'Thay đổi tên nhóm thành công'
        })
    })
}

/**
 * Lấy tất cả thành viêm trong nhóm chat
 */
function getAllMembersInGroup(req, res) {
    const group_code = req.body.groupCode
    groupCPN.getListMember(group_code).then(members => {
        groupCPN.getGroupByCode(group_code).then(group => {
            array = []
            members.forEach(member => {
                if (member.email != group[0].group_owner) {
                    array.push({
                        email: member.email,
                        name: member.name,
                        avatar: member.avatar,
                        is_owner: false,
                        owner_email: group[0].group_owner
                    })
                }
                else {
                    array.push({
                        email: member.email,
                        name: member.name,
                        avatar: member.avatar,
                        is_owner: true,
                        owner_email: group[0].group_owner
                    })
                }
            })
            return res.json({
                status: true,
                members: array
            })
        })

    })
}
/**
 * Xóa thành viên khỏi nhóm chat
 */
function removeMemberInGroup(req, res) {
    const group_code = req.body.groupCode
    const email = req.body.email
    groupCPN.removeMemberInGroup(group_code, email).then(result => {
        return res.json({
            status: true,
            msg: 'Xóa thành viên khỏi nhóm thành công'
        })
    })
}
/**
 * Rời khỏi nhóm chat
 */
function leaveGroup(req, res) {
    const email = req.session.User.email
    const group_code = req.body.groupCode
    groupCPN.removeMemberInGroup(group_code, email).then(result => {
        return res.json({
            status: true,
            msg: 'Rời khỏi nhóm chat thành công'
        })
    })
}

/**
 * Thu hồi tin nhắn
 */
function recallMsg(req, res) {
    const id = req.body.id
    groupCPN.recallMsg(id).then(data => {
        return res.json({
            status: true,
            msg: 'Thu hồi tin nhắn thành công'
        })
    })
}
module.exports = {
    createGroup,
    getMsgInGroup,
    saveMsgText,
    saveMsgImage,
    saveMsgFile,
    getListFriendNotInGroup,
    addFriendToGroup,
    getGroupOwner,
    changeGroupName,
    getAllMembersInGroup,
    removeMemberInGroup,
    leaveGroup,
    recallMsg
}