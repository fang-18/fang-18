var form = document.querySelector('.form');
var logpwd = document.querySelector('.logpwd');
var h1 = document.querySelector('.head-h1 h1');
var lefts = document.querySelector('.lefts button');
var rights = document.querySelector('.rights button');
var names = document.getElementById("name");
var pwds = document.getElementById("pwd");
var pwdAgains = document.getElementById("pwdAgain");
var rnone = document.querySelector('.rnone button');
var lnone = document.querySelector('.lnone button');
//点击登录
lefts.onclick = function () {
    //交互效果块
    logpwd.style.display = "none";
    form.style.height = "330px";
    h1.innerHTML = "用户登录";
    rnone.style.display = "block";
    rights.style.display = "none";
    // 进行判断内容不能为空
    if (!names.value || !pwds.value) {
        alert("账号或密码都不能为空！");
    } else {
        //向服务器发送请求
        $.ajax({
            type: 'get',
            url: 'http://localhost:3005/api/getUserMsg',
            success: function (res) {
                for (let i in res.unermsg) {
                    if (names.value == res.unermsg[i].username && pwds.value == res.unermsg[i].password) {
                        alert("登陆成功。");
                        return window.location.href = "./login/frontPage.html";
                    }
                }
                return alert("账号或密码输入错误！");
            },
            error: function () {
                console.log('error');    //调用失败的回调
            }
        })
    }
}

//点击交互
rnone.onclick = function () {
    names.value = '';
    pwds.value = '';
    logpwd.style.display = "block";
    form.style.height = "400px";
    h1.innerHTML = "用户注册";
    rnone.style.display = "none";
    rights.style.display = "block";
    lnone.style.display = "block";
    lefts.style.display = "none"
    names.onblur = function () {
        $.ajax({
            type: 'get',
            url: 'http://localhost:3005/api/getUserMsg',
            success: function (res) {
                for (let i in res.unermsg) {
                    if (res.unermsg[i].username == names.value) {
                        alert("用户已存在！");
                        return false;
                    }
                }
            }
        })
    }
}
lnone.onclick = function () {
    lnone.style.display = "none";
    lefts.style.display = "block";
    logpwd.style.display = "none";
    form.style.height = "330px";
    h1.innerHTML = "用户登录";
    rights.style.display = "none";
    rnone.style.display = "block";
    names.onblur = null;

}



//点击注册
rights.onclick = function () {
    if (!pwdAgains.value || !pwds.value || !names.value) {
        alert("账号和密码都不能为空！");
        return false;
    } else if (String(pwdAgains.value) != String(pwds.value)) {
        alert('两次密码不一致。');
        return false;
    } else {
        $.ajax({
            type: 'post',
            url: 'http://localhost:3005/api/InsertUserMsg',
            data: {
                username: String(names.value),
                password: String(pwds.value)
            },
            success: function () {
                alert("注册成功。");
            },
            error: function () {
                console.log('error');    //调用失败的回调
            },
        })
        names.value = '';
        pwds.value = '';
        pwdAgains.value = '';
        return false;
    }
}
//表单验证
var formRule = {
    loginId: [{
        rule: "required",
        message: "请填写账号"
    },
    {
        rule: /^.{4,16}$/,
        message: "账号必须是4-16位字符"
    }
    ],
    pwd: [{
        rule: "required",
        message: "请输入密码"
    },
    {
        rule: /^.{6,16}$/,
        message: "密码必须是6-16位字符"
    }],
    pwdAgain: [{
        rule: "required",
        message: "请填写确认密码"
    },
    {
        rule: function (value, formData) {
            if (value === formData.pwd) {
                return true;
            } else {
                return "两次密码输入不一致"
            }
        }
    }]
}
//错误提示
var formValidator = new myPlugin.FormValidator({
    formDom: document.querySelector(".form"),
    formRule,
    errorClass: "has-error"
})

document.querySelector(".form").onsubmit = function () {
    var results = formValidator.setStatus();
    if (results.length > 0) {
        return false;
    }
}