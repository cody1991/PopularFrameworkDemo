/**
 *  全局函数处理
 *  -----------------------------
 *  作者：叼怎么写！- -||
 *  时间：2014-03-12
 *  准则：Jquery、字面量对象
 *  联系：wechat--shoe11414255
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 *********************************************************************************************/
/**
 *  动画框架函数
 *  -->动画循环函数（参数为函数）
 *  -->动画循环停止函数（参数为ID值）
 */
	window.requestAnimFrame = function(){
		return (
			window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
		);
	}();

	window.cancelAnimFrame = function(){
		return (
			window.cancelAnimationFrame       || 
			window.webkitCancelAnimationFrame || 
			window.mozCancelAnimationFrame    || 
			window.oCancelAnimationFrame      || 
			window.msCancelAnimationFrame     || 
			function(id){
				window.clearTimeout(id);
			}
		);
	}();

/**
 *  SVG动画函数
 *  -->创建对象
 *  -->函数初始化
 *  -->显示对应的图片
 */
	// 创建对象
	function SVGEl( el ) {
		this.el = el;
		this.image = this.el.previousElementSibling;
		this.current_frame = 0;
		this.total_frames = 100;
		this.path = new Array();
		this.length = new Array();
		this.handle = 0;
		this.init();
	};

	// 初始化对象
	SVGEl.prototype.init = function() {
		var self = this;
		[].slice.call( this.el.querySelectorAll( 'path' ) ).forEach( function( path, i ) {
			self.path[i] = path;

			if(typeof(self.path[i].getTotalLength) !== 'function'){
				return;
			}else{
				var l = self.path[i].getTotalLength();
				self.length[i] = l;
				self.path[i].style.strokeDasharray = l + ' ' + l; 
				self.path[i].style.strokeDashoffset = l;
			}
		});
	};

	// 对象读取
	SVGEl.prototype.render = function() {
		if( this.rendered ) return;
		this.rendered = true;
		this.draw();
	};

	// 对象动画开始
	SVGEl.prototype.draw = function() {
		var self = this,
			progress = this.current_frame/this.total_frames;
		if (progress > 1) {
			window.cancelAnimFrame(this.handle);
			this.showImage();
		} else {
			this.current_frame++;
			for(var j=0, len = this.path.length; j<len;j++){
				this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
			}
			this.handle = window.requestAnimFrame(function() { self.draw(); });
		}
	};

	// 动画完成的回调处理
	SVGEl.prototype.showImage = function() {
		this.image.className = 'show';
		this.el.style.opacity = '0';

		cw._animate('false');
	};

var cw = {
/****************************************************************************************************/
/*  对象私有变量/函数返回值/通用处理函数
*****************************************************************************************************/	
/*************************
 *  = 对象变量，判断函数
 *************************/
	_events 		: {},									// 自定义事件---this._execEvent('scrollStart');
	_windowHeight	: $(window).height(),					// 设备屏幕高度

	_rotateNode		: $('.p-ct'),							// 旋转体
	_rotateVal		: true,									// 触摸是否可以旋转

	_page 			: $('.m-page'),							// 模版页面切换的页面集合
	_pageNum		: $('.m-page').size(),					// 模版页面的个数
	_pageNow		: 0,									// 页面当前的index数
	_pageNext		: null,									// 页面下一个的index数
	_pageFirst		: 'false',								// 第一次不能向上滑动

	_touchInt		: true,									// 重新计算第一个点的值
	_touchStartValX	: 0,									// 触摸开始获取的第一个值
	_touchStartValY	: 0,									// 触摸开始获取的第一个值
	_touchDeltaY	: 0,									// 滑动的距离

	_scrollTop 		: 0,

	_moveAga		: false,
	_moveStart		: true,									// 触摸移动是否开始
	_moveInit		: false,								// 确保从start开始
	_movePosition	: '',									// 触摸移动的方向（上、下）
	_movePosition_c	: true,									// 触摸移动的方向的控制
	_mouseDown		: false,								// 判断鼠标是否按下
	_moveFirst		: true,

	_map 			: $('.ylmap'),							// 地图DOM对象
	_mapValue		: null,									// 地图打开时，存储最近打开的一个地图
	_mapIndex		: null,									// 开启地图的坐标位置

	_wifi_time		: null,									// wifiTV图片切换计时器

	_audioNode		: $('.u-audio'),						// 声音模块
	_audio			: $('#chuangwei_audio'),				// 声音对象
	_audio_val		: true,									// 声音是否开启控制
	_audio_handle	: null,									// 声音循环控制 
	_audio_start	: true,									// 声音是否开始
	
	_shopJson		: null,									// 分店数据			
	_areaId			: null,									// 查询分店数据id
	
	_elementStyle	: document.createElement('div').style,	// css属性保存对象

	_UC 			: RegExp("Android").test(navigator.userAgent)&&RegExp("UC").test(navigator.userAgent)? true : false,
	_weixin			: RegExp("MicroMessenger").test(navigator.userAgent)? true : false,
	_iPhoen			: RegExp("iPhone").test(navigator.userAgent)||RegExp("iPod").test(navigator.userAgent)||RegExp("iPad").test(navigator.userAgent)? true : false,
	_Android		: RegExp("Android").test(navigator.userAgent)? true : false,
	_IsPC			: function(){ 
						var userAgentInfo = navigator.userAgent; 
						var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
						var flag = true; 
						for (var v = 0; v < Agents.length; v++) { 
							if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
						} 
						return flag; 
					} ,

/***********************
 *  = gobal通用函数
 ***********************/
 	// 判断函数是否是null空值
	_isOwnEmpty		: function (obj) { 
						for(var name in obj) { 
							if(obj.hasOwnProperty(name)) { 
								return false; 
							} 
						} 
						return true; 
					},
	// 微信初始化函数
	_WXinit			: function(callback){
						if(typeof window.WeixinJSBridge == 'undefined' || typeof window.WeixinJSBridge.invoke == 'undefined'){
							setTimeout(function(){
								this.WXinit(callback);
							},200);
						}else{
							callback();
						}
					},
	// 判断浏览器内核类型
	_vendor			: function () {
						var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
							transform,
							i = 0,
							l = vendors.length;
				
						for ( ; i < l; i++ ) {
							transform = vendors[i] + 'ransform';
							if ( transform in this._elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
						}
						return false;
					},
	// 判断浏览器来适配css属性值
	_prefixStyle	: function (style) {
						if ( this._vendor() === false ) return false;
						if ( this._vendor() === '' ) return style;
						return this._vendor() + style.charAt(0).toUpperCase() + style.substr(1);
					},
	// 判断是否支持css transform-3d（需要测试下面属性支持）
	_hasPerspective	: function(){
						var ret = this._prefixStyle('perspective') in this._elementStyle;
						if ( ret && 'webkitPerspective' in this._elementStyle ) {
							this._injectStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
								ret = node.offsetLeft === 9 && node.offsetHeight === 3;
							});
						}
						return !!ret;
					},
		_translateZ : function(){
						if(cw._hasPerspective){
							return ' translateZ(0)';
						}else{
							return '';
						}
					},

	// 判断属性支持是否
	_injectStyles 	: function( rule, callback, nodes, testnames ) {
						var style, ret, node, docOverflow,
							div = document.createElement('div'),
							body = document.body,
							fakeBody = body || document.createElement('body'),
							mod = 'modernizr';

						if ( parseInt(nodes, 10) ) {
							while ( nodes-- ) {
								node = document.createElement('div');
								node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
								div.appendChild(node);
								}
						}

						style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
						div.id = mod;
						(body ? div : fakeBody).innerHTML += style;
						fakeBody.appendChild(div);
						if ( !body ) {
							fakeBody.style.background = '';
							fakeBody.style.overflow = 'hidden';
							docOverflow = docElement.style.overflow;
							docElement.style.overflow = 'hidden';
							docElement.appendChild(fakeBody);
						}

						ret = callback(div, rule);
						if ( !body ) {
							fakeBody.parentNode.removeChild(fakeBody);
							docElement.style.overflow = docOverflow;
						} else {
							div.parentNode.removeChild(div);
						}

						return !!ret;
					},
	// 自定义事件操作
 	_handleEvent 	: function (type) {
						if ( !this._events[type] ) {
							return;
						}

						var i = 0,
							l = this._events[type].length;

						if ( !l ) {
							return;
						}

						for ( ; i < l; i++ ) {
							this._events[type][i].apply(this, [].slice.call(arguments, 1));	
						}
					},
	// 给自定义事件绑定函数
	_on				: function (type, fn) {
						if ( !this._events[type] ) {
							this._events[type] = [];
						}

						this._events[type].push(fn);
					},
	//禁止滚动条
	_scrollStop		: function(){
						//禁止滚动
						$(window).on('touchmove.scroll',this._scrollControl);
						$(window).on('scroll.scroll',this._scrollControl);
					},
	//启动滚动条
	_scrollStart 	: function(){		
						//开启屏幕禁止
						$(window).off('touchmove.scroll');
						$(window).off('scroll.scroll');
					},
	//滚动条控制事件
	_scrollControl	: function(e){e.preventDefault();},

	// 切换判断禁止一些标签的动作
	_preventDefaultException : function (el, exceptions) {
								for ( var i in exceptions ) {
									if ( exceptions[i].test(el[i]) ) {
										return true;
									}
								}

								return false;
							},

