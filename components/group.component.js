const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();

function getListGroup(userEmail) {
    return new Promise((res, rej) => {
        connection.query(`SELECT * FROM groups WHERE code IN  (SELECT group_code as code FROM members_of_group WHERE email = '${userEmail}') AND delete_flag= 0 ORDER BY id DESC `, (err, row) => {
            if (err) return rej(err)
            res(row)
        })
    })
}

module.exports = {
    getListGroup
}