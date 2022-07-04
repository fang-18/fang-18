//导入包
const mysql = require("mysql");
//获取链接
const conn = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '123456',
    database: "fang",
    multipleStatements: true
});
//发起链接
conn.connect();
//导出数据
module.exports = conn;