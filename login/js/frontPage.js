var ul = document.querySelector('#wrap ul');
var lis = document.querySelectorAll('#wrap ul li');
var closeBtns = document.querySelectorAll('.close');
var last=null;
var int = 0;
//出现时间差距200毫秒
var timer = setTimeout(function () {
    ul.className='';
}, 200);
//循环ul的所有子元素
lis.forEach(function(li,index){
    //给被点击的元素添加类名
    li.onclick=function(){
        ul.setAttribute('id','activeWrap');
        //判断是否有类名，有类名的话类名就为空
        last && (last.className='');
        this.className='active';
        //再次点击后跳转
        this.onclick = function () {
            window.location.href = this.getAttribute("data-href");
        }
        last=this;
    }
    //删除推出后的类名
    closeBtns[index].onclick=function(ev){
        window.location.href = "";
        lis[index].className='';
        ul.removeAttribute('id');
        last=null;
        ev.cancelBubble=true;
    }
});