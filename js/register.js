window.onload = function(){
	var html = document.documentElement;
	var hwidth = html.getBoundingClientRect().width;
	html.style.fontSize = hwidth / 15 + 'px';
	
	var oBtn = document.getElementById('btn');
	var oPhone = document.getElementById('phone');
	var oPwd = document.getElementById('pwd');
	var oInf = document.querySelector('.inf');
	var oForm = document.querySelector('.form_wrap');
	var oBackIcon = document.querySelector('.back_icon');
	oBackIcon.addEventListener('touchstart',function(){
		history.go(-1);
	},false);
	//判定登录状态
	ifLogin();
	if(ifLogin()!=='codeError'){
		window.open('myCenter.html','_self');
	}
	var db=openDatabase('register','1.0','text db','1024*1024');
	db.transaction(function(contex){
		contex.executeSql('create table if not exists userinf(id unique,user,password)')
	});
		//手机号验证
		var reg=/^1[3458]\d{9}$/;
		oPwd.addEventListener('touchstart',tips,false);
		function tips(){
			if(!reg.test(oPhone.value)){
				oInf.style.display = 'block';
				setTimeout(function(){
					oInf.style.display = 'none';
				},1000);
			}
		}
		oBtn.addEventListener('touchstart',register,false);
		function register(){
			if (oPhone.value&&oPwd.value) {
				db.transaction(function(contex){
					contex.executeSql('select * from userinf where user="'+oPhone.value+'"',[],function(con,data){
						var len=data.rows.length;
						if (len>0) {
							oInf.innerHTML = '该用户已存在';
							oInf.style.display = 'block';
							setTimeout(function(){
								oInf.style.display = 'none';
							},1000);
						}else{
							contex.executeSql('select * from userinf',[],function(con,data){
								var len=data.rows.length;
								contex.executeSql('insert into userinf(id,user,password) values("'+len+'","'+oPhone.value+'","'+oPwd.value+'")');
									oInf.innerHTML = '注册成功';
									oInf.style.display = 'block';
									setTimeout(function(){
										window.location.href = 'login.html';
									},1000);
									oPhone.value = '';
									oPwd.value = '';
							});
						}
					});
				});
			}else{
				oInf.style.display = 'block';
				setTimeout(function(){
					oInf.style.display = 'none';
				},1000);
			}
		}
}
