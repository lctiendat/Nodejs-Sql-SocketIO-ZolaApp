const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

/**
 * Kiểm tra email có tồn tại trong database hay không
 */
function checkEmail(email) {
    return new Promise((res, rej) => {
        connection.query(`SELECT COUNT(*) AS count FROM users where email = '${email}' AND delete_flag = 0`, (err, row) => {
            if (err) return rej(err)
            res(!!row[0].count)
        });
    });
}

/**
 * Kiểm tra thông tin đăng nhập
 */
function checkUser(email, password) {
    return new Promise((res, rej) => {
        connection.query(`SELECT COUNT(*) AS count FROM users where email = '${email}' AND password = '${password}' AND delete_flag = 0`, (err, row) => {
            if (err) return rej(err)
            res(!!row[0].count)
        });
    });
}

/**
 * Tìm kiếm người dùng
 */
function getUser(key) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email LIKE '%${key}%' AND delete_flag=0 LIMIT 1`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Lấy người dùng theo email
 */
function getUserByEmail(email) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email = '${email}' AND delete_flag=0 LIMIT 1`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

/**
 * Câp nhật thông tin người dùng
 */
function updateUser(email, data) {
    return new Promise((res, rej) => {
        connection.query(`UPDATE users SET ? WHERE email = '${email}'`, data, (err, result) => {
            if (err) return rej(err)
            res(result)
        })
    })
}

/**
 * Kiểm tra email và OTP
 */
function checkOTP(email, otp) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email = '${email}' AND token = "${otp}" AND delete_flag = 0`, (err, row) => {
            if (err) return rej(err)
            res(row.length > 0 ? true : false)

        })
    })
}

module.exports = {
    checkEmail,
    checkUser,
    getUser,
    getUserByEmail,
    updateUser,
    checkOTP
};