var message = document.getElementById('message');
var content = document.querySelector('.content');
var sendBtn = document.getElementById('send');
message.onkeydown = function(e) {
    console.log(e.keyCode)
    // 如果按下的键是enter 则发送数据
    if (e.keyCode === 13) {
        var value = message.value;
        // 判断当前输入框是否有信息  有的话发送出去
        if (value) {
            renderMessage('mine', value);
            this.value = "";
            sendMessage(value);
        }
    } 
}

sendBtn.onclick = function () {
    if (message.value) {
        renderMessage('mine', message.value);
        message.value = "";
        sendMessage(message.value);
    }
}

// 发出网络请求方法
function sendMessage(text) {
    ajax({
        method:"get",
        url: "https://developer.duyiedu.com/edu/turing/chat/",
        data: "text="+text,
        success: function (data) {
            console.log(data);
            renderMessage('robot', data.text);
        }
    })
}
// 渲染信息  who: 是谁说的话  text: 说了什么
function renderMessage(who, text) {
    console.log(who, text)
    var dom = document.createElement('div');
    var img = new Image();
    var textDom = document.createElement('div');
    img.className = 'avator';
    textDom.className = 'text';
    textDom.innerText = text;
    
    if (who === 'mine') {
        img.src = "./img/男头像.svg";
        dom.className = 'mine';
    } else {
        img.src = "./img/女头像.svg";
        dom.className = 'robot';
    }
    dom.appendChild(img);
    dom.appendChild(textDom);
    content.appendChild(dom)
    // scrollHeight: 代表的是当前内容区在没有滚动条的时候  里面元素撑开的大小， 
    // clientHeight： 代表的是当前内容区视口的高度
    content.scrollTo(0, content.scrollHeight - content.clientHeight);
}