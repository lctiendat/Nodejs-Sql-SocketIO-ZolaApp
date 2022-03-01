const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

/**
 * Lấy danh sách nhóm chat của người dùng
 */
function getListGroup(userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM groups WHERE code IN  (SELECT group_code as code FROM members_of_group WHERE email = '${userEmail}') AND delete_flag= 0 ORDER BY id DESC `, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

/**
 * Lấy tất cả tin nhắn trong nhóm chat
 */
function getMsgInGroup(groupCode) {
    return new Promise((res, rej) => {
        connection.query(`SELECT messages_of_group.email as email,users.name as nameUser ,users.avatar , messages_of_group.content , messages_of_group.type ,messages_of_group.created as time  FROM messages_of_group LEFT JOIN users ON users.email = messages_of_group.email WHERE messages_of_group.group_code = '${groupCode}' AND messages_of_group.delete_flag = 0 ORDER BY messages_of_group.id`, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

/**
 * Lấy thônt tin nhóm chat bằng code
 */
function getGroupByCode(groupCode) {
    return new Promise((res, rej) => {
        connection.query(`SELECT group_owner, name, (SELECT COUNT(*) FROM members_of_group WHERE group_code = '${groupCode}' ) as countMemBer FROM groups WHERE code = '${groupCode}' AND delete_flag = 0
        `, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

/**
 * Lấy danh sách bạn bè không có trong nhóm chat
 */
function getListFriendNotInGroup(groupCode, userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT email,avatar,name FROM users 
        WHERE email IN 
        (SELECT friendEmail as email FROM friends WHERE userEmail = '${userEmail}' 
        AND status = 'accept' AND delete_flag = 0 union 
        SELECT userEmail as email FROM friends WHERE friendEmail = '${userEmail}' 
        AND status = 'accept' AND delete_flag = 0 ) AND email NOT IN 
        (SELECT email FROM members_of_group WHERE group_code= '${groupCode}' ) ORDER BY id DESC
`, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

/**
 * Thay đổi tên của nhóm chat
 */
function changeGroupName(groupCode, groupName) {
    return new Promise((res, rej) => {
        connection.query(`UPDATE groups SET name = '${groupName}' WHERE code = '${groupCode}'`, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

/**
 * Lấy tất cả thành viên trong nhóm chat
 */
function getListMember(groupCode) {
    return new Promise((res, rej) => {
        connection.query(`SELECT email,avatar,name FROM users 
        WHERE email IN (SELECT email FROM members_of_group WHERE group_code = '${groupCode}' ) ORDER BY id DESC`, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

module.exports = {
    getListGroup,
    getMsgInGroup,
    getGroupByCode,
    getListFriendNotInGroup,
    changeGroupName,
    getListMember
}