/**************************************************************************************************************/
/*  关联处理函数
***************************************************************************************************************/
/**
 *  3d旋转页面
 *  -->页面旋转
 *  -->绑定事件
 *  -->旋转回调函数处理
 *  -->绑定页面旋转开始事件
 */
 	// 旋转吧，蛋炒饭
 	page_rotate3d	: function(){
		cw._rotateVal = false;
		
		//显示下面的内容
		$('.transformNode-back').addClass('show').removeClass('f-hide');
		$('.m-page').eq(0).find('.page-con').height(cw._windowHeight);

		//封面切换效果
		cw._rotateNode.addClass('move');
		setTimeout(function(){
			cw._rotateNode.addClass('open');
		},100);

		/*过渡效果完后的调用函数*/
		setTimeout(function(){
			//滚动条启动
			cw._scrollStart();

			// 适配每一个模版的高度
			cw.height_auto(cw._page.eq(cw._pageNow),'true');

			$(document.body).removeClass('perspective');
			
			// 移除3d效果控制的ID，并解锁页面的锁定
			cw._rotateNode.removeClass('transformNode-3d move');

			// 声音切换
			$('.u-audio').removeClass('f-hide');
			$('.transformNode-front .u-audio').addClass('f-hide');

			//隐藏封面
			$('.transformNode-front').css('height',0);

			cw.frontTouchClose();

			// 绑定打开事件
			cw._handleEvent('open');
		},1100)
 	},

 	// 回去吧，蛋炒饭
 	page_rotate3d_back : function(){
 		// 禁止滑动
		cw._scrollStop();
 		
		// 适配每一个模版的高度
		$('.p-ct').removeClass('fixed');

 		// 加上3d旋转的‘雷鸣’,并准备好
		$(document.body).addClass('perspective');
		cw._rotateNode.addClass('transformNode-3d');
		$('.transformNode-front').css('height','100%');

		// 声音切换
		$('.u-audio').addClass('f-hide');
		$('.transformNode-front .u-audio').removeClass('f-hide');

		//封面切换效果
		setTimeout(function(){
			cw._rotateNode.addClass('move');
			cw._rotateNode.removeClass('open');
		},100)
		
		/*过渡效果完后的调用函数*/
		setTimeout(function(){
			$('.transformNode-back').removeClass('show').addClass('f-hide');

			cw._rotateVal = true;
			cw.frontTouchOpen();

			// 绑定打开事件
			cw._handleEvent('close');
		},1100)
 	},	

 	// 打开吧，荷包蛋
 	page_rotate2d : function(){
 		cw._rotateVal = false;

 		// 滚动条启动
		cw._scrollStart();

		// 手引关闭
		$('.transformNode-front').find('.u-arrow').hide();
		$('.transformNode-front').find('.u-arrow').removeClass('move');

		// 显示下面的内容
		$('.transformNode-back').addClass('show').removeClass('f-hide');

		// 加上2d效果
		$('.transformNode-front').addClass('hebaodan');
		$('.transformNode-front').find('.m-fengye').clone().addClass('m-fengye-2').removeClass('m-fengye-1').appendTo($('.transformNode-front'));
		
		setTimeout(function(){
			$('.transformNode-front').addClass('move out');
		},100)		

		$('.transformNode-front').on('touchstart',function(e){
			return false;
		})

		/*过渡效果完后的调用函数*/
		setTimeout(function(){
			// 隐藏封面
			$('.transformNode-front').addClass('f-hide');

			// 移除3d效果控制的ID，并解锁页面的锁定
			cw._rotateNode.removeClass('transformNode-2d');

			cw.frontTouchClose();

			// 绑定打开事件
			cw._handleEvent('open');
		},1100)
 	},	

 	// 回去吧，荷包蛋
 	page_rotate2d_back : function(){
 		// 禁止滑动
		cw._scrollStop();

		// 加上2d效果-并显示封面
 		cw._rotateNode.addClass('transformNode-2d');
 		$('.transformNode-front').removeClass('f-hide');

 		//加上2D的效果
		setTimeout(function(){
			$('.transformNode-front').removeClass('out');
		},100)

		$('.transformNode-front').off('touchstart');

 		/*过渡效果完后的调用函数*/
		setTimeout(function(){
			// 手引开启
			$('.transformNode-front').find('.u-arrow').show(300);
			$('.transformNode-front').find('.u-arrow').addClass('move');

			$('.transformNode-front').removeClass('hebaodan move');
			$('.transformNode-front').find('.m-fengye-2').remove();
			$('.transformNode-back').removeClass('show').addClass('f-hide');

			cw._rotateVal = true;
			cw.frontTouchOpen();

			// 绑定打开事件
			cw._handleEvent('close');
		},1100)
 	},

 	// 旋转开启事件
 	frontTouchOpen	: function(){
		//触摸开始事件设置初始值
		$('.transformNode-front').on('touchstart',function(e){
			// 开启声音
			cw.audio_bool();

			cw._touchStartValY = window.event.touches[0].pageY;
			cw._touchStartValX = window.event.touches[0].pageX;
		})
		
		//触摸移动，判断手势，处理动画
		$('.transformNode-front').on('touchmove',function(e){
			e.preventDefault();
			var moveY,moveX;
			moveY = window.event.touches[0].pageY;
			moveX = window.event.touches[0].pageX;
			if(cw._touchStartValY-moveY>50&&cw._hasPerspective()&&cw._rotateVal){
				cw.page_rotate3d();
			}
			if(Math.abs(cw._touchStartValX-moveX)>50&&!cw._hasPerspective()&&cw._rotateVal){
				cw.page_rotate2d();
			}
		})
	},
	
	//背景手势关闭
	frontTouchClose	: function(){
		$('.transformNode-front').off('touchstart');
		$('.transformNode-front').off('touchmove');
	},

/**
 *  单页面-m-page 切换的函数处理
 *  -->绑定事件
 *  -->事件处理函数
 *  -->事件回调函数
 *  -->事件关联函数【
 */
 	// 页面切换开始
 	page_start		: function(){
 		cw._page.on('touchstart mousedown',cw.page_touch_start);
 		cw._page.on('touchmove mousemove',cw.page_touch_move);
 		cw._page.on('touchend mouseup',cw.page_touch_end);
 	},

 	// 页面切换停止
 	page_stop		: function(){
		cw._page.off('touchstart mousedown');
 		cw._page.off('touchmove mousemove');
 		cw._page.off('touchend mouseup');
 	},

 	// page触摸移动start
 	page_touch_start: function(e){
 		if(!cw._moveStart) return;

 		if(e.type == "touchstart"){
        	cw._touchStartValY = window.event.touches[0].pageY;
        	cw._scrollY = window.event.touches[0].pageY;
        }else{
        	cw._touchStartValY = e.pageY||e.y;
        	cw._scrollY = e.pageY||e.y;
        	cw._mouseDown = true;
        }

        cw._moveInit = true;
 		cw._touchInt = true;

        // start事件
        cw._handleEvent('start');
 	},

 	// page触摸移动move
 	page_touch_move : function(e){
 		// iphone取消滚动条默认事件
		if(cw._iPhoen) e.preventDefault();

		if(!cw._moveStart||!cw._moveInit) return;

 		var $self = cw._page.eq(cw._pageNow),
 			h = parseInt($self.outerHeight()),
 			moveP,
 			scrollTop,
 			node,
 			move=false;

 		// 滑动区域高度小于等于设备高度
 		if(cw._windowHeight>=h){
 			e.preventDefault();
 			// 获取触摸的位置值
 			setMove();

 			// 获取下次活动的page
	        node = cw.page_position(e,moveP,$self);
 		}else{
 			// 获取滚动条的值
 			scrollTop = parseInt($(window).scrollTop());

			setMove();
			node = cw.page_position(e,moveP,$self);

			// iphone设置滚动条
			if(!cw._moveAga&&cw._iPhoen){
				cw._scrollTop =scrollTop;
				scrollTop = scrollTop - moveP + cw._touchStartValY;
				$(window).scrollTop(scrollTop);
				scrollTop = parseInt($(window).scrollTop());
			}

			// Iphone判断是否可滑动（针对底部向上滑）
			var a = false;
			if(cw._iPhoen&&cw._scrollTop==scrollTop&&scrollTop>0) a = true;
			if(cw._iPhoen&&scrollTop==0&&cw._movePosition=='up') a = true;

			if((a||(scrollTop+cw._windowHeight)>=h-10)&&cw._touchInt){	// 最底部
 				if(cw._movePosition!='up'){
 					cw._touchDeltaY = 0;
 					cw._moveAga = false;
 					return;
 				}

 				e.preventDefault();
 				cw._moveAga = true;
 			}else if(scrollTop==0&&cw._touchInt){	// 顶部
 				if(cw._movePosition!='down'){
 					cw._touchDeltaY = 0;
 					cw._moveAga = false;
 					return;
 				}
 				
 				e.preventDefault();
 				cw._moveAga = true;
 			}else{	// 可滑动的位置
 				cw._moveAga = false;
 				cw._touchDeltaY = 0;
 				cw._touchInt = false;
 				return;
 			}
 		}

		// page页面移动 		
 		cw.page_translate(node,cw._touchDeltaY,moveP);

        // move事件
        cw._handleEvent('move');

        function setMove(){
        	if(e.type == "touchmove"){
	        	moveP = window.event.touches[0].pageY;
	        	move = true;
	        }else{
	        	if(cw._mouseDown){
	        		moveP = e.pageY||e.y;
	        		move = true;
	        	};
	        }
        }
 	},

 	// page触摸移动判断方向
 	page_position	: function(e,moveP,$self){ 		
 		// 设置移动的方向
 		if(cw._movePosition_c){
        	cw._movePosition = moveP - cw._touchStartValY >0 ? 'down' : 'up';
        	cw._movePosition_c = false;
        }

        // 判断首页不能向上滑动
      	if(cw._movePosition!='up'){
 			if(cw._pageNow==0&&cw._pageFirst=='false') {
 				e.preventDefault();
 				cw._touchDeltaY = 0;

 				// 蛋炒饭旋转回去
 				if(cw._hasPerspective()){
 					cw.page_rotate3d_back();
 				}else{
 					cw.page_rotate2d_back();
 				}
 				return;
 			}
 		}

		// 设置下一页面的显示和位置        
        if(cw._movePosition=='up'){
        	if($self.nextAll('.m-page').length == 0){
        		 return;
        	}
 			cw._pageNext = cw._pageNow+1;
 			node = cw._page.eq(cw._pageNext)[0];
 		}else{
 			if($self.prevAll('.m-page').length == 0) return;
 			cw._pageNext = cw._pageNow-1;
 			node = cw._page.eq(cw._pageNext)[0];
 		}
 		
 		return node;
 	},

 	// page触摸移动设置函数
 	page_translate	: function(node,y,moveP){
 		var l,s,_translateZ = cw._translateZ();
 		// 没有传值返回
 		if(!node) return;

 		// 显示对应移动的page
		if(cw._moveFirst) $(node).removeClass('f-hide').addClass('active'); 

 		// 模版高度适配函数处理
 		if(cw._moveFirst) cw.height_auto(cw._page.eq(cw._pageNext),'false');

 		// 设置下一页面的显示和位置        
        if(cw._movePosition=='up'){
 			if(cw._moveFirst){
 				s = parseInt($(window).scrollTop());
 				if(s>0) l = cw._windowHeight+s;
 				else l = cw._windowHeight;
 				node.style[cw._prefixStyle('transform')] = 'translate(0,'+l+'px)'+_translateZ;
 				$(node).attr('data-translate',l);
 			}
 		}else{
 			if(cw._moveFirst){
 				node.style[cw._prefixStyle('transform')] = 'translate(0,-'+Math.max(cw._windowHeight,$(node).outerHeight())+'px)'+_translateZ;
 				$(node).attr('data-translate',-Math.max(cw._windowHeight,$(node).outerHeight()));
 			}
 		}
 		
 		if(moveP!='undefined') cw._touchDeltaY = moveP - cw._touchStartValY;

 		cw._moveFirst = false;

 		if($(node).attr('data-translate')) y = y + parseInt($(node).attr('data-translate'));
		node.style[cw._prefixStyle('transform')] = 'translate(0,'+y+'px)'+_translateZ;
 	},

 	// page触摸移动end
 	page_touch_end	: function(e){
 		if(!cw._moveStart) return
 		// 取消静止滑动
	 	cw._scrollStart();

	 	if(Math.abs(cw._touchDeltaY)>10) cw._scrollStop();

 		cw._moveStart = false;
	 	cw._moveInit = false;

 		var scrollTop = $(window).scrollTop();
 		if(cw._moveAga&&cw._touchInt&&Math.abs(cw._touchDeltaY)>=100) cw._touchDeltaY -= scrollTop;

 		// 确保移动了
 		if(Math.abs(cw._touchDeltaY)>10) cw._page.eq(cw._pageNext).addClass('move');
		
		// 页面切换
 		if(Math.abs(cw._touchDeltaY)>=100){		// 切换成功
 			cw.page_success(scrollTop);
 		}else if(Math.abs(cw._touchDeltaY)>10&&Math.abs(cw._touchDeltaY)<100){	// 切换失败		
 			cw.page_fial();
 		}else{									// 没有切换
 			cw.page_fial();
 		}

 		// end事件
        cw._handleEvent('end');

        // 注销控制值
 		cw._mouseDown = false;
 		cw._movePosition_c = true;
 		cw._touchStartValY = 0;
 		cw._touchDeltaY = 0;
 		cw._moveAga = false;
 	},

 	// 切换成功
 	page_success	: function(scrollTop){
 		var y = parseInt(scrollTop),_translateZ = cw._translateZ();
 		if(scrollTop>10){
 			cw._page.eq(cw._pageNow)[0].style[cw._prefixStyle('transform')] = 'translate(0,-'+y+'px)'+_translateZ;
 			cw._page.eq(cw._pageNext).addClass('fixed');
 			cw._page.eq(cw._pageNow).addClass('fixed');
 		}
 		cw._page.eq(cw._pageNext)[0].style[cw._prefixStyle('transform')] = 'translate(0,0)'+_translateZ;

 		// 成功事件
    	cw._handleEvent('success');
 	},

 	// 切换失败
 	page_fial	: function(){
 		var _translateZ = cw._translateZ();
 		// 判断是否移动了
		if(!cw._pageNext) {
			cw._moveStart = true;
			cw._moveFirst = true;
			return;
		}

 		if(cw._movePosition=='up'){
 			cw._page.eq(cw._pageNext)[0].style[cw._prefixStyle('transform')] = 'translate(0,'+cw._windowHeight+'px)'+_translateZ;
 		}else{
 			var y = Math.max(cw._windowHeight,cw._page.eq(cw._pageNext).outerHeight());
 			cw._page.eq(cw._pageNext)[0].style[cw._prefixStyle('transform')] = 'translate(0,-'+y+'px)'+_translateZ;
 		}

 		if(cw._page.eq(cw._pageNow).height()>cw._windowHeight) cw._scrollStart();

 		// fial事件
    	cw._handleEvent('fial');
 	},

