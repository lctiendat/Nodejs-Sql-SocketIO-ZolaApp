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
        OR (userEmail = '${friendEmail}' AND friendEmail = '${userEmail}') ORDER BY id DESC`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

module.exports = {
    getFriendMessage
}