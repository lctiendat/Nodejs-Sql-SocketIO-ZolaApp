const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

function checkEmail(email) {
    return new Promise((res, rej) => {
        connection.query(`SELECT COUNT(*) AS count FROM users where email = '${email}' AND delete_flag = 0`, (err, row) => {
            if (err) return rej(err)
            res(!!row[0].count)
        });
    });
}

function checkUser(email, password) {
    return new Promise((res, rej) => {
        connection.query(`SELECT COUNT(*) AS count FROM users where email = '${email}' AND password = '${password}' AND delete_flag = 0`, (err, row) => {
            if (err) return rej(err)
            res(!!row[0].count)
        });
    });
}

function getUser(key) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email LIKE '%${key}%' AND delete_flag=0 LIMIT 1`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

function getUserByEmail(email) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM users WHERE email = '${email}' AND delete_flag=0 LIMIT 1`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}

function updateUser(email, data) {
    return new Promise((res, rej) => {
        connection.query(`UPDATE users SET ? WHERE email = '${email}'`, data, (err, result) => {
            if (err) return rej(err)
            res(result)
        })
    })
}

module.exports = {
    checkEmail,
    checkUser,
    getUser,
    getUserByEmail,
    updateUser
};