/**
 *  对象函数事件绑定处理
 *  -->flyPopupOpen点击事件
 *  -->flyPopupClose关闭事件
 */
	//窗口打开
	flyPopupOpen	: function(){
		var imgBtn = $('.intro-style02 .header_img').find('.u-imgHeader'),
			fly_con = $('.m-flypop');

		imgBtn.on('click',function(){
			if($(this).attr('data-type')=='false') return false;

			// 隐藏声音按钮
			cw._audioNode.addClass('f-hide');
			
			// 获取点击BTN的ID，对应显示ID的内容
			flyID = $(this).attr('data-fly-id');
			
			// 判断是否有对应的ID显示内容，没有则返回false
			if(fly_con.find('ul li[data-fly-id='+flyID+']').length==0) return false;

			// 静止滚动
			cw.page_stop();
			cw._scrollStop();

			// 点击时当前滚动条的高度
			var	scrollT = $(window).scrollTop(),
				// 获取到目标BTN的对象
				tagertHeader = $(this),
				// offsetT = cw._iPhoen ? tagertHeader.offset().top:tagertHeader.offset().top-scrollT,
				offsetT = tagertHeader.offset().top-scrollT,
				offsetT = cw._UC ? offsetT = tagertHeader.position().top: offsetT=offsetT,
				offsetL = tagertHeader.offset().left,

				//获取其他标签的对象
				liNode			= fly_con.find('ul li[data-fly-id='+flyID+']'),
				ulNode			= liNode.parent(),
				imgBtn_con		= liNode.find('.u-imgHeader'),
				imgBtn_clone	= tagertHeader.clone().addClass('clone').appendTo(fly_con),
				closeNode		= liNode.find('.u-close');

			/********************************/
			// 修改的内容 iphone4头像获取positionTOP的适配
			var version;
			if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(navigator.userAgent)){
	            version = parseFloat(RegExp.$1.replace("_", "."));
	        } else {
	            version = 2;  //can't really detect - so guess
	        }
	        if(version<6.0){
	        	offsetT = tagertHeader.offset().top-scrollT;
	        }
			// 修改的内容
			/********************************/

			//克隆Btn移动	
			imgBtn_clone.css({
				'position'	: 'fixed',
				'top'		: offsetT,
				'left'		: offsetL,
				'margin-left': 0,
				'margin-top': 0,
				'z-index'	: 250
			})

			//人物介绍框出来
			fly_con.addClass('show');
			liNode.removeClass('f-hide');
			setTimeout(function(){
				imgBtn_clone.addClass('move');
				ulNode.addClass('show');
				closeNode.removeClass('start');

				//位置的移动
				imgBtn_clone.animate({
					'top'	: cw._windowHeight/2,
					'left'	: 83,
					'margin-left': 20,
					'margin-top' : -337
				},1500,'easeOutSine');
			},100)

			// 移动完的函数处理
			setTimeout(function(){
				$('.m-people').find('.u-imgHeader').removeClass('show');
				liNode.addClass('show');				//人物介绍出现
				setTimeout(function(){
					// 头像切换
					liNode.find('.u-imgHeader').addClass('show');
					imgBtn_clone.remove();

					// 关闭事件绑定
					closeNode.on('click',function(e){
						cw.flyPopupCloseFun(e,fly_con,liNode)
					});

					fly_con.on('click',function(e){
						cw.flyPopupCloseFun(e,fly_con,liNode)
					});
				},700);

				// flyCon-open打开事件
				cw._handleEvent('flyOpen',liNode);
			},1600)
		})
	},

	// 窗口关闭函数
	flyPopupCloseFun : function(e,obj,li){
		e.stopPropagation();
		if(e.target.className.indexOf('u-close')==-1 && e.target.className.indexOf('allow-close')==-1){
			return;
		}		

		//开启移除动画
		obj.find('.u-close').addClass('start');	

		obj.find('ul').removeClass('show');
		obj.find('ul li').removeClass('show');
		obj.find('ul li .u-imgHeader').removeClass('show');
		
		//效果结束的动作
		$(window).on('webkitTransitionEnd transitionend',peoplePopupClose);
		function peoplePopupClose(){
			// 开启声音按钮
			cw._audioNode.removeClass('f-hide');

			obj.removeClass('show');
			li.addClass('f-hide');

			obj.off('click');
			obj.find('.u-close').off('click');

			//开启滚动
			cw.page_start();
			cw._scrollStart();

			$(window).off('webkitTransitionEnd transitionend');
		}
	},

	// 飞出窗口文本标题的控制居中
	flyPopupTitle : function(ele){
		var title = ele.find('.txtHeader'),
			hei_tit = parseInt(title.height());

		if(hei_tit>=200) height = 200;
		else height = (200-hei_tit)/2;

		title.css('padding-top',height);
	},

