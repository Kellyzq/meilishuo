//设置根节点字体大小为页面宽度的1/15
window.onload=function(){
	var html = document.documentElement;
	var hWidth = html.getBoundingClientRect().width;
	html.style.fontSize = hWidth / 15 + "px";
}
$(function() {
	//返回历史上一页
	$('.myCenter_nav i').bind('touchstart',function(){
		history.go(-1);
	});
	//判定登录状态
	ifLogin();
	if(ifLogin()=='codeError'){
		window.open('login.html','_self');
	}
	$('.logout').bind('touchstart',function(){
		alertInf('确定要退出吗','#FFFFFF','#FF3366',1,true,function(){
			deleteCookie('login');
			window.open('login.html','_self');
		},function(){
			return;
		});
	});
	/**
	 * 新建对象db,读取、创建购物车可见名称'shoppingCart'，版本1.0，隐藏名称'text db'，大小1024*1024kb即1mb
	 */
	var db=openDatabase('shoppingCart','1.0','text db','1024*1024');
	//数据库内如果没有商品信息表格goodsinf，则自动创建一个
	db.transaction(function(contex){
		contex.executeSql('create table if not exists goodsinf(id unique,title,img,specialPrice,originPrice,color,size,num,user)');
	});
//	查看购物车列表数据
	db.transaction(function(contex){
		contex.executeSql('select * from goodsinf where user="'+getCookie('login')+'"',[],function(con,data){
			if(data.rows.length>0){
				$('.myCenter_orderForm_emptyPage').css('display','none');
				$('.myCenter_orderForm_orderFormPage').css('display','block');
			}else{
				$('.myCenter_orderForm_emptyPage').css('display','block');
				$('.myCenter_orderForm_orderFormPage').css('display','none');
			}
		});
	});
	//切换查看订单
	$('.myCenter_orderForm ul li').bind('touchstart',function(){
		$('.myCenter_orderForm ul li').removeClass('active');
		$(this).addClass('active');
	});
});