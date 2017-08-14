//设置根节点字体大小为页面宽度的1/15
window.onload=function(){
	var html = document.documentElement;
	var hWidth = html.getBoundingClientRect().width;
	html.style.fontSize = hWidth / 15 + "px";
}
$(function() {
	/**
	 * 新建对象db,读取、创建购物车可见名称'shoppingCart'，版本1.0，隐藏名称'text db'，大小1024*1024kb即1mb
	 */
	var db=openDatabase('shoppingCart','1.0','text db','1024*1024');
	//数据库内如果没有商品信息表格goodsinf，则自动创建一个
	db.transaction(function(contex){
		contex.executeSql('create table if not exists goodsinf(id unique,title,img,specialPrice,originPrice,color,size,num,user)');
	});
//	测试用：清除表格
//	db.transaction(function(contex){
//		contex.executeSql('drop table goodsinf');
//	});
	//提示选择颜色和尺码
	function colorAndSize(){
		if ($('.choose_size ul li').hasClass('active')&&$('.choose_color ul li').hasClass('active')) {
			$('.must_choose').html('');
		}else if ($('.choose_size ul li').hasClass('active')) {
			$('.must_choose').html('请选择颜色');
		}else if ($('.choose_color ul li').hasClass('active')) {
			$('.must_choose').html('请选择尺码');
		}else{
			$('.must_choose').html('请选择颜色、尺码');
		}
	}
	//函数返回已选的颜色
	function colorIsSelected(){
		var cIS=null;
		for (var i=0;i<$('.choose_color ul li').length;i++) {
			if ($('.choose_color ul li').eq(i).hasClass('active')) {
				cIS=i;
			}
		}
		if (cIS==0) {
			return '深色';
		}else if (cIS==1) {
			return '淡色';
		}else if (cIS==2) {
			return '粉色';
		}
	}
	//函数返回已选的尺码
	function sizeIsSelected(){
		var sIS=null;
		for (var i=0;i<$('.choose_size ul li').length;i++) {
			if ($('.choose_size ul li').eq(i).hasClass('active')) {
				sIS=i;
			}
		}
		if (sIS==0) {
			return 'XS';
		}else if (sIS==1) {
			return 'S';
		}else if (sIS==2) {
			return 'M';
		}else if (sIS==3) {
			return 'L';
		}else if (sIS==4) {
			return 'XL';
		}
	}
	totalGoods();
	//更新购物车商品总数
	function totalGoods(){
		db.transaction(function(contex){
			contex.executeSql('select * from goodsinf where user="'+getCookie('login')+'"',[],function(con,data){
				var total=null;
				for (var i=0;i<data.rows.length;i++) {
					total+=parseInt(data.rows[i].num);
				}
				$('.shoppingCart span').html(total);
				if (total==null) {
					$('.shoppingCart span').html('0');
				}
			});
		});
	}
	//显示选择面板
	$('.addShoppingCart').bind('touchstart', function() {
		setTimeout(function(){
			$('.mask').css('display','block');
			$('.choose_panel').css('display','block');
		},300);
	});
	//关闭选择面板
	$('.choose_panel_close').bind('touchstart', function() {
		$('.mask').css('display','none');
		$('.choose_panel').css('display','none');
	});
	//选择颜色
	$('.choose_color ul li').bind('touchstart', function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$('.choose_color ul li').removeClass('active');
			$(this).addClass('active');
		}
		colorAndSize();
	});
	//选择尺码
	$('.choose_size ul li').bind('touchstart', function() {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$('.choose_size ul li').removeClass('active');
			$(this).addClass('active');
		}
		colorAndSize();
	});
