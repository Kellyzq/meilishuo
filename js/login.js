window.onload = function(){
	var html = document.documentElement;
	var hwidth = html.getBoundingClientRect().width;
	html.style.fontSize = hwidth / 15 + 'px';
//	
//	var oUser=document.getElementById('user');
//	var oPwd=document.getElementById('pwd');
//	var oBtn=document.getElementById('btn');
//	var oInf = document.querySelector('.inf');
//	var db=openDatabase('register','1.0','text db','1024*1024');
//	db.transaction(function(contex){
//		contex.executeSql('create table if not exists userinf(id unique,user,password)')
//	});
//	
//	oBtn.addEventListener('touchstart',login,false);
//	
//	function login(){
//		var blogin = null;
//		if(oUser.value&&oPwd.value){
//			db.transaction(function(contex){
//				contex.executeSql('select * from userinf',[],function(con,data){
//					var len=data.rows.length,i;
//					for(var i=0;i<len;i++){
//						if(oUser.value == data.rows.item(i).user && oPwd.value == data.rows.item(i).password){
//							blogin = 1;
//							break;
//						}
//					}
//					if(blogin==null){
//						oInf.style.display = 'block';
//						setTimeout(function(){
//							oInf.style.display = 'none';
//						},1000);
//					}else{
//						oInf.innerHTML = '登录成功';
//						setTimeout(function(){
//							setCookie('login',oUser.value);
//							window.location.href = 'myCenter.html';
//						},1000);
//					}
//				});
//			});
//		};
//	}
//	var oImg = document.querySelector('.img_code')
//	oPwd.addEventListener('touchstart',function(){
//		oImg.style.display = 'block';
//	},false);
}

$(function(){
	$('.back_icon').bind('touchstart',function(){
		history.go(-1);
	});
	//判定登录状态
	ifLogin();
	if(ifLogin()!=='codeError'){
		window.open('myCenter.html','_self');
	}
	//验证码
	var ary = ['','','',''];
	var successkey=0;
	createRandom();
	function createRandom(){
		$('.img_code ul li').each(function(){
			var index = $(this).index();
			var random = parseInt(Math.random()*4);
			var success = null;
			function asuccess(){
				for(var i=0;i<ary.length;i++){
					success +=parseInt(ary[i]);
				}
				if(success ==0){
					successkey=1;
				}
			}
			$('.img_code ul li').eq(index).css('transform','rotateZ('+random*90+'deg)');
			$('.img_code ul li').eq(index).attr('random',random);
			ary[index] = $('.img_code ul li').eq(index).attr('random');
			$('.img_code ul li').eq(index).bind('touchstart',function(){
				success = null;
				var getrandom = parseInt($(this).attr('random'));
				getrandom +=1;
				if(getrandom>3){
					getrandom=0;
				}
				$(this).css('transform','rotateZ('+getrandom*90+'deg)');
				$(this).attr('random',getrandom);
				ary[index] = $('.img_code ul li').eq(index).attr('random');
				asuccess();
			});
			asuccess();
			
		});
	}
	var oUser=document.getElementById('user');
	var oPwd=document.getElementById('pwd');
	var oBtn=document.getElementById('btn');
	var oInf = document.querySelector('.inf');
	var db=openDatabase('register','1.0','text db','1024*1024');
	db.transaction(function(contex){
		contex.executeSql('create table if not exists userinf(id unique,user,password)')
	});
	
	$('#btn').bind('touchstart',login);
	
	function login(){
		var blogin = null;
		if($('#user').val()&&$('#pwd').val()){
			db.transaction(function(contex){
				contex.executeSql('select * from userinf',[],function(con,data){
					var len=data.rows.length,i;
					for(var i=0;i<len;i++){
						if($('#user').val() == data.rows.item(i).user && $('#pwd').val() == data.rows.item(i).password){
							blogin = 1;
							break;
						}
					}
					if(blogin==null||successkey==0){
						$('.inf').html('登录失败');
						$('.inf').css('display','block');
						setTimeout(function(){
							$('.inf').css('display','none');
						},1000);
					}else{
						$('.inf').html('登录成功');
						setTimeout(function(){
							setCookie('login',$('#user').val());
							window.location.href = 'myCenter.html';
						},500);
					}
				});
			});
		};
	}
	$('#pwd').bind('input',function(){
		$('.img_code').css('display','block');
	});
});
