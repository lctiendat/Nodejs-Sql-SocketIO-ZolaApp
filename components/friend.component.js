const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

function getFriend(email) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM friends JOIN WHERE userEmail = '${email}'`, (err, rows) => {
            if (err) return rej(err)
            res(rows)
        })
    })
}