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
	 * 2.page：瀑布流添加新页面参数
	 * 3.读取瀑布流过程开关变量
	 */
	var goodsType=0;
	var page=1;
	var isloading=true;
	//推荐商品列表
	$.ajax({
		type: "get",
		url: "http://mce.mogucdn.com/jsonp/multiget/3?pids=51331",
		async: true,
		dataType: 'jsonp',
		jsonp: 'callback',
		success: function jsonp51331(str) {
			$recommend_goodsList = '';
			for (var i = 0; i < str.data['51331'].list.length; i++) {
				$recommend_goodsList += '<a class="goods master_recommend_goods" href="goodsDetail.html"><p class="master_recommend_goods_img"><img src="'+str.data['51331'].list[i].image+'"/</p><p class="master_recommend_goods_price"><span></span><i>￥' + str.data['51331'].list[i].price + '</i></p><p class="master_recommend_goods_title"><b>' + str.data['51331'].list[i].title + '</b></p></a>';
			}
			$('.master_recommend_goodsList').append($recommend_goodsList);
			goodsOnclick();
		},
		error: function() {
			console.log('失败');
		}
	});
	/*
	 * 切换商品列表的按钮绑定'touchstart'事件
	 * 1.移出其他按钮的'active' ClassName,当前按钮添加'active' ClassName
	 * 2.获取当前按钮下标赋给goodsType,用于切换商品类型
	 * 3.读取瀑布流过程开关变量,改为false,即正在读取
	 * 4.重置页面为第一页开始的参数
	 * 5.清空页面内容,并添加新的页面数据,由于变量生效瞬间会直接触发window的scroll事件,
	 * 	  所以设置300毫秒的读取时间,进行缓冲
	 */
	$('.master_type_nav ul li').bind('touchstart', function() {
		$('.master_type_nav ul li').removeClass('active');
		$(this).addClass('active');
		goodsType=$(this).index();
		isloading=false;
		page=1;
		setTimeout(function(){
			$('.master_type_goodsList').html('');
			goodsTypeLoading();
		},300);
	});
	/*
	 * 屏幕滚动事件，达到页面底部刷新下一页数据
	 * 到达导航栏高度时导航栏改为固定定位,并显示返回顶部
	 */
	$(window).bind('scroll',function(){
		var oTop=$(window).scrollTop();
		var oNavTop=$('.master_type_nav_bg').offset().top;
		var upDatePageTop=$(document).height()-$(window).height()-$('.master_type_goodsList a').outerHeight();
		if (oTop>=upDatePageTop) {
			if (isloading) {
				isloading=false;
				page+=1;
				goodsTypeLoading();
			}
		}
		if (oTop>=oNavTop) {
			$('.master_type_nav').css('position','fixed');
			$('.totop').show();
		} else{
			$('.master_type_nav').css('position','static');
			$('.totop').hide();
		}
	})
	//返回顶部
	$('.totop').bind('touchstart',function(){
		$('body').stop().animate({scrollTop:0},500);
		return false;
	});
	goodsTypeLoading();
	//按商品类型变量值、页面参数、刷新商品列表
	function goodsTypeLoading(){
		if (goodsType==0) {
			$.ajax({
				type: "get",
				url: "https://list.meilishuo.com/search?frame="+page+"&page="+page+"&cKey=wap-cate&tag=&fcid=10063407&imgSize=220x330&sort=pop&_="+new Date().getTime(),
				async: true,
				dataType: 'jsonp',
				jsonp: 'callback',
				success: function jsonp1(str) {
//					console.log(str);
//					console.log(str.data.list);
					if (str.length==0) {
						return;
					}
					$goodsTypeList = '';
					for (var i = 0; i < str.data.list.length; i++) {
						$goodsTypeList += '<a class="goods master_type_goods" href="goodsDetail.html"><p class="master_type_goods_img"><img src="'
						+str.data.list[i].showLarge.img+'"/></p><p class="master_type_goods_title"><b>'+str.data.list[i].title
						+'</b></p><p class="master_type_goods_price"><i>'+str.data.list[i].price+'</i><del>'+str.data.list[i].orgPrice+'</del></p></a>';
					}
					$('.master_type_goodsList').append($goodsTypeList);
					for (var i = 0; i < $('.master_type_goodsList a').length; i++) {
						(function(j){
							if ($('.master_type_goodsList a').eq(j).find('i').html()==$('.master_type_goodsList a').eq(j).find('del').html()) {
								$('.master_type_goodsList a').eq(j).find('del').html('');
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
				url: "https://list.meilishuo.com/search?frame="+page+"&page="+page+"&cKey=wap-cate&tag=&fcid=10063563&imgSize=220x330&sort=pop&_="+new Date().getTime(),
				async: true,
				dataType: 'jsonp',
				jsonp: 'callback',
				success: function jsonp2(str) {
					if (str.length==0) {
						return;
					}
					$goodsTypeList = '';
					for (var i = 0; i < str.data.list.length; i++) {
						$goodsTypeList += '<a class="goods master_type_goods" href="goodsDetail.html"><p class="master_type_goods_img"><img src="'
						+str.data.list[i].showLarge.img+'"/></p><p class="master_type_goods_title"><b>'+str.data.list[i].title
						+'</b></p><p class="master_type_goods_price"><i>'+str.data.list[i].price+'</i><del>'+str.data.list[i].orgPrice+'</del></p></a>';
					}
					$('.master_type_goodsList').append($goodsTypeList);
					for (var i = 0; i < $('.master_type_goodsList a').length; i++) {
						(function(j){
							if ($('.master_type_goodsList a').eq(j).find('i').html()==$('.master_type_goodsList a').eq(j).find('del').html()) {
								$('.master_type_goodsList a').eq(j).find('del').html('');
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