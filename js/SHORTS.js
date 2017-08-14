//设置根节点字体大小为页面宽度的1/15
window.onload=function(){
	var html = document.documentElement;
	var hWidth = html.getBoundingClientRect().width;
	html.style.fontSize = hWidth / 15 + "px";
}
$(function() {
	//判定登录状态
	ifLogin();
	/*
	 * 设定变量
	 * 1.goodsType：切换商品类型的下标变量
	 * 2.frame & page：瀑布流添加新页面参数
	 * 3.读取瀑布流过程开关变量
	 * 4.商品筛选按钮的开关变量
	 */
	var goodsType=0;
	var frame=0;
	var page=1;
	var isloading=true;
	var sortOpen=null;
	/*
	 * 切换商品列表的按钮绑定'touchstart'事件
	 * 1.移出其他按钮的'active' ClassName,当前按钮添加'active' ClassName
	 * 2.获取当前按钮下标赋给goodsType,用于切换商品类型
	 * 3.读取瀑布流过程开关变量,改为false,即正在读取
	 * 4.重置页面为第一页开始的参数
	 * 5.清空页面内容,并添加新的页面数据,由于变量生效瞬间会直接触发window的scroll事件,
	 * 	  所以设置300毫秒的读取时间,进行缓冲
	 */
	$('.SHORTS_nav ul li').bind('touchstart', function() {
		$('.SHORTS_nav ul li').removeClass('active');
		$(this).addClass('active');
		goodsType=$(this).index();
		isloading=false;
		frame=0;
		page=1;
		$('.SHORTS_type_goodsList').html('');
		setTimeout(function(){
			goodsTypeLoading();
		},300);
	});
	/*
	 * 分别设定价位的按钮，按下设定价位 并 触发价格筛选的函数
	 */
	$('.SHORTS_sort ol li').eq(0).bind('touchstart',function(){
		$('#maxPrice').val('30');
		$('#minPrice').val('0');
		sortSearch();
	});
	$('.SHORTS_sort ol li').eq(1).bind('touchstart',function(){
		$('#maxPrice').val('60');
		$('#minPrice').val('30');
		sortSearch();
	});
	$('.SHORTS_sort ol li').eq(2).bind('touchstart',function(){
		$('#maxPrice').val('10000');
		$('#minPrice').val('60');
		sortSearch();
	});
	/*
	 * 显示价位筛选的按钮，点击改变开关状态，显示和隐藏筛选的的面板
	 */
	$('.SHORTS_nav ul p').bind('touchstart', function() {
		if (sortOpen==null) {
			$(this).addClass('active');
			$(this).find('span').css('transform','rotateZ(90deg)');
			$('.SHORTS_sort').css('display','block');
			sortOpen=1;
		} else{
			$(this).removeClass('active');
			$(this).find('span').css('transform','rotateZ(-90deg)');
			$('.SHORTS_sort').css('display','none');
			sortOpen=null;
		}
	});
	//清空筛选值按钮
	$('#clearTxt').bind('touchstart',function(){
		$('#maxPrice').val('');
		$('#minPrice').val('');
	});
	//筛选按钮 触发价格筛选的函数
	$('#submitTxt').bind('touchstart',function(){
		sortSearch();
	});
	//价格筛选的函数
	function sortSearch(){
		isloading=false;
		$('.SHORTS_type_goodsList').html('');
		setTimeout(function(){
			goodsTypeLoading();
			$('.SHORTS_nav ul p').removeClass('active');
			$('.SHORTS_nav ul p').find('span').css('transform','rotateZ(-90deg)');
			$('.SHORTS_sort').css('display','none');
			sortOpen=null;
		},300);
	}
	/*
	 * 屏幕滚动事件，达到页面底部刷新下一页数据
	 * 显示返回顶部按钮
	 */
	$(window).bind('scroll',function(){
		var oTop=$(window).scrollTop();
		var upDatePageTop=$(document).height()-$(window).height()-$('.SHORTS_goodsList a').outerHeight();
		if (oTop>=upDatePageTop) {
			if (isloading) {
				isloading=false;
				page+=1;
				frame+=1;
				goodsTypeLoading();
			}
		}
		if (oTop>=600) {
			$('.totop').show();
		} else{
			$('.totop').hide();
		}
	})
	//返回顶部
	$('.totop').bind('touchstart',function(){
		$('body').stop().animate({scrollTop:0},500);
		return false;
	});
	goodsTypeLoading();
	//按商品类型变量值、页面参数、价格筛选、刷新商品列表
	function goodsTypeLoading(){
		if (goodsType==0) {
			$.ajax({
				type: "get",
				url: "http://list.meilishuo.com/search?frame="+frame+"&page="+page+"&sort=pop&cKey=wap-cate&tag=&maxPrice="+$('#maxPrice').val()+"&minPrice="+$('#minPrice').val()+"&wxPrice=&uq=&_mgjuuid=11aa63d5-56f7-45dc-8c54-f9f363211ea7&fcid=10063546&_="+new Date().getTime(),
				async: true,
				dataType: 'jsonp',
				jsonp: 'callback',
				success: function jsonp1(str) {
					if (str.length==0) {
						return;
					}
					$goodsTypeList = '';
					for (var i = 0; i < str.data.list.length; i++) {
						$goodsTypeList += '<a class="goods SHORTS_type_goods" href="goodsDetail.html"><p class="SHORTS_type_goods_img"><img src="'
						+str.data.list[i].showLarge.img+'"/><span class="SHORTS_type_goods_tag"><img src="'
						+str.data.list[i].leftbottom_taglist['0']+'"/></span></p><p class="SHORTS_type_goods_title"><b>'
						+str.data.list[i].title+'</b></p><p class="SHORTS_type_goods_price"><i>'
						+str.data.list[i].price+'</i><del>'+str.data.list[i].orgPrice
						+'</del></p><p class="SHORTS_type_goods_beBuy">'+str.data.list[i].sale+'人已购买'+'</p></a>';
					}
					$('.SHORTS_type_goodsList').append($goodsTypeList);
					for (var i = 0; i < $('.SHORTS_type_goods_price').length; i++) {
						(function(j){
							if ($('.SHORTS_type_goods_price').eq(j).find('i').html()==$('.SHORTS_type_goods_price').eq(j).find('del').html()) {
								$('.SHORTS_type_goods_price').eq(j).find('del').html('');
							}
						})(i);
					}
					for (var i = 0; i < $('.SHORTS_type_goods_tag').length; i++) {
						(function(j){
							if ($('.SHORTS_type_goods_tag').eq(j).find('img').attr('src')=='undefined') {
								$('.SHORTS_type_goods_tag').eq(j).find('img').remove();
							}
						})(i);
					}
					isloading=true;
					goodsOnclick();
				},
				error: function() {
					console.log('失败');
				}
			});
		} else if (goodsType==1) {
			$.ajax({
				type: "get",
				url: "http://list.meilishuo.com/search?frame="+frame+"&page="+page+"&sort=sell&cKey=wap-cate&tag=&maxPrice="+$('#maxPrice').val()+"&minPrice="+$('#minPrice').val()+"&wxPrice=&uq=&_mgjuuid=11aa63d5-56f7-45dc-8c54-f9f363211ea7&fcid=10063546&_="+new Date().getTime(),
				async: true,
				dataType: 'jsonp',
				jsonp: 'callback',
				success: function jsonp2(str) {
					if (str.length==0) {
						return;
					}
					$goodsTypeList = '';
					for (var i = 0; i < str.data.list.length; i++) {
						$goodsTypeList += '<a class="goods SHORTS_type_goods" href="goodsDetail.html"><p class="SHORTS_type_goods_img"><img src="'
						+str.data.list[i].showLarge.img+'"/><span class="SHORTS_type_goods_tag"><img src="'
						+str.data.list[i].leftbottom_taglist['0']+'"/></span></p><p class="SHORTS_type_goods_title"><b>'
						+str.data.list[i].title+'</b></p><p class="SHORTS_type_goods_price"><i>'
						+str.data.list[i].price+'</i><del>'+str.data.list[i].orgPrice
						+'</del></p><p class="SHORTS_type_goods_beBuy">'+str.data.list[i].sale+'人已购买'+'</p></a>';
					}
					$('.SHORTS_type_goodsList').append($goodsTypeList);
					for (var i = 0; i < $('.SHORTS_type_goods_price').length; i++) {
						(function(j){
							if ($('.SHORTS_type_goods_price').eq(j).find('i').html()==$('.SHORTS_type_goods_price').eq(j).find('del').html()) {
								$('.SHORTS_type_goods_price').eq(j).find('del').html('');
							}
						})(i);
					}
					for (var i = 0; i < $('.SHORTS_type_goods_tag').length; i++) {
						(function(j){
							if ($('.SHORTS_type_goods_tag').eq(j).find('img').attr('src')=='undefined') {
								$('.SHORTS_type_goods_tag').eq(j).find('img').remove();
							}
						})(i);
					}
					isloading=true;
					goodsOnclick();
				},
				error: function() {
					console.log('失败');
				}
			});
		}
	}
});