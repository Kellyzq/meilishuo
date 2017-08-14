//设置根节点字体大小为页面宽度的1/15
window.onload=function(){
	var html = document.documentElement;
	var hWidth = html.getBoundingClientRect().width;
	html.style.fontSize = hWidth / 15 + "px";
}
$(function(){
	//返回历史上一页
	$('.shoppingCartNav i').bind('touchstart',function(){
		history.go(-1);
	});
	//判定登录状态
	ifLogin();
	if(ifLogin()=='codeError'){
		window.open('login.html','_self');
	}
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
//	判断全选
	function isAllChecked(){
	    var selected=0;
	    for (var i=0;i<$('.goods_list').find('input').length;i++){
	        if($('.goods_list').find('input').eq(i).is(':checked')){	
	        	selected+=1;
		    }
		}
	    if(selected==$('.goods_list').find('input').length){
	        $('.goods_total').find('input').prop('checked',true);
		}else{
	    	$('.goods_total').find('input').prop('checked',false);
	    }
	}
	//总价更新
	function totalUpDate(){
		var totalGoodsAmount = 0;
		var totalCost = 0;
		if ($('.goods_list').find('input').is(':checked')) {
			$('.settle_account').css('display', 'inline-block');
		} else {
			$('.settle_account').css('display', 'none');
			$('.total_cost').find('i').html('￥0.00');
		}
		$('.goods_list>ul>li').each(function() {
			var eqIndex = $(this).index();
			var thisGoodsAmount = 0;
			var thisCost = 0;
			if ($('.goods_list>ul>li').eq(eqIndex).find('input').is(':checked')) {
				thisGoodsAmount = parseFloat($('.goods_list>ul>li').eq(eqIndex).find('.goods_inf_num').text());
//				console.log(thisGoodsAmount)
				thisCost = (parseFloat($('.goods_list>ul>li').eq(eqIndex).find('.goods_inf_price>i').text().substring(1)) * thisGoodsAmount);
//				console.log(thisCost)
				totalGoodsAmount = totalGoodsAmount + thisGoodsAmount;
				totalCost = parseFloat(totalCost) + thisCost;
				$('.total_cost').find('i').eq(0).html('￥'+totalCost.toFixed(2));
				$('.settle_account').html('('+totalGoodsAmount+')');
			}
		});
	}
	//商品存在与否时页面的变化
	function goodsExistsOrNot(){
		if ($('.goods_list>ul>li').length>0) {
			$('.shoppingCartNav').find('a').attr('href','javascript:;');
			$('.shoppingCartNav').find('a').html('删除');
			$('.shoppingCartEmpty').css('display','none');
			$('.goods_total').css('display','block');
			$('.shoppingCartNav').find('a').bind('touchstart',touchstartNav=function(){
				for (var i=$('.goods_list>ul>li').length-1;i>=0;i--) {
					if ($('.goods_list>ul>li').eq(i).find('input').is(':checked')) {
						updataGoodsInfDel($('.goods_list>ul>li').eq(i));
						$('.goods_list>ul>li').eq(i).remove();
						goodsExistsOrNot();
						refreshContrl();
					}
				}
			});
			$('.shoppingCartNav').find('a').bind('touchend',touchendNav=function(){
				return;
			});
		}else{
			$('.shoppingCartNav').find('a').html('首页');
			$('.shoppingCartEmpty').css('display','block');
			$('.goods_total').css('display','none');
			$('.shoppingCartNav').find('a').bind('touchstart',touchstartNav=function(){
				return;
			});
			$('.shoppingCartNav').find('a').bind('touchend',touchendNav=function(){
				setTimeout(function(){
					$('.shoppingCartNav').find('a').attr('href','index.html');
				},300);
			});
		}
	}
	//更新商品数量上传数据库
	function updataGoodsInfNum($obj) {
		db.transaction(function(contex) {
			//从goodsinf中历遍所有title==$('.thumbnail_title').html()的数据
			contex.executeSql(
				'select * from goodsinf where title="' +
				$obj.find('.goods_inf_title').text() +
				'" and color="' + $obj.find('.goods_inf_color').text().substring(3) +
				'" and size="' + $obj.find('.goods_inf_size').text().substring(3) + 
				'" and user="' + getCookie('login') + 
				'"', [],
				function(con, data) {
					//获取所得匹配title值的行的数量
					var len = data.rows.length;
					//console.log(con);
					//console.log(data);
					//console.log(len);
					//如果有匹配title值的行
					if(len > 0) {
						//修改该行商品数量
						contex.executeSql(
							'update goodsinf set num="' +
							parseInt($obj.find('.goods_inf_num').eq(0).text()) +
							'" where title="' +
							$obj.find('.goods_inf_title').text() +
							'" and color="' + $obj.find('.goods_inf_color').text().substring(3) +
							'" and size="' + $obj.find('.goods_inf_size').text().substring(3) +
							'" and user="' + getCookie('login') + 
							'"'
						);
					}
				}
			);
		});
	}
	//更新删除商品上传数据库
	function updataGoodsInfDel($obj) {
		db.transaction(function(contex) {
			//从goodsinf中历遍所有title==$('.thumbnail_title').html()的数据
			contex.executeSql(
				'select * from goodsinf where title="' +
				$obj.find('.goods_inf_title').text() +
				'" and color="' + $obj.find('.goods_inf_color').text().substring(3) +
				'" and size="' + $obj.find('.goods_inf_size').text().substring(3) + 
				'" and user="' + getCookie('login') + 
				'"', [],
				function(con, data) {
					//获取所得匹配title值的行的数量
					var len = data.rows.length;
					//console.log(con);
					//console.log(data);
					//console.log(len);
					//如果有匹配title值的行
					if(len > 0) {
						//修改该行商品数量
						contex.executeSql(
							'delete from goodsinf where title="' +
							$obj.find('.goods_inf_title').text() +
							'" and color="' + $obj.find('.goods_inf_color').text().substring(3) +
							'" and size="' + $obj.find('.goods_inf_size').text().substring(3) +
							'" and user="' + getCookie('login') + 
							'"'
						);
					}
				}
			);
		});
	}
	refreshContrl();
	//刷新各按钮、选框的控制
	function refreshContrl(){
		goodsExistsOrNot();
		totalUpDate();
		//全选框
		$('.goods_total').find('input').click(function(){
			$('input').prop('checked',this.checked);
			totalUpDate();
		});
		//单选框
		$('.goods_list').find('input').click(function(){
			isAllChecked();
			totalUpDate();
		});
		//历遍商品列表li,每个li自身的'.minus'和'.plus'控制'.goods_inf_num'数量
		$('.goods_list>ul>li').each(function() {
			//减少商品数量
			function goodsminus(){
				var iNum=parseFloat($('.goods_list>ul>li').eq(eqIndex).find('.goods_inf_num').eq(0).text());
				iNum-=1;
				if (iNum==0) {
					alertInf('数量不能少于1','#ffffff','#000000',1);
					return;
				}else{
					$('.goods_list>ul>li').eq(eqIndex).find('.goods_inf_num').eq(0).html(iNum);
				}
				totalUpDate();
//				console.log($('.goods_inf_title').text());
//				console.log($('.goods_inf_color').text().substring(3));
//				console.log($('.goods_inf_size').text().substring(3));
				updataGoodsInfNum($('.goods_list>ul>li').eq(eqIndex));
			}
			//增加商品数量
			function goodsplus(){
				var iNum=parseFloat($('.goods_list>ul>li').eq(eqIndex).find('.goods_inf_num').eq(0).text());
				iNum+=1;
				$('.goods_list>ul>li').eq(eqIndex).find('.goods_inf_num').eq(0).html(iNum);
				totalUpDate();
				updataGoodsInfNum($('.goods_list>ul>li').eq(eqIndex));
			}
			var eqIndex=$(this).index();
			$('.goods_list>ul>li').eq(eqIndex).find('.minus').eq(0).unbind();
			$('.goods_list>ul>li').eq(eqIndex).find('.minus').eq(0).bind('touchstart',goodsminus);
			$('.goods_list>ul>li').eq(eqIndex).find('.plus').eq(0).unbind();
			$('.goods_list>ul>li').eq(eqIndex).find('.plus').eq(0).bind('touchstart',goodsplus);
		});
		//倒序历遍商品列表li,每个li自身的删除按钮删除自身
		for (var j=$('.goods_list>ul>li').length-1;j>=0;j--) {
			(function(i){
				//删除商品
				function goodsdel(){
					updataGoodsInfDel($('.goods_list>ul>li').eq(i));
					$('.goods_list>ul>li').eq(i).remove();
					totalUpDate();
					goodsExistsOrNot();
					refreshContrl();
				}
				$('.goods_list>ul>li').eq(i).find('.goods_inf_price>b').eq(0).unbind();
				$('.goods_list>ul>li').eq(i).find('.goods_inf_price>b').eq(0).bind('touchstart',goodsdel);
			})(j)
		}
	}
	db.transaction(function(contex){
		contex.executeSql('select * from goodsinf where user="'+getCookie('login')+'"',[],function(con,data){
			if (data.rows.length==0) {
				$('.shoppingCartEmpty').css('display','block');
				$('.goods_total').css('display','none');
				return;
			}
			$goodsList = '';
			for (var i=0;i<data.rows.length;i++) {
//				console.log(data.rows)
				$goodsList+='<li><label><input type="checkbox" checked="checked"/><span></span></label><img class="goods_inf_img" src="'
				+data.rows[i].img+'"/><div class="goods_inf_con"><p class="goods_inf_title">'
				+data.rows[i].title+'</p><p><span class="goods_inf_color">颜色：'
				+data.rows[i].color+'</span><span class="goods_inf_size">尺码：'
				+data.rows[i].size+'</span></p><ol><li class="minus"></li><li class="goods_inf_num">'
				+data.rows[i].num+'</li><li class="plus"></li></ol></div><div class="goods_inf_price"><i>'
				+data.rows[i].specialPrice+'</i><del>'
				+data.rows[i].originPrice+'</del><b></b></div></li>';
			}
//			console.log($goodsList);
//			console.log($('.goods_list ul'));
			$('.goods_list ul').append($goodsList);
			refreshContrl();
		});
	});
});