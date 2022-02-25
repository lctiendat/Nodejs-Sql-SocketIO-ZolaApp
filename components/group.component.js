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
        connection.query(`SELECT messages_of_group.email as email,users.name as nameUser ,users.avatar , messages_of_group.content , messages_of_group.type FROM messages_of_group LEFT JOIN users ON users.email = messages_of_group.email WHERE messages_of_group.group_code = '${groupCode}' AND messages_of_group.delete_flag = 0 ORDER BY messages_of_group.id`, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}


function getGroupByCode(groupCode) {
    return new Promise((res, rej) => {
        connection.query(`SELECT name, (SELECT COUNT(*) FROM members_of_group WHERE group_code = '${groupCode}' ) as countMemBer FROM groups WHERE code = '2Y4PI63NJyGnwU7ns8jk' AND delete_flag = 0
        `, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}
module.exports = {
    getListGroup,
    getMsgInGroup,
    getGroupByCode
}