/**
 *  对象函数事件绑定处理
 *  -->start touch开始事件
 *  -->mov   move移动事件
 *  -->end   end结束事件
 */
 	haddle_envent_fn : function(){
 		// open翻滚后的事件
 		cw._on('open',function(){
 			// 开启页面切换
			cw.page_start();

			// 手引开始--内容里面
			$('.transformNode-back').find('.u-arrow').show(300);
			$('.transformNode-back').find('.u-arrow').addClass('move');

			// 手引隐藏--封面里面
			$('.transformNode-front').find('.u-arrow').hide();
			$('.transformNode-front').find('.u-arrow').removeClass('move');

			// 判断当前页面是否是工艺页面
			if(cw._page.eq(cw._pageNow).attr('data-page-type')=='crafts'){
				var ele = cw._page.eq(cw._pageNow).find('.list');
				cw.ele_in([ele,500],function(){
					ele.find('.txt').addClass('show');
				});
			}

			// 飞出窗口的出现
 			if(cw._page.eq(cw._pageNow).attr('data-page-type')=='flyCon'){
 				$('.intro-style02 .img-con ul li').addClass('show');
 				// 介绍样式-2中，飞出左右内容高度一样
				var leftH = parseInt(cw._page.eq(cw._pageNow).find('.header_img .img_left').outerHeight()),
					rightH = parseInt(cw._page.eq(cw._pageNow).find('.header_img .img_right').outerHeight()),
					height = Math.max(leftH,rightH);

				cw._page.eq(cw._pageNow).find('.header_img .img_left').outerHeight(height);
				cw._page.eq(cw._pageNow).find('.header_img .img_right').outerHeight(height);
 			}
 		})

 		// close翻滚回去的事件
 		cw._on('close',function(){
 			// 取消页面切换
 			cw.page_stop();

 			// 手引关闭--内容里面
			$('.transformNode-back').find('.u-arrow').hide();
			$('.transformNode-back').find('.u-arrow').removeClass('move');

			// 手引开启--封面里面
			$('.transformNode-front').find('.u-arrow').show(300);
			$('.transformNode-front').find('.u-arrow').addClass('move');
 		})

 		// flyCon-open飞入打开
 		cw._on('flyOpen',cw.flyPopupTitle)

 		// touchstart触发声音操作
 		cw._on('start',cw.audio_bool);

 		// 当前页面移动，延迟加载以后的图片
		cw._on('start',cw.lazy_bigP);

		// 切换失败事件
		cw._on('fial',function(){
			setTimeout(function(){
	 			cw._page.eq(cw._pageNext).removeClass('move');
	 			cw._page.eq(cw._pageNext).removeClass('active').addClass('f-hide');
				cw._moveStart = true;
				cw._moveFirst = true;
				cw._pageNext = null;
				cw._page.eq(cw._pageNow).attr('style','');
	 		},300)
		})

		// 切换成功事件
		cw._on('success',function(){
			setTimeout(function(){
				// 判断是否是最后一页，让轻APP关联页面隐藏
	 			if(cw._page.eq(cw._pageNext).nextAll('.m-page').length != 0){
	 				cw.lightapp_intro_hide(true);
	 			}

 				// 封面手引
 				$('.transformNode-back').find('.u-arrow').hide();
				$('.transformNode-back').find('.u-arrow').removeClass('move');

	 			// 飞出窗口的出现
	 			if(cw._page.eq(cw._pageNext).attr('data-page-type')=='flyCon'){
	 				$('.intro-style02 .img-con ul li').addClass('show');
	 				// 介绍样式-2中，飞出左右内容高度一样
					var leftH = parseInt(cw._page.eq(cw._pageNext).find('.header_img .img_left').outerHeight()),
						rightH = parseInt(cw._page.eq(cw._pageNext).find('.header_img .img_right').outerHeight()),
						height = Math.max(leftH,rightH);

					cw._page.eq(cw._pageNext).find('.header_img .img_left').outerHeight(height);
					cw._page.eq(cw._pageNext).find('.header_img .img_right').outerHeight(height);
	 			}

	 			// wifitv 手引
	 			if(cw._page.eq(cw._pageNext).attr('data-page-type')=='wifiTV'){
	 				$('.m-wifiTV .wifiTv-mobile .arrow').addClass('move');
	 			}else{
	 				$('.m-wifiTV .wifiTv-mobile .arrow').removeClass('move');
	 			}

	 			// 初始化切换的相关控制值
	 			$('.p-ct').removeClass('fixed');
	 			cw._page.removeClass('move');
	 			cw._page.eq(cw._pageNext).removeClass('active');
	 			cw._page.eq(cw._pageNow).addClass('f-hide');
				cw._page.eq(cw._pageNext).removeClass('fixed');
				cw._pageNow = cw._pageNext;
				cw._moveStart = true;
				cw._moveFirst = true;
				cw._pageNext = null;
				cw._page.eq(cw._pageNow).attr('style','');
				cw._page.eq(cw._pageNow).removeClass('fixed');

				// 模版高度适配函数处理
				cw.height_auto(cw._page.eq(cw._pageNow),'true');

				// 工艺页面进入，子内容切换进来
				if(cw._page.eq(cw._pageNow).attr('data-page-type')=='crafts'){
					var ele = cw._page.eq(cw._pageNow).find('.list');
					cw.ele_in([ele,500],function(){
						ele.find('.txt').addClass('show');
					});
				}

	 			// 判断是否滑动最后一页，并让轻APP介绍关联页面贤淑
	 			if(cw._page.eq(cw._pageNow).nextAll('.m-page').length == 0){
	 				cw.lightapp_intro_show();
	 				cw.lightapp_intro();
	 			}

	 		},300)

			// 切换成功后，发送统计
			 var laytouid = cw._page.eq(cw._pageNow).attr('data-statics');
			 cw.ajaxTongji(laytouid);
		})
 	},

 	 //统计函数处理
 	 ajaxTongji	: function(laytouid){
 	 	var activity_id = $('#activity_id').val();
 	 	var url = "/skyworth/plugin/"+activity_id;
		 //报名统计请求
	 	//$.post(url,{plugin_type:laytouid, activity_id:activity_id});
 	 },

/**
 *  地图创建函数处理
 *  -->绑定事件
 *  -->事件处理函数
 *  -->创建地图
 *  -->函数传值
 *  -->关闭函数回调处理
 */
 	// 自定义绑定事件
	mapAddEventHandler	 : function(obj,eventType,fn,option){
	    var fnHandler = fn;
	    if(!cw._isOwnEmpty(option)){
	        fnHandler = function(e){
	            fn.call(this, option);  //继承监听函数,并传入参数以初始化;
	        }
	    }
	    obj.each(function(){
	  	  $(this).on(eventType,fnHandler);
	    })
	},

	//点击地图按钮显示地图
	mapShow : function(option){
		// 头部title显示选中的地点城市 
		if(!$(this).attr('data-lat')){
			return;
		}
		var cityName = $('.book-place').find('h4.u-titile02 .city');
		// cityName.removeClass('f-hide');
		// cityName.find('span').first().text($('.place-con').find('.top .city').find('span').first().text());
		$('.book-place').find('h4.u-titile02').find('a.back').attr('data-type','map');
		//----- 外部样式函数处理-----end

		option.detal = {sign_name:'',contact_tel:'',address:$(this).find('h5').text()};
		option.latitude = $(this).attr('data-lat');
		option.longitude = $(this).attr('data-lng');

		//地图添加
		var detal		= option.detal,
			latitude	= option.latitude,
			longitude	= option.longitude,
		 	fnOpen		= option.fnOpen,
			fnClose		= option.fnClose;

		cw._scrollStop();
		cw._map.addClass('show');
		$(document.body).animate({scrollTop: 0}, 0, "easeOutSine");
		
		//判断开启地图的位置是否是当前的
		if($(this).attr('data-mapIndex')!=cw._mapIndex){
			cw._map.html($('<div class="bk"><span class="css_sprite01 s-bg-map-logo"></span></div>'));
			cw._mapValue = false;
			cw._mapIndex = $(this).attr('data-mapIndex');
		}else{
			cw._mapValue = true;	
		} 

		setTimeout(function(){
			//将地图显示出来
			if(cw._map.find('div').length>=1){
				cw._map.addClass("mapOpen");

				setTimeout(function(){
					//如果开启地图的位置不一样则，创建新的地图
					if(!cw._mapValue) cw.addMap(detal,latitude,longitude,fnOpen,fnClose);

					$('.book-place').find('.place-con').addClass('f-hide');
					$(window).off('webkitTransitionEnd transitionend');
				},500)
			}else return;
		},100)
	},	
	
	//地图关闭，将里面的内容清空（优化DON结构）
	mapSave	: function(){
		$(window).on('webkitTransitionEnd transitionend',mapClose);
		cw._scrollStart();
		$('.book-place').find('.place-con').removeClass('f-hide');
		cw._map.removeClass("mapOpen");

		if(!cw._mapValue) cw._mapValue = true;
		function mapClose(){
			// ----- 外部样式函数处理-----
			$('.book-place').find('h4.u-titile02 .back').removeClass('f-hide');
			//----- 外部样式函数处理-----end

			cw._map.removeClass('show');
			$(window).off('webkitTransitionEnd transitionend');
		}
	},

	//地图函数传值，创建地图
	addMap	: function (detal,latitude,longitude,fnOpen,fnClose){
		var detal		= detal,
			latitude	= Number(latitude),
			longitude	= Number(longitude);

		var fnOpen		= typeof(fnOpen)==='function'? fnOpen : '',
			fnClose		= typeof(fnClose)==='function'? fnClose : '';

		//默认值设定
		var a = {sign_name:'',contact_tel:'',address:'天安门'};

		//检测传值是否为空，设置传值
		cw._isOwnEmpty(detal)	? detal=a:detal=detal;
		!latitude? latitude=39.915:latitude=latitude;
		!longitude? longitude=116.404:longitude=longitude;
		
		//创建地图
		cw._map.ylmap({
			/*参数传递，默认为天安门坐标*/
			//需要执行的函数（回调）
			detal		: detal,		//地址值
			latitude	: latitude,		//纬度
			longitude	: longitude,	//经度
			fnOpen		: fnOpen,		//回调函数，地图开启前
			fnClose		: fnClose		//回调函数，地图关闭后
		});	
	},

	//绑定地图出现函数
	mapCreate	: function(){
		var node = $('.place-con').find('.con ul li');
		node.off('click');

		//option地图函数的参数
		var option ={
			fnOpen	: cw._scrollStop,
			fnClose	: cw.mapSave
		};
	
		cw.mapAddEventHandler(node,'click',cw.mapShow,option);
		node.on('click',function(){
			node.removeClass('on');
			$(this).addClass('on');
		})
	},

