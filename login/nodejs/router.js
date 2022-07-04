//导入包
let express = require("express");
//加载路由
let router = express.Router();
//导入文件
const conn = require("./db");
//查看数据
router.get('/api/getUserMsg', (req, res) => {
    let sqlStr = 'select * from fang_data';
    conn.query(sqlStr, (err, results) => {
        if (err) {
            res.json({ code: 1, msg: '获取数据失败。' })
        } else {
            res.json({ code: 0, unermsg: results })
        }
    })
});
//插入数据
router.post('/api/InsertUserMsg', (req, res) => {
    conn.query('INSERT INTO fang_data SET ?', req.body, (err, results) => {
        if (err) {
            res.json({ code: 1, msg: "插入数据失败。" })
        } else {
            res.json({ code: 0, msg: "插入成功。" })
        }
    })
});
module.exports = router;