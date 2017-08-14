/**
 * @param {Object} $obj			需要进行轮播的对象
 * @param {Object} type			轮播的类型，目前只做了两种'slide'和'fade'
 * @param {Object} $valtime		轮播间隔的时间，毫秒为单位
 * 
 * 布局例子如下：
 * 要进行轮播的对象为：'.carouselfigure'
 * 
 *	<div class="carouselfigure">
 *		<div class="carouselfigure_mask">
 *			<ul>
 *				<li><a href=""><img src="img/fresh_banner0.jpg"/></a></li>
 *				<li><a href=""><img src="img/fresh_banner1.jpg"/></a></li>
 *				<li><a href=""><img src="img/fresh_banner2.jpg"/></a></li>
 *			</ul>
 *		</div>
 *		<ol class="carouselfigure_point">
 *			<li class="carouselfigure_point_on"></li>
 *			<li></li>
 *			<li></li>
 *		</ol>
 *		<div class="prev">
 *		</div>
 *		<div class="next">
 *		</div>
 *	</div>
 * 
 */

/*
 * 样式例子如下
 */
/*.carouselfigure {
	width: auto;
	height: 400px;
	margin: 0px auto;
	overflow: hidden;
	position: relative;
}

.carouselfigure .carouselfigure_mask {
	width: auto;
	height: 400px;
	overflow: hidden;
	position: relative;
}

.carouselfigure .carouselfigure_mask ul {
	position: absolute;
	left: 0;
	width: 1350px;
	height: 400px;
}

.carouselfigure .carouselfigure_mask ul li {
	width: auto;
	height: 400px;
	float: left;
}

.carouselfigure .carouselfigure_mask ul li img {
	width: auto;
	height: 400px;
}

.carouselfigure_point {
	position: absolute;
	width: 78px;
	height: 28px;
	background: url(../img/kaola_fade_btn3.png);
	left: 50%;
	bottom: 18px;
	padding-top: 9px;
	padding-left: 14px;
	box-sizing: border-box;
}

.carouselfigure_point li {
	cursor: pointer;
	width: 10px;
	height: 10px;
	background: url(../img/kaola_icon1.png) no-repeat -8px -2px;
	border-radius: 50%;
	float: left;
	margin-right: 10px;
}

.carouselfigure_point .carouselfigure_point_on {
	background: url(../img/kaola_icon1.png) no-repeat -28px -2px;
}

.carouselfigure .next,
.carouselfigure .prev {
	width: 34px;
	height: 68px;
	position: absolute;
	left: 127px;
	top: 166px;
	cursor: pointer;
	background: url(../img/kaola_icon1.png) no-repeat;
	background-position-x: -626px;
	background-position-y: -68px;
	opacity: 0;
	filter: alpha(opacity:0);
}
.carouselfigure .next {
	background-position-x: -670px;
	background-position-y: -68px;
	left: auto;
	right: 127px;
}

.carouselfigure .prev:hover{
	background-position-y: -153px;
}
.carouselfigure .next:hover{
	background-position-y: -154px;
}*/
/**
 * @param {Object} $obj					需要进行轮播的对象
 * @param {Object} type					轮播的类型,目前只做了两种'slide'和'fade'
 * @param {Object} $valtime				轮播间隔的时间,毫秒为单位
 */