/**
 *  video电影模块功能
 *  -->绑定事件
 *  -->事件处理函数
 *  -->改变对应的图片显示
 */
	// video 触摸滑动 切换的函数处理
	// video_rotate	: function(){
	// 	var node = $('.m-video .video-con .video-move'),start,positionC,position=false,startP,mouseDown=false,
	// 		list = node.find('.video-list'),
	// 		width = list.find('p').width();

	// 	// 触摸开始
	// 	node.on('touchstart mousedown',function(e){
	// 		e.preventDefault();

	// 		if(e.type == "touchstart"){
	//         	startY = window.event.touches[0].pageY;
	//         	startX = window.event.touches[0].pageX;
	//         }else{
	//         	startY = e.pageY||e.y;
	//         	startX = e.pageX||e.x;
	//         	mouseDown = true;
	//         }
	//         start = true;
	//         positionC = true;
	// 	});

	// 	// 触摸移动
	// 	node.on('touchmove mousemove',function(e){
	// 		e.preventDefault();
	// 		if(position) e.stopPropagation();
	// 		if(!start) return;

	// 		var moveY,moveX,move=false;
	// 		if(e.type == "touchmove"){
	//         	moveY = window.event.touches[0].pageY;
	//         	moveX = window.event.touches[0].pageX;
	//         	move = true;
	//         }else{
	//         	if(mouseDown){
	//         		moveY = e.pageY||e.y;
	//         		moveX = e.pageX||e.x;
	//         		move = true;
	//         	}
	//         }
	//         if(!move) return;

	//         // 判断方向（左右和上下）
	//         if(positionC){
	//         	if(Math.abs(moveX-startX)>Math.abs(moveY-startY)+10) position = true;
	//         	else position = false;
	//         	positionC = false;
	//         }

	//         // 根据方向操作
	//         if(position){
	//         	e.stopPropagation();
	//         	var num = list.attr('data-num'),
	//         		rotate = parseInt(list.attr('data-rotate')),
	//         		size = list.find('img').size();
	//         	var scale;
	// 			if(cw._iPhoen) scale =1.5;
	// 			else scale = 1;

	// 			if(!cw._hasPerspective()){   // 不支持3d
	// 				if(Math.abs(moveX-startX)>=100&&moveX>startX){
	// 	        		if(num==1) return;
	// 	        		num--;
	// 					list[0].style[cw._prefixStyle('transform')] = 'translate(-'+(num-1)*width+'px,0)';
	// 	        		start = false;

	// 	        		// 手引隐藏
	// 	        		$('.m-video .video-con .arrow').removeClass('move');
	// 	        		$('.m-video .video-con .arrow').hide();
	// 	        	}else if(Math.abs(moveX-startX)>=100&&moveX<startX){
	// 	        		if(num==size) return;
	// 	        		num ++;
	// 	        		list[0].style[cw._prefixStyle('transform')] = 'translate(-'+(num-1)*width+'px,0)';
	// 	        		start = false;

	// 	        		// 手引隐藏
	// 	        		$('.m-video .video-con .arrow').removeClass('move');
	// 	        		$('.m-video .video-con .arrow').hide();
	// 	        	}
	// 			}else{		// 支持3d
	// 				if(cw._iPhoen){
	// 		        	if(Math.abs(moveX-startX)>=100&&moveX>startX){
	// 		        		if(num==size) return;
	// 		        		num ++;
	// 		        		list[0].style[cw._prefixStyle('transform')] = 'scale('+scale+') rotateY('+(-(num-1))*30+'deg)';
	// 		        		start = false;

	// 		        		// 手引隐藏
	// 		        		$('.m-video .video-con .arrow').removeClass('move');
	// 		        		$('.m-video .video-con .arrow').hide();

	// 		        	}else if(Math.abs(moveX-startX)>=100&&moveX<startX){
	// 		        		if(num==1) return;
	// 		        		num--;
	// 		        		list[0].style[cw._prefixStyle('transform')] = 'scale('+scale+') rotateY('+(-(num-1))*30+'deg)';
	// 		        		start = false;

	// 		        		// 手引隐藏
	// 		        		$('.m-video .video-con .arrow').removeClass('move');
	// 		        		$('.m-video .video-con .arrow').hide();
	// 		        	}
	// 		        }else{
	// 		        	if(Math.abs(moveX-startX)>=100&&moveX>startX){
	// 		        		if(num==1) return;
	// 		        		num--;
	// 		        		list[0].style[cw._prefixStyle('transform')] = 'scale('+scale+') rotateY('+(-(num-1))*30+'deg)';
	// 		        		start = false;

	// 		        		// 手引隐藏
	// 		        		$('.m-video .video-con .arrow').removeClass('move');
	// 		        		$('.m-video .video-con .arrow').hide();
	// 		        	}else if(Math.abs(moveX-startX)>=100&&moveX<startX){
	// 		        		if(num==size) return;
	// 		        		num ++;
	// 		        		list[0].style[cw._prefixStyle('transform')] = 'scale('+scale+') rotateY('+(-(num-1))*30+'deg)';
	// 		        		start = false;

	// 		        		// 手引隐藏
	// 		        		$('.m-video .video-con .arrow').removeClass('move');
	// 		        		$('.m-video .video-con .arrow').hide();
	// 		        	}
	// 		        }
	// 			}

	// 	        cw.video_img(num);
	// 	       	list.attr('data-num',num);
	// 	       	list.attr('data-rotate',rotate);
	//         }else{
	//         	return;
	//         }
	// 	});
	// },

	// // video 旋转显示对应的图片
	// video_img	: function(num){
	// 	var img = $('.m-video .video-con .video-list img'),
	// 		p = $('.m-video .video-con .video-list p'),
	// 		img_show = $('.video-show').find('img'),
	// 		tit_show = $('.video-con').find('h4 span');

	// 	p.removeClass('on');
	// 	p.eq(num-1).addClass('on');
	// 	tit_show.removeClass('on');
	// 	tit_show.eq(num-1).addClass('on');
	// 	img_show.hide();
	// 	img_show.eq(num-1).show();
	// },

/**
 *  wifiTV电视模块功能
 *  -->绑定事件
 *  -->事件处理函数
 *  -->改变对应的图片显示
 */
	// TV 轮播图展示
	TV_translate : function(){
		$('.m-wifiTV').each(function(){
			var	self = $(this),
				node = $(this).find('.wifiTv-mobile'),start,positionC,position=false,startP,mouseDown=false,
				list = node.find('ul'),
				li   = list.find('li'),
				size = li.size(),
				width = li.width(),
				widthR = width*(Math.sqrt(3)/2)-7;

			// 判断是否支持3d
			if(!cw._hasPerspective()){
				widthR = 0;
			}

			list.attr('data-num',Math.ceil(size/2));
			// 顶死第一章开始
			list.attr('data-num','1');

			// 触摸开始
			node.on('touchstart mousedown',function(e){
				e.preventDefault();

				if(e.type == "touchstart"){
		        	startY = window.event.touches[0].pageY;
		        	startX = window.event.touches[0].pageX;
		        }else{
		        	startY = e.pageY||e.y;
		        	startX = e.pageX||e.x;
		        	mouseDown = true;
		        }
		        start = true;
		        positionC = true;
			});

			// 触摸移动
			node.on('touchmove mousemove',function(e){
				e.preventDefault();
				if(position) e.stopPropagation();
				if(!start) return;

				var moveY,moveX,move=false;
				if(e.type == "touchmove"){
		        	moveY = window.event.touches[0].pageY;
		        	moveX = window.event.touches[0].pageX;
		        	move = true;
		        }else{
		        	if(mouseDown){
		        		moveY = e.pageY||e.y;
		        		moveX = e.pageX||e.x;
		        		move = true;
		        	}
		        }
		        if(!move) return;

		        // 判断方向（左右和上下）
		        if(positionC){
		        	if(Math.abs(moveX-startX)>Math.abs(moveY-startY)) position = true;
		        	else position = false;
		        	positionC = false;
		        }

		        // 根据方向操作
		        if(position){
		        	e.stopPropagation();
		        	var num = parseInt(list.attr('data-num')),next;

		        	if(Math.abs(moveX-startX)>=100&&moveX>startX){	//向右移动
		        		if(num==1) return;
		        		next = num - 1 ;
		        		
		        		if(!self.hasClass('m-wifiTV-pad')){
			        		// 下一个li的运动轨迹
			        		if(li.eq(num-2).attr('data-class')=='2'){
			        			li.eq(num-1).addClass('rotate02').attr('data-class','2');
			        		}else{
			        			li.eq(num-1).addClass('rotate01').attr('data-class','1');
			        		}
			        		li.eq(next-1).removeClass('rotate01 rotate02').attr('data-class','');

			        		for(var i=1;i<=size;i++){
			        			var x;
			        			x = parseInt(li.eq(i-1).attr('data-translate'));

			        			if(i==num){
			        				x = width+8;
			        				if(li.eq(i-1).attr('data-class')==2){
			        					x -= (width-widthR)
			        				}
			        			}
			        			if(i==next){
			        				x = 0;
			        			}else if(i!=num){
			        				x = x + widthR;
			        			}
			        			li.eq(i-1)[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px)';
			        			li.eq(i-1).attr('data-translate',x)
			        		}
		        		}else{
		        			li.eq(num-1).addClass('rotate02');
							li.eq(next-1).removeClass('rotate01');

		        			for(var i=1;i<=size;i++){
			        			var x,z,c,index;
			        			x = parseInt(li.eq(i-1).attr('data-translate'));
			        			z = parseInt(li.eq(i-1).attr('data-translateZ'));
			        			c = parseFloat(li.eq(i-1).attr('data-scale'));

			        			if(i>=num){
			        				x += 60;
			        				z -= 40;
			        				c -= 0.1;
			        				index = 50 - i + num;
			        				li.eq(i-1).css('z-index',index);
			        			}else{
			        				x += 60;
			        				z += 40;
			        				c += 0.1;
			        				index = 50 - num + i;
			        				li.eq(i-1).css('z-index',index);
			        			}
			        			
			        			li.eq(next-1).css('z-index',100);
								li.eq(i-1)[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px) translateZ('+z+'px) scale('+c+')';
								li.eq(i-1).attr('data-translate',x);
								li.eq(i-1).attr('data-translateZ',z);
								li.eq(i-1).attr('data-scale',c);
			        		}
		        		}

		        		num--;
		        		start = false;
		        	}else if(Math.abs(moveX-startX)>=100&&moveX<startX){	//向左移动
		        		if(num==size) return;
		        		next = num + 1 ;
						
						if(!self.hasClass('m-wifiTV-pad')){
							// 下一个li的运动轨迹
			        		if(li.eq(num).attr('data-class')=='2'){
			        			li.eq(num-1).addClass('rotate02').attr('data-class','2');
			        		}else{
			        			li.eq(num-1).addClass('rotate01').attr('data-class','1');
			        		}
			        		li.eq(next-1).removeClass('rotate01 rotate02').attr('data-class','');
			        		li.eq(next-1)[0].style[cw._prefixStyle('transform')] ='translateX(0)';

			        		for(var i=1;i<=size;i++){
			        			var y,x;
			        			x = parseInt(li.eq(i-1).attr('data-translate'));
			        			if(i==num){
			        				x = -width-8;
			        				if(li.eq(i-1).attr('data-class')==1){
			        					x += (width-widthR)
			        				}
			        			}
			        			if(i==next){
			        				x = 0;
			        			}else if(i!=num){
			        				x = x - widthR;
			        			}
			        			li.eq(i-1)[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px)';
								li.eq(i-1).attr('data-translate',x)
			        		}
						}else{
							li.eq(num-1).removeClass('rotate02').addClass('rotate01');
							li.eq(next-1).removeClass('rotate02');

							for(var i=1;i<=size;i++){
			        			var x,z,c,index;
			        			x = parseInt(li.eq(i-1).attr('data-translate'));
			        			z = parseInt(li.eq(i-1).attr('data-translateZ'));
			        			c = parseFloat(li.eq(i-1).attr('data-scale'));

			        			if(i>num){
			        				x -= 60;
			        				z += 40;
			        				c += 0.1;
			        				index = 50 - i + num;
			        				li.eq(i-1).css('z-index',index);
			        			}else{
			        				x -= 60;
			        				z -= 40;
			        				c -= 0.1;
			        				index = 50 - num + i;
			        				li.eq(i-1).css('z-index',index);
			        			}

			        			li.eq(next-1).css('z-index',100);
								li.eq(i-1)[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px) translateZ('+z+'px) scale('+c+')';
								li.eq(i-1).attr('data-translate',x);
								li.eq(i-1).attr('data-translateZ',z);
								li.eq(i-1).attr('data-scale',c);
			        		}							
						}
		        		
		        		num ++;
		        		start = false;
		        	}

		       		cw.wifiTV_img(self,num);
			       	list.attr('data-num',num);
		        }else{
		        	return;
		        }
			});
		})
	},

	// TV图片轮播
	wifiTV_move : function(node,num){
		node.each(function(){
			var self = $(this),
				liNode = $(this).find('.wifiTv-mobile ul li'),
				liNode_size = liNode.size(),
				width = liNode.width(),
				li_num,next;

			if(typeof(num) == 'undefined'){
				li_num = Math.ceil(liNode_size/2);	//中间那个值
			}else{
				li_num = num;
			}

			// 顶死第一章开始
			li_num = 1;
			next = li_num+1;

			cw.wifiTV_img(self,li_num);

			for(var j =1;j<=liNode_size;j++){ 
				var l,x;
				// 等于li_num的位置continue
				if(typeof(num) == 'undefined'){
					if(j == li_num){
						if(self.hasClass('m-wifiTV-pad')){
							liNode.eq(li_num-1).css('z-index',50);
							liNode.eq(j-1).attr('data-translate',0);
							liNode.eq(j-1).attr('data-translateZ',0);
							liNode.eq(j-1).attr('data-scale','1');
						}
						continue;
					}
					addC();
				}
				move();
			}

			// 判断位置的奇偶加Class
			// 根据奇偶来添加class
			function addC(){
				if(!self.hasClass('m-wifiTV-pad')){
					if(j>li_num){
						l = j - li_num;
						if(l % 2 ==0 ){
							liNode.eq(j-1).addClass('rotate02').attr({'data-class':'2'});
						}else{
							liNode.eq(j-1).addClass('rotate01').attr({'data-class':'1'});
						}
					}else if(j<li_num){
						l = li_num - j;
						if(l % 2 ==0 ){
							liNode.eq(j-1).addClass('rotate01').attr({'data-class':'1'});
						}else{
							liNode.eq(j-1).addClass('rotate02').attr({'data-class':'2'});
						}
					}
				}else{
					l = j;
					liNode.eq(j-1).addClass('rotate02').attr({'data-class':'2'});
				}
			}

			// move平移方法
			// 根据算法来平移
			// 7为精确值（5-10）
			function move(){
				if(!self.hasClass('m-wifiTV-pad')){
					move_mb();
				}else{
					move_pad();
				}
				
			}

			// 手机样式移动
			function move_mb(){
				if(liNode.eq(next-1).attr('data-class')=='2'){
					if(l%2!=0){
						x = l*(width-width*(Math.sqrt(3)/2)+7);
					}else{
						x = (l-1)*(width-width*(Math.sqrt(3)/2)+7);
					}
				}else{
					x = Math.floor(l/2)*(width-width*(Math.sqrt(3)/2)+7)*2;
				}

				// 判断是否支持3d
				if(!cw._hasPerspective()){
					x = 0;
				}

				if(j<li_num){
					x = -(width+8+width*(l-1) - x);
				}else{
					x = width+8+width*(l-1) - x;
				}

				// 平移
				liNode.eq(j-1)[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px)';
				liNode.eq(j-1).attr('data-translate',x);
			}

			// 平板样式移动
			function move_pad(){
				var	z = -(l-1)*40;

				x = 60*(l-1);
				c = 1 - 0.1*(l-1);

				// 平移
				liNode.eq(j-1).css('z-index',50-l);
				liNode.eq(j-1)[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px) translateZ('+z+'px) scale('+c+')';
				liNode.eq(j-1).attr('data-translate',x);
				liNode.eq(j-1).attr('data-translateZ',z);
				liNode.eq(j-1).attr('data-scale',c);
			}
		})
	},

	// wifiTV 移动显示对应的图片
	wifiTV_img	: function(self,num){
		var img = self.find('.wifiTv-mobile ul li p img'),
			p = self.find('.wifiTv-mobile ul li p'),
			img_show = self.find('.wifiTv-tv .tv-show').find('img'),
			tit_show = self.find('.wifiTv-tv h4').find('span'),
			wifi = self.find('.wifi_icon_m'),
			arrowL = self.find('.wifiTv-mobile .arrow-left'),
			arrowR = self.find('.wifiTv-mobile .arrow-right');

		p.removeClass('on');
		p.eq(num-1).addClass('on');

		var	src = img.eq(num-1).attr('data-src');

		tit_show.removeClass('on');
		tit_show.eq(num-1).addClass('on');
		img_show.hide();
		img_show.eq(num-1).show();

		// 动画开始
		clearTimeout(cw._wifi_time);
		wifi.addClass('move');
		cw._wifi_time = setTimeout(function(){
			wifi.removeClass('move');
		},600);

		// 根据位置判断手势哪个显示
		var size = img.size();
		if(num==1){
			arrowR.addClass('f-hide');
		}else if(num==size){
			arrowL.addClass('f-hide');
		}else{
			arrowL.removeClass('f-hide');
			arrowR.removeClass('f-hide');
		}
	},

