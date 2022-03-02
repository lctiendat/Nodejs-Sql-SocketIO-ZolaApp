const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

/**
 * Lấy tin nhắn bạn bè
 */
function getFriendMessage(userEmail, friendEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM messages WHERE (userEmail = '${userEmail}' AND friendEmail = '${friendEmail}')
        OR (userEmail = '${friendEmail}' AND friendEmail = '${userEmail}')`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Lấy danh sách bạn bè đã gửi tin nhắn
 */
function getFriendHaveMessage(userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email IN (SELECT friendEmail as email FROM messages WHERE userEmail = '${userEmail}' 
        UNION SELECT userEmail as email FROM messages WHERE friendEmail = '${userEmail}')`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}


/**
 * Lấy phòng của 2 người dùng
 */
function getRoom(userEmail, friendEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT room FROM friends WHERE (userEmail = '${userEmail}' AND friendEmail = '${friendEmail}')
        OR (userEmail = '${friendEmail}' AND friendEmail = '${userEmail}') AND delete_flag = 0`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Lấy tất cả phòng của người dùng
 */
function getAllRoomOfUser(userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT room FROM friends WHERE delete_flag = 0 AND status = 'accept' AND userEmail = '${userEmail}'  OR friendEmail = '${userEmail}'
        UNION SELECT group_code as room from members_of_group WHERE email = '${userEmail}'`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Thu hồi tin nhắn
 */
function recallMsg(id) {
    return new Promise((res, rej) => {
        connection.query(`UPDATE messages SET content = 'recall' WHERE id = '${id}'`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}
module.exports = {
    getFriendMessage,
    getFriendHaveMessage,
    getRoom,
    getAllRoomOfUser,
    recallMsg
}