function carouselfigure($obj,type,$valtime) {
	if (type=='slide') {
//		获取对象属性和调整对象属性
		$oUl = $obj.children().eq(0).children().eq(0);
		$oOl = $obj.children().eq(1);
		$oPrev = $obj.children().eq(2);
		$oNext = $obj.children().eq(3);
		$valWidth = $oUl.children().eq(0).outerWidth();
		$oUl.css('width',$valWidth*$oUl.children().size());
		$oUl.html($oUl.html() + $oUl.html());
		$oUl.outerWidth($oUl.outerWidth() + $oUl.outerWidth());
		$oUlW = $oUl.outerWidth() * .5;
//		console.log($oOl.children().eq(0).attr('class'));
		$oOlLOn = $oOl.children().eq(0).attr('class');
		$i = 0;
		$CFActive = 1;
//		轮播图内禁止选中文字图片
		$obj.mousedown(function(e){
			e=e||event;
			if (e.preventDefault) {
				e.preventDefault();
			} else{
				return false;
			}
		})
//		给每个圆点按钮添加事件，点击轮播图播放到对应图片
		for ($j = 0, $len = $oUl.children().length * .5; $j < $len; $j++) {
			(function($k) {
				$oOl.children().eq($k).click(function() {
					if ($i==$oOl.children().length) {
						$oUl.css('left',0);
					}
					$x = $k - $i;
					if ($x > 0) {
						next($x);
					} else if ($x < 0) {
						prev($x);
					}
				});
			})($j);
		}
//		改变圆点按钮的颜色
		function oCFChoosePoint($i, fn) {
			for ($q = 0, $len = $oOl.children().length; $q < $len; $q++) {
				$oOl.children().eq($q).attr('class', '');
			}
			$oOl.children().eq($i).attr('class', $oOlLOn);
			if ($i == $oOl.children().length) {
				$oOl.children().eq(0).attr('class', $oOlLOn);
			}
			if (fn) {
				fn();
			}
		}
//		自动播放
		$obj.$carouselfigureHandler = setInterval(function() {
			next();
		}, $valtime);
//		鼠标在轮播图上，if判断解决mouseover和mouseout的bug，停止播放，显示左右按钮
		$obj.mouseover(function() {
			$CFActive = 0;
			if ($CFActive == 0) {
				setTimeout(function() {
					if ($CFActive == 0) {
						$oPrev.stop().animate({
							opacity: 100
						}, 200);
						$oNext.stop().animate({
							opacity: 100
						}, 200);
						clearInterval($obj.$carouselfigureHandler);
					}
				}, 1);
			}
		});
//		鼠标移出轮播图，if判断解决mouseover和mouseout的bug，开始播放，隐藏左右按钮
		$obj.mouseout(function() {
			$CFActive = 1;
			if ($CFActive == 1) {
				setTimeout(function() {
					if ($CFActive == 1) {
						$oPrev.stop().animate({
							opacity: 0
						}, 200);
						$oNext.stop().animate({
							opacity: 0
						}, 200);
						$obj.$carouselfigureHandler = setInterval(function() {
							next();
						}, $valtime);
					}
				}, 1);
			}
		});
//		按左边的按钮播放上一个
		$oPrev.click(function() {
			prev();
		});
//		按右边的按钮播放下一个
		$oNext.click(function() {
			next();
		});
//		播放上一个的函数
		function next($q) {
//			参数用于圆点按钮播放
			if ($q) {
				$i = $q - 1 + $i;
			}
			if ($i >= $oUl.children().length * .5) {
				$oUl.css('left', 0);
				$i = 0;
				$i++;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			} else {
				$i++;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			}
		}
//		播放下一个的函数
		function prev($q) {
//			参数用于圆点按钮播放
			if ($q) {
				$i = $q + 1 + $i;
			}
			if ($i <= 0) {
				$oUl.css('left', -$oUlW);
				$i = $oUl.children().length * .5;
				$i--;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			} else {
				$i--;
				$oUl.stop().animate({
					left: $valWidth * -$i
				}, oCFChoosePoint($i));
			}
		}
	} else if (type=='fade') {
//		获取对象属性和调整对象属性
		$oUl = $obj.children().eq(0).children().eq(0);
		$oUl.children().css({position:'absolute',opacity:0});
		$oUl.children().eq(0).css('opacity',100);
		$oOl = $obj.children().eq(1);
		$oPrev = $obj.children().eq(2);
		$oNext = $obj.children().eq(3);
//		console.log($oOl.children().eq(0).attr('class'));
		$oOlLOn = $oOl.children().eq(0).attr('class');
		$i = 0;
		$CFActive = 1;
//		轮播图内禁止选中文字图片
		$obj.mousedown(function(e){
			e=e||event;
			if (e.preventDefault) {
				e.preventDefault();
			} else{
				return false;
			}
		})
//		给每个圆点按钮添加事件，点击轮播图播放到对应图片
		for ($j = 0, $len = $oUl.children().length; $j < $len; $j++) {
			(function($k) {
				$oOl.children().eq($k).click(function() {
					$oUl.children().stop().animate({
						opacity:0
					},500);
					$oUl.children().eq($k).stop().animate({
						opacity:1
					},500);
					$i=$k;
					oCFChoosePoint($i);
				});
			})($j);
		}
//		改变圆点按钮的颜色
		function oCFChoosePoint($i, fn) {
			for ($q = 0, $len = $oOl.children().length; $q < $len; $q++) {
				$oOl.children().eq($q).attr('class', '');
			}
			$oOl.children().eq($i).attr('class', $oOlLOn);
			if ($i == $oOl.children().length) {
				$oOl.children().eq(0).attr('class', $oOlLOn);
			}
			if (fn) {
				fn();
			}
		}
//		自动播放
		$obj.$carouselfigureHandler = setInterval(function() {
			next();
		}, $valtime);
//		鼠标在轮播图上，if判断解决mouseover和mouseout的bug，停止播放，显示左右按钮
		$obj.mouseover(function() {
			$CFActive = 0;
			if ($CFActive == 0) {
				setTimeout(function() {
					if ($CFActive == 0) {
						$oPrev.stop().animate({
							opacity: 1
						}, 200);
						$oNext.stop().animate({
							opacity: 1
						}, 200);
						clearInterval($obj.$carouselfigureHandler);
					}
				}, 1);
			}
		});
//		鼠标移出轮播图，if判断解决mouseover和mouseout的bug，开始播放，隐藏左右按钮
		$obj.mouseout(function() {
			$CFActive = 1;
			if ($CFActive == 1) {
				setTimeout(function() {
					if ($CFActive == 1) {
						$oPrev.stop().animate({
							opacity: 0
						}, 200);
						$oNext.stop().animate({
							opacity: 0
						}, 200);
						$obj.$carouselfigureHandler = setInterval(function() {
							next();
						}, $valtime);
					}
				}, 1);
			}
		});
//		按左边的按钮播放上一个
		$oPrev.click(function() {
			prev();
		});
//		按右边的按钮播放下一个
		$oNext.click(function() {
			next();
		});
//		播放下一个的函数
		function next() {
			if ($i>=$oUl.children().length-1) {
				$oUl.children().eq($i).stop().animate({
					opacity:0
				},500);
				$oUl.children().eq(0).stop().animate({
					opacity:1
				},500);
				$i=0;
				oCFChoosePoint($i);
			} else{
				$i++;
				$oUl.children().eq($i-1).stop().animate({
					opacity:0
				},500);
				$oUl.children().eq($i).stop().animate({
					opacity:1
				},500);
				oCFChoosePoint($i);
			}
		}
//		播放上一个的函数
		function prev() {
			if ($i <= 0) {
				$oUl.children().eq($i).stop().animate({
					opacity:0
				},500);
				$oUl.children().eq($oUl.children().length-1).stop().animate({
					opacity:1
				},500);
				$i--;
				$i=$oUl.children().length-1;
				oCFChoosePoint($i);
			} else {
				$i--;
				$oUl.children().eq($i).stop().animate({
					opacity:1
				},500);
				$oUl.children().eq($i+1).stop().animate({
					opacity:0
				},500);
				oCFChoosePoint($i);
			}
		}
	}
}

