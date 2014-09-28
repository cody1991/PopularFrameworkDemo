
define(function (require, exports, module){
	var widegt = function(){
		this.name = "基类，扩展共有方法";
		this._click = ("ontouchstart" in window) ? "tap" : "click";
		this.hasTouch = ("ontouchstart" in window) ? true : false;
		this._events = {};									// 自定义事件---this._execEvent('scrollStart');
		this._isMotion = !!window.DeviceMotionEvent;			// 是否支持重力感应
		this._elementStyle = document.createElement('div').style;	// css属性保存对象
		this._UC = RegExp("Android").test(navigator.userAgent)&&RegExp("UC").test(navigator.userAgent)? true : false;
		this._weixin = RegExp("MicroMessenger").test(navigator.userAgent)? true : false;
		this._iPhoen = RegExp("iPhone").test(navigator.userAgent)||RegExp("iPod").test(navigator.userAgent)||RegExp("iPad").test(navigator.userAgent)? true : false;
		this._Android = RegExp("Android").test(navigator.userAgent)? true : false;
		this._IsPC = function(){ 
						var userAgentInfo = navigator.userAgent; 
						var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"); 
						var flag = true; 
						for (var v = 0; v < Agents.length; v++) { 
							if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; } 
						} 
						return flag; 
					};
		this.getTime = Date.now || function getTime () { return new Date().getTime(); };	// 获取当前时间
	}

	widegt.prototype = {
		_isOwnEmpty	: function (obj) { 
			for(var name in obj) { 
				if(obj.hasOwnProperty(name)) { 
					return false; 
				} 
			} 
			return true; 
		},

		// 判断浏览器内核类型
		_vendor	: function () {
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
		_prefixStyle : function (style) {
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

		// 判断属性支持是否
		_injectStyles : function( rule, callback, nodes, testnames ) {
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

		// 开启3D加速
		_translateZ : function(){
			if(this._hasPerspective){
				return ' translateZ(0)';
			}else{
				return '';
			}
		},

		addEvent : function (el, type, fn, capture) {
			if (el.addEventListener){
	            el.addEventListener(type, fn, false);
	        } else if (el.attachEvent){
	            el.attachEvent("on" + type, fn);
	        } else {
	            el["on" + type] = fn;
	        }
		},

		removeEvent : function (el, type, fn, capture) {
	        if (el.removeEventListener){
	            el.removeEventListener(type, fn, false);
	        } else if (el.detachEvent){
	            el.detachEvent("on" + type, fn);
	        } else {
	            el["on" + type] = null;
	        }
		},

		// 自定义事件操作
		_handleEvent : function (type) {
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
		_on : function (type, fn) {
			if ( !this._events[type] ) {
				this._events[type] = [];
			}

			this._events[type].push(fn);
		},

		// 执行回调
        execHandler : function(handler){
            if(handler && handler instanceof Object){
                var callback = handler.callback || null;
                var opts = handler.opts || [];
                var context = handler.context || null;
                var delay = handler.delay || -1;

                if(callback && callback instanceof Function){
                    if(typeof(delay) == "number" && delay >= 0){
                        setTimeout(function(){
                            callback.call(context, opts);
                        }, delay);
                    }else{
                        callback.call(context, opts);
                    }
                }
            }
        },

        // 滑动惯性函数
		momentum : function (current, start, time, lowerMargin, wrapperSize) {
			var distance = current - start,			//运动的距离
				speed = Math.abs(distance) / time,	//运动的平均速度
				destination,						//惯性移动最终移动的终点值
				duration,							//惯性移动的时间
				deceleration = 0.001;				//加速度的值控制

			// ( distance < 0 ? -1 : 1 )判断移动的方向
			// ( speed * speed ) / ( 2 * deceleration )移动的算法
			destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
			duration = speed / deceleration;

			if ( destination < lowerMargin ) {
				destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
				distance = Math.abs(destination - current);
				duration = distance / speed;
			} else if ( destination > 0 ) {
				destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
				distance = Math.abs(current) + destination;
				duration = distance / speed;
			}

			return {
				destination: Math.round(destination),
				duration: duration
			};
		},

		// loading显示
		loadingPageShow : function(node){
			if (node.length>=1) { 
				node.show();
			}
		},
		
		// loading隐藏
		loadingPageHide : function (node){
			if (node.length>=1) { 
				node.hide();
			}
		},

		// 显示验证信息
		showCheckMessage : function (note,msg,vail) {
			if (!vail) {
				note.addClass('error').removeClass('sucess');
				note.html(msg);
				note.addClass("z-show");

				setTimeout(function(){
					note.removeClass("z-show");
				},2000);
			} else {
				note.removeClass('error').addClass('sucess');
				note.html(msg);
				note.addClass("z-show");

				setTimeout(function(){
					note.removeClass("z-show");
				},2000);
			}
		}
	}

	var widegtEnter = new widegt();

	module.exports = widegtEnter;
})