//导入包
let express = require("express");
//导入包
const bodyParser = require('body-parser');
//创建app
let app = express();
//引入路由
const router = require('./router');
//设置跨域访问
app.use(require('cors')());
//挂载参数处理中间件
app.use(bodyParser.urlencoded({ extended: false }));
//处理json格式参数
app.use(bodyParser.json());
//使用路由
app.use('/', router);
//监听
app.listen(3005, (req, res) => {
    console.log('http://localhost:3005')
});