//遮罩方式解决mouseover和mouseout的bug
/**
 * 
 * @param {Object} obj					要解决mouseover bug的对象
 * @param {Object} mouseoverFn			创建遮罩对象的mouseover回调函数
 * @param {Object} mouseoutFn			创建遮罩对象的mouseout回调函数
 */
function oMaskCreate(obj,mouseoverFn,mouseoutFn){
//	在对象内的末尾创建遮罩
	$oThisMask=$('<big></big>');
	obj.append($oThisMask);
//	console.log(obj.css('position'));
//	判点对象是否有定位，没有的话添加相对定位
	if (obj.css('position')=='static') {
		obj.css('position','relative');
	}
//	对遮罩进行属性调整
	obj.children(':last-child').css({
		height:obj.css('height'),
		width:obj.css('width'),
		position:'absolute',
		top:0,
		left:0
	});
//	mouseover回调函数
	if (mouseoverFn) {
		obj.children(':last-child').mouseover(mouseoverFn);
	}
//	mouseout回调函数
	if (mouseoutFn) {
		obj.children(':last-child').mouseout(mouseoutFn);
	}
}

/**
 * 设置cookie
 * @param {Object} name				cookie的名称
 * @param {Object} value			cookie的内容
 * @param {Object} expires			cookie到期时间
 * @param {Object} path				cookie的路径
 * @param {Object} domain			cookie的域名
 */
function setCookie(name, value, expires, path, domain) {
	var cookie = name + '=' + value + ';';
	if(expires) {
		cookie += 'expires=' + expires + ';';
	}
	if(path) {
		cookie += 'path=' + path + ';';
	}
	if(domain) {
		cookie += 'domain=' + domain + ';';
	}
	document.cookie = cookie;
}

/**
 * 依据cookie的name获取内容
 * @param {Object} name			cookie的名称
 */
function getCookie(name) {
	var cookie=document.cookie;
	var cookies = cookie.split('; ');
	var rt = undefined;
	for (var i=0,len=cookies.length;i<len;i++){
		cookie = cookies[i].split('=');
		cookie[0].trim();
		if (cookie[0] == name){
			rt = cookie[1];
			break;
		}
	}
	return rt;
}

/**
 * 根据cookie的name删除cookie
 * @param {String} name			cookie的名称
 */
