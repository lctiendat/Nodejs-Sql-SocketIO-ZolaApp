const config = require('../config/database.config');
const mysql = require('mysql');
const connection = mysql.createConnection(config.dbConfig());
connection.connect();


function getData(data, type) {
    let arr = [];
    for (i in data) {
        if (type == 'key') {
            arr.push(`${Object.keys(data[i])}`);
        }
        else {
            arr.push(`${Object.values(data[i])}`);
        }
    }
    return arr.toString();
}

/**
 * Lưu dữ liệu vào database
 */
function save(model, data) {
    return new Promise((res, rej) => {
        connection.query(`INSERT INTO ${model}(${getData(data, 'key')}) VALUE(${getData(data, 'value').split(',').map((value) => { return `'${value}'`; }).join(',')})`, (err, result) => {
            if (err) return rej(err);
            res(result);
        });
    });
}

module.exports = {
    save
};

