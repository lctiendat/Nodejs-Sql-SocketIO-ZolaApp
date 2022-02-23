const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();
const serverConfig = require('../config/server.config');

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
         (SELECT friendEmail as email FROM friends WHERE userEmail = '${userEmail}' AND status = 'accept' AND delete_flag = 0
         union SELECT userEmail as email FROM friends WHERE friendEmail = '${userEmail}' AND status = 'accept' AND delete_flag = 0 ) ORDER BY id DESC`, (err, rows) => {
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
        (SELECT userEmail as email 
           FROM friends WHERE friendEmail = '${userEmail}' 
           AND status = 'pending' AND delete_flag = 0 ) ORDER BY id DESC`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Đồng ý kết bạn
 */
function acceptFriend(userEmail, friendEmail) {
    return new Promise((res, rej) => {
        connection.query(`UPDATE friends SET status = 'accept' , room = '${serverConfig.creatRoom()}'
        WHERE userEmail = '${userEmail}' 
        AND friendEmail = '${friendEmail}'
         OR friendEmail = '${userEmail}' 
         AND userEmail = '${friendEmail}'`, (err, result) => {
            if (err) return rej(err)
            res(result)
        })
    })
}

/**
 * Từ chối kết bạn
 */
function cancelFriendRequest(userEmail, friendEmail) {
    return new Promise((res, rej) => {
        connection.query(`UPDATE friends SET delete_flag = 1 
        WHERE userEmail = '${userEmail}' 
        AND friendEmail = '${friendEmail}'
         OR friendEmail = '${userEmail}' 
         AND userEmail = '${friendEmail}'`, (err, result) => {
            if (err) return rej(err)
            res(result)
        })
    })
}


module.exports = {
    checkFriend,
    getFriend,
    getFriendRequest,
    acceptFriend,
    cancelFriendRequest
}