/**
 *  audio声音插件的加载控制
 *  -->绑定声音控制事件
 *  -->函数处理声音的开启和关闭
 *  -->异步加载声音插件（延迟做）
 */
 	// 声音事件绑定
 	audio_addEvent : function(){
 		// 声音按钮点击事件
 		cw._audioNode.find('.audio_btn').on('click',cw.audio_contorl);
 	},

 	// 声音控制函数
 	audio_contorl : function(){
 		if(!cw._audio_val){
 			cw.audio_stop();
 			cw._audioNode.find('span.audio_open').addClass('f-hide');
 			cw._audioNode.find('span.audio_close').removeClass('f-hide');
 		}else{
 			cw.audio_play();
 			cw._audioNode.find('span.audio_open').removeClass('f-hide');
 			cw._audioNode.find('span.audio_close').addClass('f-hide');
 		}
 	},	

 	// 声音播放
 	audio_play : function(){
 		cw._audio_val = false;
 		if(cw._audio.length>=1) cw._audio[0].play();
 	},

 	// 声音停止
 	audio_stop	: function(){
 		cw._audio_val = true;
 		if(cw._audio.length>=1) cw._audio[0].pause();
 	},

 	// 判断是否开启声音，并开启声音
 	audio_bool	: function(){
 		// 开启声音
        if(cw._audio_start){
        	cw.audio_play();
        	cw._audio_start = false;
        	cw._audio_val = false;
        }
 	},

/**
 *  图片延迟加载功能
 *  -->替代需要延迟加载的图片
 *  -->优化加载替代图片
 *  -->切换功能触发图片的延迟加载
 *  -->替代图片为400*400的透明大图片
 */
	/* 图片延迟加载 */
	lazy_img : function(){
		var lazyNode = $('.lazy-img');
		lazyNode.each(function(){
			var self = $(this);
			if(self.is('img')){
				self.attr('src','invitation/images/609/loading_larger.png');
			}else{
				// 把原来的图片预先保存下来
				var position = self.css('background-position'),
					size = self.css('background-size');

				self.attr({
					'data-position' : position,
					'data-size'	: size
				});

				if(self.attr('data-bg')=='no'){
					self.css({
						'background-repeat'	: 'no-repeat'
					})
				}

				self.css({
					'background-image'	: 'url(invitation/images/609/loading_larger.gif)',
					'background-size'	: '120px 120px',
					'background-position': 'center'
				})

				if(self.attr('data-image')=='no'){
					self.css({
						'background-image'	: 'none'
					})
				}
			}
		})
	},

	// 开始加载前三个页面
	lazy_start : function(){
		// 前三个页面的图片延迟加载
		setTimeout(function(){
			for(var i=0;i<3;i++){
				var node = $(".m-page").eq(i);
				if(node.length==0) break;
				if(node.find('.lazy-img').length!=0){
					cw.lazy_change(node,false);
					// 飞出窗口的延迟
					if(node.attr('data-page-type')=='flyCon'){
						cw.lazy_change($('.m-flypop'),false);
					}
				}else continue;
			}
		},200)
	},
	
	// 加载当前后面第三个
	lazy_bigP : function(){
		for(var i=3;i<=5;i++){
			var node = $(".m-page").eq(cw._pageNow+i);
			if(node.length==0) break;
			if(node.find('.lazy-img').length!=0){
				cw.lazy_change(node,true);
				// 飞出窗口的延迟
				if(node.attr('data-page-type')=='flyCon'){
					cw.lazy_change($('.m-flypop'),false);
				}
			}else continue;
		}
	},

	// 图片延迟替换函数
	lazy_change : function(node,goon){
			// 3d图片的延迟加载
			if(node.attr('data-page-type')=='3d') cw.lazy_3d(node);

			// 飞出窗口的延迟
			if(node.attr('data-page-type')=='flyCon'){
				var img = $('.m-flypop').find('.lazy-img');
				img.each(function(){
					var self = $(this),
						srcImg = self.attr('data-src');

					$('<img />')
						.on('load',function(){
							if(self.is('img')){
								self.attr('src',srcImg)
							}
						})
						.attr("src",srcImg);
				})
			}

			// 其他图片的延迟加载
			var lazy = node.find('.lazy-img');
			lazy.each(function(){
				var self = $(this),
					srcImg = self.attr('data-src'),
					position = self.attr('data-position'),
					size = self.attr('data-size');

				if(self.attr('data-bg')!='no'){
					$('<img />')
						.on('load',function(){
							if(self.is('img')){
								self.attr('src',srcImg)
							}else{
								self.css({
									'background-image'	: 'url('+srcImg+')',
									'background-position'	: position,
									'background-size' : size
								})
							}

							// 判断下面页面进行加载
							if(goon){
								for(var i =0;i<$(".m-page").size();i++){
									var page = $(".m-page").eq(i);
									if($(".m-page").find('.lazy-img').length==0) continue
									else{
										cw.lazy_change(page,true);
									}
								}
							}
						})
						.attr("src",srcImg);

					self.removeClass('lazy-img');
				}else{
					if(self.attr('data-auto')=='yes') self.css('background','none');
				}
			})	
	},

	// 3d展示图片的延迟加载
	lazy_3d	: function(node){
		var img = node.find('.imgbox-3d .img').find('img'),
			size = img.size(),
			node_3d;

		node.attr('data-3d',0);

		// 3d图片加载
		img.each(function(){
			var _img = $(this);
			$('<img />')
				.on('load',function(){
					_img.attr('src',_img.attr('data-src'));
					node_3d = parseInt(node.attr('data-3d'));
					node_3d ++;
					node.attr('data-3d',node_3d);

					if(node_3d == size){
						var num;
						$('.m-3dDisplay').addClass('s-bg-fff');
						node.find('.imgbox-3d .img').css('background','none');
						$('.imgbox-3d p').show();
						// 第一张从第31张开始
						if(size<31){
							num = Math.ceil(size/2);
							img.eq(num-1).show(0);
						}else{
							img.eq(30).show(0);
							num = 31;
						}
						// 3d开始旋转
						$.fn.yl3d.start(num);
					}
				})	
				.attr('src',_img.attr('data-src'));
		})

		node.find('.imgbox-3d .img').removeClass('lazy-img');
	},

