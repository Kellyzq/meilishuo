window.onload = function(){
	var html = document.documentElement;
	var hwidth = html.getBoundingClientRect().width;
	html.style.fontSize = hwidth / 15 + 'px';
}

$(function(){
	//判定登录状态
	ifLogin();
	$.ajax({
		type: "get",
		url: "https://simba-api.meilishuo.com/venus/mce/v1/urlChange/pc?pid=20783&channel=wap&page=1&pageSize=30&_=" + new Date().getTime(),
		dataType: 'jsonp',
		jsonp: 'callback',
		async: true,
		success: function jsonp1(str) {
			console.log(str.value);
			$bg_list = '';
			for(var i=0;i<str.value.length;i++){
				$bg_list += '<li><a href="'+str.value[i].link+'"><div class="pic"><img src="'+str.value[i].image+'"/></div><b>'+str.value[i].title+'</b></a></li>'
			}
			$('.rec_show').append($bg_list);
		}
	});
});
