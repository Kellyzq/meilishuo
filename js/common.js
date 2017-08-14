function view() {
	return {
		w: document.documentElement.clientWidth,
		h: document.documentElement.clientHeight
	};
}
$(function(){
	//判定登录状态
	ifLogin();
	//获取页面的高度给搜索列表
	$('.search_list').height(view().h);
	
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
});