/**************************************************************************************************************/
/*  单个处理函数
***************************************************************************************************************/
	// 工艺页面切换成功后，子内容进场函数处理
	// --传入的值有ele和time
	// --ele为需要操作的元素
	// --time为每一个子内容进来的间隔
	ele_in	: function(val,callback){
		$list = val[0];
		$.each($list,function(i,n){
			function a(){
				$(n).addClass("show");
				callback();
			}
			var jiange = i*val[1];
			setTimeout(a,jiange);
		});
	},

	// 根据设备的高度，来适配每一个模版的高度，并且静止滑动
	// --文档初始化计算
	// --页面切换完成计算
	height_auto	: function(ele,val){
		ele.children('.page-con').css('height','auto');
		var height = cw._windowHeight;
		if(ele.attr('data-page-type')=='flyCon'||ele.attr('data-page-type')=='crafts'||ele.attr('data-page-type')=='link'){
			if(ele.height()<=height){
				ele.children('.page-con').outerHeight(height);
				if((!$('.p-ct').hasClass('fixed'))&&val=='true') $('.p-ct').addClass('fixed');
			}else{
				cw._scrollStart();
				if(val=='true') $('.p-ct').removeClass('fixed');
				ele.children('.page-con').css('height','100%');
				return;
			}
		}else{
			ele.children('.page-con').outerHeight(height);
			if((!$('.p-ct').hasClass('fixed'))&&val=='true') $('.p-ct').addClass('fixed');
		}
		if(ele.attr('data-page-type')=='video'){
			ele.find('.video-img').height(height-420);
		}
	},

	// 飞入的内容模块滑动控制
	// -->绑定滑动手势
	fly_con	: function(){
		$('.flyInPop-con').on('touchstart',function(){
			cw._touchStartValY = window.event.touches[0].pageY;
		});

		$('.flyInPop-con').on('touchmove',function(e){
			//冒泡处理，单独处理flyPopCon的move移动事件
			e.stopPropagation();	
			e.preventDefault();
			var moveP = window.event.touches[0].pageY,
				scrollTop = $(this).scrollTop();

			$(this).scrollTop(scrollTop+cw._touchStartValY-moveP);
			cw._touchStartValY = moveP;
		});
	}(),

	// 功能介绍页面的菜单点击变化--funs-2
	// --插件旋转选择对应的图片
	funs_menus : function(){
		var fun = $('.m-funs');
		fun.each(function(){
			var menu = $(this).find('.funs-menu ul li');
			var txt = $(this).find('.funs-show').find('.txt');

			menu.eq(0).addClass('on');
			txt.eq(0).addClass('on');

			menu.on('click',function(){
				var index = $(this).index();
				menu.removeClass('on');
				$(this).addClass('on');
				txt.removeClass('on');
				txt.eq(index).addClass('on');
			})
		})
	}(),

	// 功能介绍菜单滑动显示--funs-2
	// funs_menu_move : function(){
	// 	var node = $('.m-funs-2 .funs-menu ul'),
	// 		startX=0,mouseDown=false,moveX,del,
	// 		minW = 0,x,
	// 		maxW = node.width()-640;

	// 	node.on('touchstart mousedown',function(e){
	// 		if(e.type == "touchstart"){
	//         	startX = window.event.touches[0].pageX;
	//         }else{
	//         	startX = e.pageX||e.x;
	//         	mouseDown = true;
	//         }

	//         node.removeClass('move');
	// 	});

	// 	// 触摸移动
	// 	node.on('touchmove mousemove',function(e){
	// 		e.stopPropagation();
	// 		e.preventDefault();
	// 		var move;

	// 		if(e.type == "touchmove"){
	//         	moveX = window.event.touches[0].pageX;
	//         	move = true;
	//         }else{
	//         	if(mouseDown){
	//         		moveX = e.pageX||e.x;
	//         		move = true;
	//         	}
	//         }

	//         if(!move) return;

	//         x = parseInt(node.attr('data-translate'));
	//         x = x + moveX - startX;
	//        	node[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px)';
	//     })

	//     // 触摸结束
	//     node.on('touchend mouseup',function(e){
	// 		if(x>minW){
	// 			x = 0;
	// 			node.addClass('move');
	// 			node[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px)';
	// 		}else if(x<=-maxW){
	// 			x = -maxW;
	// 			node.addClass('move');
	// 			node[0].style[cw._prefixStyle('transform')] ='translateX('+x+'px)';
	// 		}

	// 		node.attr('data-translate',x);

	// 		startX=0;
	// 		mouseDown=false;
	//     })	
	// },
	
	// 预约导航启动
	book_location	: function(){
		$('.book-way').find('.way p.map').on('click',function(){
			// 取消页面切换和静止滑动
			cw.page_stop();
			// 开启滚动
			cw._scrollStart();

			$('.book-place').find('h4.u-titile02').find('a.back').attr('data-type','place');
			
			$(document.body).animate({scrollTop: 0}, 0, "easeOutSine");
			$('.book-place').removeClass('f-hide');
			setTimeout(function(){
				$('.book-place').removeClass('hide');
				
				setTimeout(function(){
					$('.p-ct').removeClass('fixed');

					$('.book-way').addClass('f-hide');
					$('.book-place').addClass('inherit');

					cw.mapConHeight(cw._page.eq(cw._pageNow));

					$(window).off('webkitTransitionEnd transitionend');
				},600)
			},200)
		})
	}(),
	
	// 预约导航结束
	book_location_back : function(){
		$('.book-place').find('h4.u-titile02').find('a.back').on('click',function(){
			var type = $(this).attr('data-type');
			if(type=='map'){
				cw._map.removeClass("mapOpen open");
				cw.mapSave();
				$(this).attr('data-type','place');
			}else if(type=='place'){
				// 开启页面切换
				cw.page_start();
				// 禁止滚动
				cw._scrollStart();

				$('.p-ct').addClass('fixed');

				$('.book-place').removeClass('inherit').addClass('hide');
				$('.book-way').removeClass('f-hide');
				// cw.height_auto(cw._page.eq(cw._pageNow),'true');
				cw.mapConHeight(cw._page.eq(cw._pageNow));

				setTimeout(function(){
					$('.book-place').addClass('f-hide');
					$(this).attr('data-type','');

					$(window).off('webkitTransitionEnd transitionend');
				},600)
			}else{
				return false;
			}
		})
	}(),

	// 预约选择地点
	book_place	: function(){
		var aNode = $('.place-con').find('.top a');
		aNode.on('click',function(){
			var self = $(this),
				popup = $('.m-popup_book'),
				ulNode = popup.find('ul');

			// 清楚ul里面的内容
			ulNode.html('');

			// 禁止滑动
			cw.page_stop();
			cw._scrollStop();

			ulNode.on('touchmove',function(e){
				e.stopPropagation();
			});

			// 显示选择层
			popup.removeClass('f-hide');
			setTimeout(function(){
				popup.addClass('show');
				setTimeout(function(){
					popup.find('.popup-con').addClass('show');
				},500)
			},100)
			
			var	areaId = 0,
				areaName = '';
			if(self.prev().size()==0){
				areaId = 0;
				areaName = '';
			}else{
				areaId = self.prev().find('span').first().attr('data-areaId');
				areaName = self.prev().find('span').first().text();
			}
			if(cw._areaId!=areaId){
				$('.m-popup_book').find('.page-loading').show();
				cw.getShopData(areaId,areaName,1,15,function(){
					$('.m-popup_book').find('.page-loading').hide();
					cw.setAddress(self);
				});
			}else{
				cw.setAddress(self);
			}
			
			// 关闭窗口，不选择
			popup.on('click',function(e){
				e.stopPropagation();
				if(e.target.className.indexOf('m-popup_book')==-1){
					return;
				}
				cw.popupback();
			})
		})
	}(),
	
	//关闭选择地址窗口
	popupback : function(){
		$('.m-popup_book').find('.popup-con').removeClass('show');
		setTimeout(function(){
			$('.m-popup_book').removeClass('show');
			setTimeout(function(){
				$('.m-popup_book').addClass('f-hide');
				cw._scrollStart();
			},600)
		},400)
	},
	
	//设置选择分店地址
	setAddress : function(self){
		if('1'==cw._shopJson.success){
			var ulNode = $('.m-popup_book').find('ul');
			var l = cw._shopJson.address.length,
				i = 0;
			for(;i<l; i++){
				var li = $('<li data-areaId="'+cw._shopJson.address[i].areaId+'">'+cw._shopJson.address[i].name+'</li>');
				ulNode.append(li);
			}
			// 选择地址
			var liNode = ulNode.find('li');
			liNode.on('click',function(){
				var text = $(this).text(),
					areaId = $(this).attr('data-areaId'),
					areaName = $(this).text();
				self.find('span').first().text(text);
				self.next().find('span').first().text('');
				self.next().next().size()>0?self.next().next().find('span').first().text(''):'';
				self.find('span').first().attr('data-areaId',areaId);
				$(this).addClass('on');
				
				$('.con').find('.page-loading').show();
				cw.getShopData(areaId,areaName,1,15,function(){
					$('.con').find('.page-loading').hide();
					cw.setShopName();
				});
				cw.popupback();
			});
		}
	},

	//设置分店名称
	setShopName : function(){
		if('1'==cw._shopJson.success){
			var i = 0,
				d = cw._shopJson.shop.length;
			//显示分店
			$('.place-con').find('.con ul').empty();
			if(d==0){
				$('.place-con').find('.con ul').append('<li style="text-align:center;font-size:30px;line-height:34px;">暂无分店</li>');
			}
			for(i=0; i<d; i++){
				if(!cw._shopJson.shop[i].latitude || !cw._shopJson.shop[i].longitude)continue;
				var li = $('<li></li>'),
					h5 = $('<h5 class="f-size30"></h5>'),
					p = $('<p class="f-size24"></p>'),
					span = '<span class="loc_icon css_sprite01 s-bg-book_location02"></span>'+
						   '<span class="sel_icon css_sprite01 s-bg-book_location03"></span>';
				h5.text(cw._shopJson.shop[i].name);
				p.text('地址：'+cw._shopJson.shop[i].address);
				li.attr({'data-lat':cw._shopJson.shop[i].latitude,'data-lng':cw._shopJson.shop[i].longitude,'data-mapIndex':cw._shopJson.shop[i].address});
				li.append(h5);
				li.append(p);
				li.append(span);
				$('.place-con').find('.con ul').append(li);
			}
			cw.mapCreate();
			cw.mapConHeight(cw._page.eq(cw._pageNow));
		}
	},
	
	//从接口获得分店数据
	getShopData : function(areaId, name, page, limit, callback){
		var activity_id = $('#activity_id').val();
		var city = $('a[data-type="city"]').find('span').eq(0).text();
		var url = '/skyworth/get_shop/'+activity_id+'?t='+new Date().getTime();
		$.get(url,{areaId:areaId, name:name, city:city ,page:page, limit:limit},function(msg){
			var json = eval(msg);
			cw._shopJson = json;
			cw._areaId = areaId;
			if(typeof(callback)=='function'){
				callback();
			}
		},'json');
	},

	// 判断显示区域的高度
	mapConHeight : function(ele){
		var height = cw._windowHeight;
		ele.children('.page-con').css('height','auto');

		if(ele.height()<=height){
			ele.children('.page-con').outerHeight(height);
		}
	},
	
	// 开启关闭页面loading false 关闭， true开启
	pageLoading : function(w){
		if(w){
			$('.pageLoading').show();
		}else{
			$('.pageLoading').hide();
		}
	},

	// 微信分享
	wx_share : function(){
		$('.m-book .book-way .way p.share').on('click',function(){
			cw._audioNode.addClass('f-hide');
			if(typeof(cw._weixin)=='undefined') return;
			if(cw._weixin){
				$('.wx-share').removeClass('f-hide');
			}else{
				alert('请用微信打开分享');
			}
			$('.wx-share').on('click',function(){
				cw._audioNode.removeClass('f-hide');
				$('.wx-share').addClass('f-hide');
				$(this).off('click');
			})
		})
	}(),

	// 没有动画-初始化函数
	_animate : function(img){
		if(img=='true'){
			var img =  $('.m-fengye').find('.img img');
			img.addClass('show');
		}

		// 显示箭头指引
		$('.transformNode-front .u-arrow').show(300);
		$('.transformNode-front .u-arrow').addClass('move');	

		// 绑定旋转开启的事件
		if(cw._rotateVal){
			if(cw._hasPerspective()) $('.transformNode-front .u-arrow').on('click',cw.page_rotate3d);
			else $('.transformNode-front .u-arrow').on('click',cw.page_rotate2d);

			cw.frontTouchOpen();
		}
	},

	// 显示轻APP按钮
	lightapp_intro_show : function(){
		$('.market-notice').removeClass('f-hide');
		setTimeout(function(){
			$('.market-notice').addClass('show');
		},100)
	},

	// 隐藏轻APP按钮
	lightapp_intro_hide : function(val){
		if(val){
			$('.market-notice').addClass('f-hide').removeClass('show');
			return;
		} 

		$('.market-notice').removeClass('show');
		setTimeout(function(){
			$('.market-notice').addClass('f-hide')
		},500)
	},

	// 轻APP介绍弹窗关联
	lightapp_intro : function(){
		// 点击按钮显示内容
		$('.market-notice').off('click');
		$('.market-notice').on('click',function(){
			$('.market-page').removeClass('f-hide');
			setTimeout(function(){
				$('.market-page').addClass('show');
				setTimeout(function(){
					$('.market-img').addClass('show');
				},100)
				cw.lightapp_intro_hide();
			},100)

			// 禁止滑动
			cw.page_stop();
			cw._scrollStop();
		});

		// 点击窗口让内容隐藏
		$('.market-page').off('click');
		$('.market-page').on('click',function(e){
			if($(e.target).hasClass('market-page')){
				$('.market-img').removeClass('show');
				setTimeout(function(){
					$('.market-page').removeClass('show');
					setTimeout(function(){
						$('.market-page').addClass('f-hide');
					},200)
				},500)
				cw.lightapp_intro_show();

				// 禁止滑动
				cw.page_start();
				cw._scrollStart();
			}
		});
	},

	// 对象私有变量刷新
	refresh	: function(){
		cw._windowHeight = $(window).height();
	},

