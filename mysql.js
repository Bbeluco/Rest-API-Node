const mysql = require('mysql2');

const pool = mysql.createPool({
    "user": "root",
    "password": "root",
    "database": "mydb",
    "host": "127.0.0.1",
    "port": 8888
});

exports.pool = pool;