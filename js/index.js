function view() {
	return {
		w: document.documentElement.clientWidth,
		h: document.documentElement.clientHeight
	};
}
window.onload = function() {
	var html = document.documentElement;
	var hwidth = html.getBoundingClientRect().width;
	html.style.fontSize = hwidth / 15 + 'px';
		
	//轮播图
	var oImglist = document.getElementById('imglist');
	var oBtn = document.querySelector('.btn');
	var aBtns = oBtn.getElementsByTagName('li');
		
	var iNow =0;//第几张
	var iScroll = 0;//滚动距离
	var iStartx = 0;//初始位置
	var iStartScroll = 0;//初始滚动距离
	var iW = view().w//屏幕的宽度
	var timer = null;
	auto();
	function auto(){
		timer = setInterval(function(){
			iNow++;
			iNow = iNow%aBtns.length;
			tab();
		},3000);
	}
	function tab(){
		iScroll = -iNow*iW;
		oImglist.style.webkitTransition = '0.5s';
		oImglist.style.webkitTransform = 'translateX('+iScroll+'px)';
		//按钮跟着切换
		for(var i=0;i<aBtns.length;i++){
			aBtns[i].className = '';
		}
		aBtns[iNow].className = 'btnactive';
	}
	//手指按下的时候，停止定时器，获取手指坐标
	oImglist.addEventListener('touchstart',fnstart,false);
	//手指滑动时，拿到手指的新坐标，计算差值
	oImglist.addEventListener('touchmove',fnmove,false);
	//手指弹起的时候，判断已经拖动多少，如果超过30%就切换到下一张，否则切换到上一张
	oImglist.addEventListener('touchend',fnend,false);
	//清除默认事件
		
	function fnstart(ev){
		clearInterval(timer);
		iStartx = ev.changedTouches[0].pageX;
		iStartScroll = iScroll;
	}
	function fnmove(ev){
		var dix = ev.changedTouches[0].pageX - iStartx;
		iScroll = iStartScroll+dix;
		oImglist.style.webkitTransition = '0.5s';
		oImglist.style.webkitTransform = 'translateX('+iScroll+'px)';
	}
	function fnend(ev){
		var dix = ev.changedTouches[0].pageX - iStartx;
		iScroll = iStartScroll+dix;
		iNow = -iScroll/iW;
		iNow = (iNow-parseInt(iNow))>0.3?Math.ceil(iNow):Math.floor(iNow);
		if(iNow<0){
			iNow = 0
		}else if(iNow>aBtns.length-1){
			iNow = aBtns.length-1;
		}
		iScroll = -iNow*iW;
		oImglist.style.webkitTransition = '0.5s';
		oImglist.style.webkitTransform = 'translateX('+iScroll+'px)';
		tab();
		auto();
	}
	
	//轮播拖拽
	var lblist = document.querySelector('.list_con');
	//手指按下时获取手指坐标
	lblist.addEventListener('touchstart',fnlstart,false);
	//手指滑动时拿到手指的坐标，计算差值
	lblist.addEventListener('touchmove',fnlmove,false);
	
	function fnlstart(ev){
		var ev = ev || window.event;
		iStartx = ev.changedTouches[0].pageX;
		iStartScroll = iScroll;
	}
	
	function fnlmove(ev){
		var ev = ev || window.event;
		var dis = ev.changedTouches[0].pageX - iStartx;
		iScroll = iStartScroll + dis;

		if(iScroll<=window.screen.width*2+60-lblist.clientWidth){
			iScroll=window.screen.width*2+60-lblist.clientWidth;
		}else if (iScroll>=0) {
			iScroll=0;
		}
		lblist.style.left = iScroll + 'px';
	}
	
	//学院风轮播拖拽
	var goodsList = document.querySelectorAll('.goods_wrap');
	
	/*
	 * 已经可以了
	 */
	for (var k=0;k<goodsList.length;k++) {
		(function(i){
			
			goodsList[i].addEventListener('touchstart',fngstart,false);
			//手指滑动时拿到手指的坐标，计算差值
			goodsList[i].addEventListener('touchmove',fngmove,false);
			
			function fngstart(ev){
				var ev = ev || window.event;
				iStartx = ev.changedTouches[0].pageX;
				iStartScroll = iScroll;
			}
			
			function fngmove(ev){
				var ev = ev || window.event;
				var dis = ev.changedTouches[0].pageX - iStartx;
				iScroll = iStartScroll + dis;
		
				if(iScroll<=window.screen.width*2+goodsList[i].children.length*4-goodsList[i].clientWidth){
					iScroll=window.screen.width*2+goodsList[i].children.length*4-goodsList[i].clientWidth;
				}else if (iScroll>=0) {
					iScroll=0;
				}
				goodsList[i].style.left = iScroll + 'px';
			}
		})(k);
		
	}
	
		
	//限时特惠倒计时
	var t='12';
//	console.log(t.split(''));
	setInterval(function(){
		var times = document.querySelectorAll('.time');
		var now = new Date();
		var hours = now.getHours();
		var oldTime = new Date();
		oldTime.setHours(24);
		oldTime.setMinutes(0);
		oldTime.setSeconds(0);
		oldTime.setMilliseconds(0);
		var countDown = oldTime - now;
		var cHours = parseInt(countDown/3600000);
		if(cHours<10){
			times[0].innerHTML = 0;
			times[1].innerHTML = cHours;
		}else{
			cHours+='';
			cHours=cHours.split('');
			times[0].innerHTML = cHours[0];
			times[1].innerHTML = cHours[1];
		}
		var cMintues = parseInt((countDown%3600000)/60000);
			if(cMintues<10){
				times[2].innerHTML = 0;
				times[3].innerHTML = cMintues;
			}
			else{
				cMintues+='';
				cMintues=cMintues.split('');
				times[2].innerHTML = cMintues[0];
				times[3].innerHTML = cMintues[1];
			}
		var cSeconds = parseInt(((countDown%3600000)%60000)/1000);
			if(cSeconds<10){
				times[4].innerHTML = 0;
				times[5].innerHTML = cSeconds;
			}
			else{
				cSeconds+='';
				cSeconds=cSeconds.split('');
				times[4].innerHTML = cSeconds[0];
				times[5].innerHTML = cSeconds[1];
			}
		var cMill=countDown+'';
		cMill=cMill.split('');
			if(countDown<100){
				times[6].innerHTML = 0;
				if (cMill[6]) {
					times[7].innerHTML=cMill[6];
				} else{
					times[7].innerHTML=0;
				}
			}else{
				times[6].innerHTML = cMill[5];
				times[7].innerHTML = cMill[6];
			}
	},1);
	
	
}
//搜索列表的固定数据获取
$(function(){
	//选项卡
	var goodsType=0;//切换类型下标
	var page=1;//第几页
	var isloading=true;//正在读取
	
	//获取页面的高度给搜索列表
	$('.search_list').height(view().h);
	//ajax调用数据给搜索列表的固定值
	$.ajax({
		type: "get",
		url: "http://mce.mogucdn.com/jsonp/multiget/3?pids=5868%2C6348%2C20114%2C13730%2C42287",
		dataType: 'jsonp',
		jsonp: 'callback',
		async: true,
		success: function jsonp5868_6348_20114_13730_42287(str) {
			//console.log(str.data['5868'].list);
			//拿到数据循环输出给ul
			$html = '';
			for (var i = 0; i < str.data['5868'].list.length; i++) {
				$div = '<li><a href="http://act.meilishuo.com/wap/search?keyword=' + str.data['5868'].list[i].words + '">' + str.data['5868'].list[i].words + '</a></li>';
				$html += $div;
			}
			$('.list').append($html);
			//获取所有li的宽度赋给ul
			$('#imglist').css('width',100*str.data['20114'].list.length+'%');
			//获取li的宽度
			$('#imglist li').css('width',100/str.data['20114'].list.length+'%');
			$btnlist = '';
			$carsour = '';
			for (var i = 0; i < str.data['20114'].list.length; i++) {
				$carsour+= '<li><a href="'+str.data['20114'].list[i].link+'"><img src="'+str.data['20114'].list[i].image+'"/></a></li>';
				$btnlist += '<li></li>';
			}
			$('#imglist').append($carsour);
			$('.btn').append($btnlist);
			$('.btn li').eq(0).addClass('btnactive');
			
			//热销单品区获取数据
			$hotlist = '';
			for(var i=0;i<str.data['13730'].list.length;i++){
				$hotlist += '<li class="item"><a href="'+str.data['13730'].list[i].link+'"><p class="pic"><img src="'+str.data['13730'].list[i].image+'"/></p><p class="title">'+str.data['13730'].list[i].title+'</p></a></li>';
				
			}
			$('.box_list').append($hotlist);
			
			//拖拽区商品获取
			$lblist = '';
			for(var i=0;i<str.data['42287'].list.length;i++){
				$lblist += '<li><a href="'+str.data['42287'].list[i].item_h5_url+'" class="index_goods"><div class="pic"><img src="'+str.data['42287'].list[i].image+'" alt="" /><p>仅剩'+str.data['42287'].list[i].itemInventory+'件</p></div><div class="inf"><p>￥'+str.data['42287'].list[i].discountPrice+'<del>'+str.data['42287'].list[i].price+'</del></p><button>立即抢购</button></div></a></li>';
			}
			$('.list_con').append($lblist);
			$('.list_con').css('width',(str.data['42287'].list.length)*30+'%');
			$('.item').eq(1).find('a').attr('href','master.html');
		},
		error: function() {
			console.log('失败')
		}
	});
	
	//好物，学院风。。
	
	$.ajax({
		type: "get",
		url: "https://simba-api.meilishuo.com/venus/topic/v2/queryTopicList/h5",
		dataType: 'jsonp',
		jsonp: 'callback',
		async: true,
		success: function jsonp1(str) {
			//学院风
			$xylist = '<a href="'+str.data[0].originUrl+'"><img src="'+str.data[0].image+'"/></a>';
			$('.xueyuan').append($xylist);
			//荷叶
			$hylist = '<a href="'+str.data[1].originUrl+'"><img src="'+str.data[1].image+'"/></a>';
			$('.heye').append($hylist);
			//夏日海滩
			$teachlist = '<a href="'+str.data[2].originUrl+'"><img src="'+str.data[2].image+'"/></a>';
			$('.teach').append($teachlist);
			
			//学院风下的数据获取
			$goods1 = '';
			for(var i=0;i<str.data[0].goodsList.length;i++){
				$goods1 +='<li><a href="'+str.data[0].goodsList[i].wapGoodUrl+'" class="index_goods"><div class="pic"><img src="'+str.data[0].goodsList[i].image+'"/></div><p class="title">'+str.data[0].goodsList[i].title+'</p><p class="price">￥'+str.data[0].goodsList[i].price+'</p></a></li>';
			}
			$('.goods1_list').append($goods1);
			$('.goods1_list').css('width',(str.data[0].goodsList.length)*30+'%');
			
			//荷叶边
			$goods2 = '';
			for(var i=0;i<str.data[1].goodsList.length;i++){
				$goods2 +='<li><a href="'+str.data[1].goodsList[i].wapGoodUrl+'" class="index_goods"><div class="pic"><img src="'+str.data[1].goodsList[i].image+'"/></div><p class="title">'+str.data[1].goodsList[i].title+'</p><p class="price">￥'+str.data[1].goodsList[i].price+'</p></a></li>';
			}
			$('.goods2_list').append($goods2);
			$('.goods2_list').css('width',(str.data[1].goodsList.length)*30+'%');
			
			//夏日海滩
			//荷叶边
			$goods3 = '';
			for(var i=0;i<str.data[2].goodsList.length;i++){
				$goods3 +='<li><a href="'+str.data[2].goodsList[i].wapGoodUrl+'" class="index_goods"><div class="pic"><img src="'+str.data[2].goodsList[i].image+'"/></div><p class="title">'+str.data[2].goodsList[i].title+'</p><p class="price">￥'+str.data[2].goodsList[i].price+'</p></a></li>';
			}
			$('.goods3_list').append($goods3);
			$('.goods3_list').css('width',(str.data[2].goodsList.length)*30+'%');
		},
		error: function() {
			console.log('失败')
		}
	});
	
	
	//点击搜索框显示搜索列表
	$('.search_input').focus(function() {
		//搜索框获取焦点时显示搜索列表
		$('.search_list').css('visibility', 'visible');
		$('.search_list').height(view().h - $('#header').height());
		//显示搜索列表时，头部按钮改变文字为取消
		$('.right_btn').html('取消');
		$('.right_btn').css('color', '#666666');
		$('.right_btn').addClass('active');
	});
	//点击取消按钮，隐藏搜索列表
	//判断按钮的内容是搜索还是取消，默认取消为false
	var tue = false;
	$('.right_btn').bind('touchstart', function(){
		//手指点击取消按钮，搜索列表隐藏
		$('.list_wrap').hide();
		//如果按钮为搜索时，点击搜索按钮可以搜索
		if (tue) {
			//先清空已经获取的列表项，然后再重新获取添加到ul
			$('.list_wrap').html('');
			window.open('http://act.meilishuo.com/wap/search?keyword='+$('.search_input').val(),'_self');
			$('.search_input').val('');
		} 
		//如果是取消，隐藏搜索列表
		else {
			$('.search_list').css('visibility', 'hidden');
			$('.right_btn').html('');
			$('.right_btn').removeClass('active');
		}

	});

	//搜索框内容改变，获取相对应的数据	
	$('.search_input').bind('input', function() {
		$('.list_wrap').html('');
		if ($(this).val().length != 0) {
			tue = true;
			$('.list_wrap').show();
			$('.right_btn').html('搜索');
			$('.right_btn').css('color', '#FF3366');
			$('.search_wrap').hide();
			$.ajax({
				type: "get",
				url: "https://search.mogujie.com/jsonp/searchTipsMLS/1?data=%7B%22keyword%22%3A%22" + $('.search_input').val() + "%22%7D&_=" + new Date().getTime(),
				dataType: 'jsonp',
				jsonp: 'callback',
				async: true,
				success: function jsonp6(str) {
					var title = str.data.tips;
					$results = '';
					$len = title.length;
					if ($len > 10) {
						$len = 10;
					}
					for (var i = 0; i < $len; i++) {
						$results += '<li><a href="http://act.meilishuo.com/wap/search?keyword='+str.data.tips[i].title+'">' + str.data.tips[i].title + '</a></li>';
					}
					$('.list_wrap').append($results);
					$('.list_wrap li').bind('touchstart', function() {
							$('.search_input').val('');
						setTimeout(function(){
//							var val = $(this).children('a').html();
//							$('.search_input').val(val);
							$('.list_wrap').html('');
							$('.right_btn').html('搜索');
						},300);
					});
				},
				error: function() {
					console.log('失败')
				}
			});

		} else {
			$('.list_wrap').hide();
			$('.search_wrap').show();
			tue = false;
			$('.right_btn').html('取消');
			$('.right_btn').css('color', '#666666');
		}
	});
	
	
	//选项卡颜色改变，切换类型
	$('.mod_row ul li').bind('touchstart', function() {
		$('.mod_row ul li').find('span').removeClass('mod_active');
		goodsType=$(this).index();
		$(this).find('span').addClass('mod_active');
		isloading=false;
		setTimeout(function(){
			$('.img_wrap').html('');
			goodsTypeLoading();
		},300);
	});
	//读取商品列表
	goodsTypeLoading();
	//页面滚动，固定选项卡
	$(window).bind('scroll',function(){
		var oTop=$(window).scrollTop();
		var oNavTop=$('.mod').offset().top;
		var upDatePageTop=$(document).height()-$(window).height()-$('.img_wrap a').outerHeight();
		if (oTop>=upDatePageTop) {
			//判定商品是否在读取，读取就为false
			if (isloading) {
				isloading=false;
				page+=1;
				goodsTypeLoading();
			}
		}
		//返回顶部，固定选项卡
		if (oTop>=oNavTop) {
			$('.mod_row').css('position','fixed');
			$('.totop').show();
		} else{
			$('.mod_row').css('position','static');
			$('.totop').hide();
		}
	})
	//返回顶部
	$('.totop').bind('touchstart',function(){
		$('body').stop().animate({scrollTop:0},500);
		return false;
	});
	//读取商品列表
	function goodsTypeLoading(){
		if (goodsType==0) {
			$.ajax({
				type: "get",
				url: "http://list.meilishuo.com/search?frame="+page+"&page="+page+"&cKey=wap-index&tag=&maxPrice=&minPrice=&fcid=&_mgjuuid=c390c4f3-6e9f-4a6a-8e9e-a9f6daea2e5d&sort=pop&_=" + new Date().getTime(),
				dataType: 'jsonp',
				jsonp: 'callback',
				async: true,
				success: function jsonp2(str) {
//					console.log(str)
		
					$goods_list = '';
					for(var i=0;i<str.data.list.length;i++){
						$goods_list +='<a href="'+str.data.list[i].link+'"><p class="pic"><img src="'+str.data.list[i].show.img+'"/><span class="icon"><img src="'+str.data.list[i].leftbottom_taglist+'"/></span></p><p class="title">'+str.data.list[i].title+'</p><p class="inf"><span class="price">'+str.data.list[i].price+'</span><span class="sc">'+str.data.list[i].cfav+'</span></p></a>';
					}
					$('.img_wrap').append($goods_list);
					//读取完成为true
					isloading=true;
				},
				error: function() {
					console.log('失败')
				}
			});
		} else if (goodsType==1) {
			$.ajax({
				type: "get",
				//http://list.meilishuo.com/search?frame=1&page=1&cKey=wap-index&tag=&maxPrice=&minPrice=&fcid=&_mgjuuid=c390c4f3-6e9f-4a6a-8e9e-a9f6daea2e5d&sort=pop&_=1498044051268&callback=jsonp2
				
				url: "http://list.meilishuo.com/search?frame="+page+"&page="+page+"&cKey=wap-index&tag=&maxPrice=&minPrice=&fcid=&_mgjuuid=29aa8c4c-9b01-4a86-a673-249c39afdd75&sort=new&_=" + new Date().getTime(),
				dataType: 'jsonp',
				jsonp: 'callback',
				async: true,
				success: function jsonp5(str) {
					console.log(str)
		
					$goods_list = '';
					for(var i=0;i<str.data.list.length;i++){
						$goods_list +='<a href="'+str.data.list[i].link+'"><p class="pic"><img src="'+str.data.list[i].show.img+'"/><span class="icon"><img src="'+str.data.list[i].leftbottom_taglist+'"/></span></p><p class="title">'+str.data.list[i].title+'</p><p class="inf"><span class="price">'+str.data.list[i].price+'</span><span class="sc">'+str.data.list[i].cfav+'</span></p></a>';
					}
					$('.img_wrap').append($goods_list);	
					isloading=true;
				},
				error: function() {
					console.log('失败')
				}
			});
		}
		else if(goodsType==2){
			$.ajax({
				type: "get",
				url: "http://list.meilishuo.com/search?frame="+page+"&page="+page+"&cKey=wap-index&tag=&maxPrice=&minPrice=&fcid=&_mgjuuid=29aa8c4c-9b01-4a86-a673-249c39afdd75&sort=sell&_=" + new Date().getTime(),
				dataType: 'jsonp',
				jsonp: 'callback',
				async: true,
				success: function jsonp11(str) {
					console.log(str)
		
					$goods_list = '';
					for(var i=0;i<str.data.list.length;i++){
						$goods_list +='<a href="'+str.data.list[i].link+'"><p class="pic"><img src="'+str.data.list[i].show.img+'"/><span class="icon"><img src="'+str.data.list[i].leftbottom_taglist+'"/></span></p><p class="title">'+str.data.list[i].title+'</p><p class="inf"><span class="price">'+str.data.list[i].price+'</span><span class="sc">'+str.data.list[i].cfav+'</span></p></a>';
					}
					$('.img_wrap').append($goods_list);	
					isloading=true;
				},
				error: function() {
					console.log('失败')
				}
			});
		}
	}
	//导航切换
//	var oF = document.getElementsByClassName('footer')[0];
//	var oA = oF.getElementsByTagName('a');
//	for(var i=0;i<oA.length;i++){
//		oA[i].addEventListener('touchstart',function(){
//			for
//		},false);
//	}

//	$('.footer a').bind('touchstart',function(){
//		$('.footer a span').removeClass("f_active");
//		$(this).find('span').addClass("f_active");
//	});
	ifLogin();
});