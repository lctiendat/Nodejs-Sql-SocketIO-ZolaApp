const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

/**
 * Kiểm tra xem user có bạn bè hay không
 */
function checkFriend(userEmail, friendEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM friends WHERE userEmail = '${userEmail}' AND friendEmail = '${friendEmail}' 
        UNION SELECT * FROM friends WHERE friendEmail = '${userEmail}' AND userEmail = '${friendEmail}'
        `, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Lấy danh sách bạn bè
 */
function getFriend(userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email IN
         (SELECT friendEmail as email FROM friends WHERE userEmail = '${userEmail}' AND status = 'accept' 
         union SELECT userEmail as email FROM friends WHERE friendEmail = '${userEmail}' AND status = 'accept')`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Lấy danh sách lời mời kết bạn
 */
function getFriendRequest(userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email IN
         (SELECT friendEmail as email FROM friends WHERE userEmail = '${userEmail}' AND status = 'pending' 
         union SELECT userEmail as email FROM friends WHERE friendEmail = '${userEmail}' AND status = 'pending')`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

module.exports = {
    checkFriend,
    getFriend,
    getFriendRequest
}