/**************************************************************************************************************/
/*  函数初始化
***************************************************************************************************************/
/**
 *  相关插件的启动
 */
	//插件启动函数
 	plugin : function(){
 		// 轮播图
 		$('.m-imgBox').each(function(){
 			$(this).ylSlider({
 				btn_col_on	: '#0e62ae',
 				lazy 		: 'true'
 			});
 		})

 		// 3d展示
 		$('.imgbox-3d').each(function(){
 			$(this).yl3d({
	 			lazy : true
	 		});
 		})
		
		// 地图
		cw.mapCreate();
 	},

 	// SVG动画初始化函数
	svginit : function () {
		$('.m-fengye .img svg').attr('class','');
		var svg = $('#chuangwei_svg')[0];
		if(svg){
			svg = new SVGEl( svg );
			svg.render();
		}else{
			cw._animate('true');
		}
	},
	
	//处理声音和动画的切换
	mediaInit : function(){
		cw._audio.on('play', function(){
			$('video').each(function(){
				if(!this.paused){
					this.pause();
				}
			});	
		});
		$('video').on('play', function(){
			if(!cw._audio_val){
				cw.audio_contorl();			
			}
		});
	},
	
	//给关联页面绑定事件
	initLink : function(){
		$('.wx-down-notice').on('click', function(){
			$('.wx-down-notice').removeClass('show');
		});
		$('.window-href').on('click', function(){
			if($(this).attr('data-down')=='1' && cw._weixin){
				$('.wx-down-notice').addClass('show');
			}else{
				window.location.href = $(this).attr('data-href');
			}
		});
	},
	

/*
** 页面初始化
*/	
	// 样式适配
	styleInit : function(){
		// 判断设备的类型并加上class
		if(cw._IsPC()) $(document.body).addClass('pc');
		else $(document.body).addClass('mobile');
		if(cw._Android) $(document.body).addClass('android');
		if(cw._iPhoen) $(document.body).addClass('iphone');

		// 判断是否有3d
		if(!cw._hasPerspective()){
			cw._rotateNode.addClass('transformNode-2d');
			$(document.body).addClass('no-3d');
		}
		else{
			cw._rotateNode.addClass('transformNode-3d');
			$(document.body).addClass('perspective');
			$(document.body).addClass('yes-3d');
		}

		// 显示对应的页面
		cw._page.eq(cw._pageNow).removeClass('f-hide');

		// 隐藏，让让内容和动画同步开始
		$('.m-fengye').find('.page-con').addClass('f-hide');

		// video图片旋转样式
		// var img = $('.m-video .video-con .video-list p'),
		// 	span_tit = $('.video-con').find('h4 span'),
		// 	img_show = $('.video-show').find('img'),
		// 	img_list = img.parent(),
		// 	img_size = img.size(),
		// 	img_num = Math.ceil(img_size/2);	//中间那个值

		// if(cw._hasPerspective()){		// 3d
		// 	for(var i =0;i<img_size;i++){ img.eq(i)[0].style[cw._prefixStyle('transform')] = 'rotateY('+i*30+'deg)'; }

		// 	var scale;
		// 	if(cw._iPhoen) scale =1.5;
		// 	else scale = 1;
		// 	img_list[0].style[cw._prefixStyle('transform')] = 'scale('+scale+') rotateY('+(-(img_num-1))*30+'deg)';
		// 	img_list.attr('data-num',img_num);
		// 	img_list.attr('data-rotate',(-(img_num-1))*30);
		// }else{		// 2d
		// 	var width = img.width()+20;
		// 	for(var i =0;i<img_size;i++){ img.eq(i)[0].style[cw._prefixStyle('transform')] = 'translate('+i*width+'px,0)'; }

		// 	img_list[0].style[cw._prefixStyle('transform')] = 'translate(-'+(img_num-1)*width+'px,0)';
		// 	img_list.attr('data-num',img_num);
		// }	
		// cw.video_img(img_num);
		// img_list.addClass('move');

		// wifiTV图片平移
		var wifiTV = $('.m-wifiTV');
		cw.wifiTV_move(wifiTV);

		// 地图的高度
		$('.m-book .ylmap').css('height',cw._windowHeight-90);
	},

	// 对象初始化
	init : function(){
		// 样式，标签的渲染
		// 插件初始化,启动
		// 对象操作事件处理
		this.styleInit();
		this.haddle_envent_fn();
		this.plugin();
		this.lazy_img();

		// 功能的绑定以及执行
		this.flyPopupOpen();
		// this.video_rotate();
		this.TV_translate();
		this.audio_addEvent();
		// 产品关联的链接
		// 视频和音频播放的单一进行
		this.mediaInit();
		this.initLink();
		
		// 禁止滑动
		cw._scrollStop();

		// 绑定全局事件函数处理
		$(window).on('resize',function(){
			cw.refresh();
		})
		
		$(window).on('load',function(){
			// 显示封面内容
			$('.m-fengye').find('.page-con').removeClass('f-hide');

			// 必要的动画加载完毕开始执行动画和内容显示
			$('.transformNode-front .u-audio').removeClass('f-hide');

			// 动画开始
			setTimeout(cw.svginit(),500);

			// 延迟加载后面三个页面图片
			cw.lazy_start();
		})
	}
};

/*初始化对象函数*/
cw.init();