//	确认提交购物车按钮
	$('.confirm').click(function(){
//		如果商品规格填选完整
		if(ifLogin()=='codeError'){
			alertInf('请先登录','#FFFFFF','#FF3366');
			return;
		}
		if ($('.choose_size ul li').hasClass('active')&&$('.choose_color ul li').hasClass('active')) {
			db.transaction(function(contex){
//				从goodsinf中历遍所有title==$('.thumbnail_title').html()的数据
				contex.executeSql(
					'select * from goodsinf where title="'
					+$('.thumbnail_title').html()
					+'" and color="'+colorIsSelected()
					+'" and size="'+sizeIsSelected()
					+'" and user="'+getCookie('login')
					+'"'
					,
					[],
					function(con,data){
//						获取所得匹配title值的行的数量
						var len=data.rows.length;
//						console.log(con);
//						console.log(data);
						console.log(len);
//						如果有匹配title值的行
						if (len>0) {
							//保存该行商品数量
							var oldNum=data.rows[0].num;
							//修改该行商品数量
							contex.executeSql(
								'update goodsinf set num="'
								+(parseInt(oldNum)+parseInt($('.num').html()))
								+'" where title="'
								+$('.thumbnail_title').html()
								+'" and color="'+colorIsSelected()
								+'" and size="'+sizeIsSelected()
								+'" and user="'+getCookie('login')
								+'"'
							);
						}
//						如果没有匹配title值的行
						else{
							contex.executeSql('select id from goodsinf',[],function(con,data){
//								获取表格'goodsinf'内行的数量
								console.log(data);
								var maxid=null;
								var ary=[];
								if(data.rows.length<1){
									maxid=0;
								}
								else if(data.rows.length<2){
									maxid=parseInt(data.rows[0].id)+1;
								}
								else{
									for (var i=0;i<data.rows.length;i++) {
										ary.push(parseInt(data.rows[i].id));
									}
									maxid=Math.max.apply(null, ary)+1;
								}
//								console.log(maxid);
								contex.executeSql(
									'insert into goodsinf(id,title,img,specialPrice,originPrice,color,size,num,user) values("'
										+maxid+'","'
										+$('.thumbnail_title').html()+'","'
										+$('.thumbnail').find('img').attr('src')+'","'
										+$('.price').find('span').html()+'","'
										+$('.price').find('del').html()+'","'
										+colorIsSelected()+'","'
										+sizeIsSelected()+'","'
										+$('.num').html()+'","'
										+getCookie('login')
									+'")'
								);
							});
						}
					}
				);
			});
			alertInf('加入购物车成功','#FFFFFF','#FF3366');
			totalGoods();
		}
//		如果商品规格填选不完整
		else{
			//弹出提示信息
			alertInf('请选择商品规格','#FFFFFF','#FF3366');
		}
	});
	//购买数量减少
	$('.minus').bind('touchstart', function() {
		if ($('.num').html()=='1') {
			$(this).removeClass('active');
			return;
		}else{
			$('.num').html(parseInt($('.num').html())-1)
			$(this).addClass('active');
			$('.plus').addClass('active');
			if ($('.num').html()=='1') {
				$(this).removeClass('active');
				return;
			}
		}
	});
	//购买数量增加
	$('.plus').bind('touchstart', function() {
		if ($('.num').html()==$('.repertory i').html()) {
			$(this).removeClass('active');
			return;
		}else{
			$('.num').html(parseInt($('.num').html())+1)
			$(this).addClass('active');
			$('.minus').addClass('active');
			if ($('.num').html()==$('.repertory i').html()) {
				$(this).removeClass('active');
				return;
			}
		}
	});
	//返回顶部
	$('.totop').bind('touchstart',function(){
		$('body').stop().animate({scrollTop:0},500);
		return false;
	});
	//获取本地存储，如果有数据就显示，没有就显示404页面引导返回首页
	if (window.localStorage.getItem('goodsDetail')) {
		var dataJson=JSON.parse(window.localStorage.getItem('goodsDetail'));
		$('.title').html(dataJson.title);
		$('.thumbnail_title').html(dataJson.title);
		$('.thumbnail_price').find('span').eq(0).html(dataJson.specialPrice);
		$('.price').find('span').html(dataJson.specialPrice);
		$('.price').find('del').html(dataJson.originPrice);
		$('.thumbnail').find('img').attr('src',dataJson.img);
		$('.goods_banner').find('img').attr('src',dataJson.img);
	}else{
		$emptyPage='<section class="resource404NotFound"><p>404 Not Found</p><p>该商品详情页不存在</p><a href="index.html"><img src="img/404page_logo.png"/>点击返回首页</a></section>';
		$('body').css('font-size','2em');
		$('body').html($emptyPage);
	}
});