/**
 *  轮播图插件
 *  -----------------------------
 *  作者：叼怎么写！- -||
 *  时间：2014-03-12
 *  准则：Jquery插件
 *  联系：wechat--shoe11414255
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 ******************************************************************************************
 * 
 *	这是个半成品--技术不到家--努力努力 ^-^||
 *	
 * -----------保持队形------------------
 *  <div class="targetBox">
		<div class="imgSlider">
			<input type="hidden" value="src" />
		</div>
	</div>
 *********************************************************************************************/
;(function($){
	$.fn.ylSlider = function(options){
		// 默认参数
		$.fn.ylSlider.defaults = {
			auto 		: 'true',		// 开启图片自动轮播
			autotime 	: 5000, 		// 自动轮播时间
			width 		: '',			// 轮播图的宽度
			btn_auto	: true,			// 是不是生成btn标识标志
			btn_col 	: '#7b7775',	// 按钮不提示的颜色
			btn_col_on	: '#3282c5',	// 按钮提示的颜色
			pos_img		: 'left', 		// 轮播图方向（左右）
			lazy 		: 'false'		// 是否启动图片延迟加载
		};
		
		/* 初始值继承 */
		var opts = $.extend({},$.fn.ylSlider.defaults, options);

		/* 适配css属性到浏览器中 */
		_elementStyle = document.createElement('div').style;	
		function _vendor() {
			var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
				transform,
				i = 0,
				l = vendors.length;
	
			for ( ; i < l; i++ ) {
				transform = vendors[i] + 'ransform';
				if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
			}
			return false;
		}
		function _prefixStyle(style) {
			if ( _vendor() === false ) return false;
			if ( _vendor() === '' ) return style;
			return _vendor() + style.charAt(0).toUpperCase() + style.substr(1);
		}

		return this.each(function(){
			var targetBox = $(this);										//获取到插件外层对象（div-imgSlider）
			/*
			**自动根据input传入的src值生成li-img标签
			*/
			var srcVal = targetBox.find('input[type="hidden"]').val(),		//轮播图片的地址值
            	urls = srcVal.split(","),									//将整个地址值存放一个数组中
            	imageNum = urls.length;										//计算要加载的个数
           		targetBox.find('input[type="hidden"]').remove();

            var width = opts.width ? opts.width : targetBox.width() ? targetBox.width() : 640,
            	lengths	= imageNum <=1 ? imageNum : imageNum + 2,
            	timeVal	= null,
            	imgNow	= 2;

            /*
			**生成轮播插件容器imgSlider 
			**生成2个ul容器，imgSlider-img 和 imgSlider-btn
            */
            var img 	=null ,
            	imgBox  =null ,
           		btnBox  =null ;

            if(targetBox.find(".imgSlider").length<=0)
            	img = $('<div></div>').addClass("imgSlider");			
            if(targetBox.find(".imgSlider-img").length<=0)
           		imgBox = $('<ul></ul>').addClass("imgSlider-img");		
           	if(targetBox.find(".imgSlider-btn").length<=0&&opts.btn_auto)
            	btnBox = $('<ul></ul>').addClass("imgSlider-btn");

            var imgSlider = img||targetBox.find(".imgSlider");
            img ? imgSlider.append(imgBox).append(btnBox).appendTo(targetBox) : imgSlider.append(imgBox).append(btnBox);	 //将生成的容器追加到targetBox里

            // 生成图片，并对应的格式
            function init_img(){
	            for(var i=0; i<imageNum; i++){
	            	if(opts.lazy!='false'){
  						$('<li><span></span><img class="lazy-img" /></li>').appendTo(imgBox).find('img').attr({'data-src':urls[i]});
	            	}else{
	            		$('<li><img class="lazy-img" /></li>').appendTo(imgBox).find('img').attr({'src':urls[i]});
	            	}
                  
                    $('<li></li>').appendTo(btnBox);
                    if(imageNum == 1) btnBox.hide();
                }

                if(lengths>1){
                	imgBox.children().first().clone().appendTo(imgBox);
					imgBox.children().last().prev().clone().prependTo(imgBox);
					imgBox[0].style[_prefixStyle('transform')] = 'translate(-'+width+'px,0) translateZ(0)';
					imgBox.attr('data-translate',-width);

					btnBox.children().eq(imgNow-2).addClass('on');
                }
                
				imgBox.width(width*lengths);

				if(lengths>1) start();
            }

            var firstPoint 		= null,

            	movePosition_c  = true,
            	movePosition 	= null,
            	moveInit		= false,

            	_touchStart 	= true,
            	touchDelat		= 0,

            	mouseDown 		= null;

            // 轮播图开始
            function start(){
            	imgBox.on('touchstart mousedown',touch_start);
		 		imgBox.on('touchmove mousemove',touch_move);
		 		imgBox.on('touchend mouseup',touch_end);
            }

            // 轮播图停止
            function stop(){
            	imgBox.off('touchstart mousedown');
		 		imgBox.off('touchmove mousemove');
		 		imgBox.off('touchend mouseup');
            }

            // touch_start
            function touch_start(e){
            	// 自动停止
		        auto_slider_stop();
            	if(!_touchStart) return

            	if(e.type == "touchstart"){
		        	firstPoint = window.event.touches[0].pageX;
		        }else{
		        	firstPoint = e.pageX||e.x;
		        	mouseDown = true;
		        }

		        moveInit = true;

		        
            }

            // touch_move
            function touch_move(e){
            	e.stopPropagation();
            	e.preventDefault();

            	// 自动停止
		        auto_slider_stop();
            	if(!_touchStart || !moveInit) return;

            	var moveP,x,move=false;
            	if(e.type == "touchmove"){
		        	moveP = window.event.touches[0].pageX;
		        	move = true;
		        }else{
		        	if(mouseDown){
		        		moveP = e.pageX||e.x;
		        		move = true;
		        	}
		        }

		        if(!move) return;
		        
	        	if(movePosition_c){
		        	movePosition = moveP - firstPoint >0 ? 'right' : 'left';
		        	movePosition_c = false;
		        }

		        if(movePosition == 'right'){
		        	if(imgNow==1){
		        		imgNow = lengths-1;
		        		imgBox[0].style[_prefixStyle('transform')] = 'translate(-'+(lengths-2)*width+'px,0) translateZ(0)';
		        		imgBox.attr('data-translate',-(lengths-2)*width);
		        	}
		        }else{
		        	if(imgNow==lengths){
		        		imgNow = 2;
		        		imgBox[0].style[_prefixStyle('transform')] = 'translate(-'+width+'px,0) translateZ(0)';
		        		imgBox.attr('data-translate',-width);
		        	}
		        }

		        touchDelat = moveP - firstPoint;

		 		if(imgBox.attr('data-translate')) x = touchDelat + parseInt(imgBox.attr('data-translate'));
				imgBox[0].style[_prefixStyle('transform')] = 'translate('+x+'px,0) translateZ(0)';
            }

            // touch_end
            function touch_end(){
            	// 自动停止
		        auto_slider_stop();
            	if(!_touchStart) return;
            	_touchStart = false;
            	moveInit = false;

            	if(Math.abs(touchDelat)>=100){
            		success();
            	}else if(Math.abs(touchDelat)>0&&Math.abs(touchDelat)<100){
            		fail();
            	}else{
            		_touchStart = true;
            		// 自动开始
            		auto_slider_start();
            	}

            	movePosition = null;
            	movePosition_c = true;
            	mouseDown = false;
		 		firstPoint = 0;
		 		touchDelat = 0;
            }
				
			// success
			function success(val){
				var x;
				if(typeof(val)==='undefined'){
					imgBox.addClass('move');
					if(touchDelat>0){
						right();
					}else{
						left();
					}
				}else{
					if(val=='right'){
						if(imgNow==1){
			        		imgNow = lengths-1;
			        		imgBox[0].style[_prefixStyle('transform')] = 'translate(-'+(lengths-2)*width+'px,0) translateZ(0)';
			        		imgBox.attr('data-translate',-(lengths-2)*width);
			        	}
						setTimeout(function(){
							imgBox.addClass('move');
							right(val);
			        	},100)
					}else{
						if(imgNow==lengths){
			        		imgNow = 2;
			        		imgBox[0].style[_prefixStyle('transform')] = 'translate(-'+width+'px,0) translateZ(0)';
			        		imgBox.attr('data-translate',-width);
			        	}
			        	setTimeout(function(){
							imgBox.addClass('move');
							left(val);
			        	},100)
					}
				}

				setTimeout(function(){
					// 按钮变化
					btnBox.children().removeClass('on');
					var index = imgNow;
					if(index==1){
		        		index = lengths-1;
		        	}else if(index==lengths){
		        		index = 2;
		        	}
		        	btnBox.children().eq(index-2).addClass('on');

					imgBox.attr('data-translate',x);
					imgBox.removeClass('move');
					_touchStart = true;

					// 自动开始
					if(typeof(val)==='undefined') auto_slider_start();
				},600)

				// 移动
				function right(val){
					x = parseInt(imgBox.attr('data-translate'));
					x = x + width;
					imgBox[0].style[_prefixStyle('transform')] = 'translate('+x+'px,0) translateZ(0)';
					imgNow --;
				}

				function left(val){
					x = parseInt(imgBox.attr('data-translate'));
					x = x - width;
					imgBox[0].style[_prefixStyle('transform')] = 'translate('+x+'px,0) translateZ(0)';
					imgNow ++;
				}
			}

			// fail
			function fail(){
				imgBox.addClass('move');
				var x = parseInt(imgBox.attr('data-translate'));
				imgBox[0].style[_prefixStyle('transform')] = 'translate('+x+'px,0) translateZ(0)';

				setTimeout(function(){
					imgBox.removeClass('move');
					_touchStart = true;

					// 自动开始
					auto_slider_start();
				},600)
			}

			// 自动播放轮播图-开始
			function auto_slider_start(){
				timeVal = setInterval(function(){
					_touchStart = false;
					success(opts.pos_img);
				},opts.autotime)
			}

			// 自动播放轮播图-结束
			function auto_slider_stop(){
				clearInterval(timeVal);
				timeVal =null;
			}

			function loadfunction() {  
				/*加载轮播图样式--插件样式*/
				var Style = document.createElement("style");  
				Style.type = "text/css";
				
				var style_map = 
					".imgSlider { position:relative; width:100%; height:100%; overflow:hidden; }"+
					".imgSlider .imgSlider-img { position:absolute; top:0; left:0; overflow:hidden; height:100%; }"+
					".imgSlider .imgSlider-img li { float:left; width:640px; height:100%; text-align:center; }"+
					".imgSlider .imgSlider-img li img { display:inline-block; vertical-align: middle; }"+
					".imgSlider .imgSlider-img li span { display:inline-block; height:100%; width:0; vertical-align: middle; }"+
					".imgSlider .imgSlider-btn { position:absolute; z-index:20; bottom:15px; left:0; text-align:center; width:100%; }"+
					".imgSlider .imgSlider-btn li { display:inline-block; margin-right:15px; width:20px; height:20px; border-radius:50%; background:"+opts.btn_col+"; cursor:pointer; opacity:0.5; }"+
					".imgSlider .imgSlider-btn li:last-child { margin-right:0; }"+
					".imgSlider .imgSlider-btn li.on { background:"+opts.btn_col_on+"; opacity:1; }"+
					".imgSlider .imgSlider-img.move {-webkit-transition:all 0.5s;-moz-transition:all 0.5s;-ms-transition:all 0.5s;-o-transition:all 0.5s;transition:all 0.5s;}";
				Style.innerHTML = style_map ;
				document.head.appendChild(Style);
			}

			function ylSliderinit(){
				loadfunction();
				if(lengths>1&&opts.auto){
					auto_slider_start();
				}
				init_img();
			}

			return ylSliderinit()
		});
	}
})(jQuery);