function deleteCookie(name) {
	var date = new Date();
	date.setDate(date.getDate()-1);
	document.cookie = name + '=1;expires=' + date;
}

/**
 * 1.给class为'.goods'的对象添加一个点击事件
 * 2.获取自身各标签信息，放到一个json对象里
 * 3.将json对象转换成字符串，上传到本地存储
 */
function goodsOnclick(){
	$('.goods').bind('touchstart',function(){
		var goodsDetail=null;
		goodsDetail={
			'img':$(this).find('img').eq(0).attr('src'),
			'title':$(this).find('b').html(),
			'originPrice':$(this).find('del').html(),
			'specialPrice':$(this).find('i').html()
		};
		goodsDetail=JSON.stringify(goodsDetail);
		window.localStorage.setItem('goodsDetail',goodsDetail);
	});
}
/**
 * 
 * @param {Object} message				要显示的提示信息
 * @param {Object} color				提示信息字体颜色
 * @param {Object} backgroundColor		提示信息背景颜色
 * @param {Object} opacity				提示信息的透明度
 * @param {Object} confirm				提示信息是否确认,true为调用
 * @param {Object} fn1					提示信息确认的回调函数
 * @param {Object} fn2					提示信息取消的回调函数
 */
function alertInf(message,colorVal,backgroundColorVal,opacityVal,confirm,fn1,fn2) {
	if (!colorVal) {
		colorVal='#ffffff';
	}
	if (!backgroundColorVal) {
		backgroundColorVal='#000000';
	}
	if (!opacityVal) {
		opacityVal=1;
	}
	if (confirm==true) {
		$oAlert = '<div class="alert"><p>' + message + '</p><p><span class="confirm_true">确定</span><i></i><span class="confirm_false">取消</span></p></div>';
		$('body').append($oAlert);
		$('.alert').css({
			'font-size': 32 / 50 + 'rem',
			'padding': '1em',
			'position': 'fixed',
			'color': colorVal,
			'opacity': 0,
			'top': '50%',
			'left': '50%',
			'margin-top': '-1.5em',
			'border-radius': 5 / 50 + 'rem',
			'background-color': backgroundColorVal,
			'z-index': 10000
		});
		$('.alert').find('p').eq(1).css({'margin-top':'1em','text-align':'center'});
		$('.alert').find('i').css({'width':'1em','display':'inline-block'});
		$('.alert').css('margin-left', -($('.alert').outerWidth() * .5));
		$('.confirm_true').bind('touchstart',function(){
			setTimeout(function() {
				$('.alert').css('opacity', 0);
				setTimeout(function() {
					$('.alert').css('transition', 'none');
					$('.alert').remove();
					if(fn1){
						fn1();
					}
				}, 500);
			}, 1);
		});
		$('.confirm_false').bind('touchstart',function(){
			setTimeout(function() {
				$('.alert').css('opacity', 0);
				setTimeout(function() {
					$('.alert').css('transition', 'none');
					$('.alert').remove();
					if(fn2){
						fn2();
					}
				}, 500);
			}, 1);
		});
		setTimeout(function(){
			$('.alert').css('transition', '.5s all linear');
			setTimeout(function(){
				$('.alert').css('opacity', opacityVal);
			},1);
		},1);
	}else{
		$oAlert = '<div class="alert">' + message + '</div>';
		$('body').append($oAlert);
		$('.alert').css({
			'font-size': 32 / 50 + 'rem',
			'padding': '1em',
			'position': 'fixed',
			'color': colorVal,
			'opacity': 0,
			'top': '50%',
			'left': '50%',
			'margin-top': '-1.5em',
			'border-radius': 5 / 50 + 'rem',
			'background-color': backgroundColorVal,
			'z-index': 10000
		});
		$('.alert').css('margin-left', -($('.alert').outerWidth() * .5));
		$('.confirm').attr('disabled', 'disabled');
		setTimeout(function(){
			$('.alert').css('transition', '1s all linear');
			setTimeout(function(){
				$('.alert').css('opacity', opacityVal);
				setTimeout(function() {
					$('.alert').css('opacity', 0);
					setTimeout(function() {
						$('.alert').css('transition', 'none');
						$('.alert').remove();
						$('.confirm').removeAttr('disabled');
					}, 500);
				}, 500);
			},1);
		},1);
	}
}

//判定登录状态
function ifLogin(){
	var codeError='codeError';
	if (getCookie('login')){
		$('#person').attr('href','myCenter.html');
		if($('.myCenter_name').length>0){
			$('.myCenter_name').html(getCookie('login'));
		}
	}else{
		$('#person').attr('href','login.html');
		return codeError;
	}
}