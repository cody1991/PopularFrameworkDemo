
/**
 *  卡片滑动模块插件--改自iscoll插件
 *  -----------------------------
 *  作者：叼怎么写！- -||
 *  时间：2014-05-14
 *  准则：iscroll、zepto
 *  联系：wechat--shoe11414255
 *  一张网页，要经历怎样的过程，才能抵达用户面前
 *  一个特效，要经历这样的修改，才能让用户点个赞
 *  一个产品，创意源于生活，源于内心，需要慢慢品味
 *********************************************************************************************/
/**
 * 插件滑动模块插件
 */
define(function __iscroll(require, exports, module){
	var $ = require('lib/zepto/zepto');
	var widget = require('units/widget');

	// 卡片滑动插件
	function iScroll (wrap ,scroller ,options) {
		if(typeof(wrap)=='undefined'){
			this.wrapper = window;
			this.scroller = document;
		}else if(typeof(scroller)=='undefined'){
			this.wrapper = typeof wrap == 'string' ? document.querySelector(wrap) : wrap;
			this.scroller = this.wrapper.children[0];
		}else{
			this.wrapper = typeof wrap == 'string' ? document.querySelector(wrap) : wrap;
			this.scroller = typeof scroller == 'string' ? document.querySelector(scroller) : scroller;
		}

		// 触发事件的类型
		this.eventType = {
			touchstart: 1,
			touchmove: 1,
			touchend: 1,

			mousedown: 2,
			mousemove: 2,
			mouseup: 2,
			mouseout: 2
		};

		// 过渡的效果
		this.ease = {
			quadratic: {
				style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				fn: function (k) {
					return k * ( 2 - k );
				}
			},
			circular: {
				style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
				fn: function (k) {
					return Math.sqrt( 1 - ( --k * k ) );
				}
			},
			back: {
				style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
				fn: function (k) {
					var b = 4;
					return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
				}
			},
			bounce: {
				style: '',
				fn: function (k) {
					if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
						return 7.5625 * k * k;
					} else if ( k < ( 2 / 2.75 ) ) {
						return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
					} else if ( k < ( 2.5 / 2.75 ) ) {
						return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
					} else {
						return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
					}
				}
			},
			elastic: {
				style: '',
				fn: function (k) {
					var f = 0.22,
						e = 0.4;

					if ( k === 0 ) { return 0; }
					if ( k == 1 ) { return 1; }

					return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
				}
			}
		};

		// Some defaults	
		this.self = true;
		this.wraperdistand = false;

		this.startX = 0; // 初始化位置的x值--默认为0
		this.startY = 0; // 初始化位置的Y值--默认为0
		this.y = 0; 
		this.x = 0;
		this.endTime = 0;	
		this.preventDefault = true;
		this.preventDefaultException = { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|DIV|A|IMG)$/ },

		// 开启哪边的滑动
		this.scrollY = true;
		this.scrollX = false;

		// 开启边缘
		this.bounce = true;
		this.bounceTime = 600; // 返回时间
		this.resizeTime = 60;

		// 判断是否支持属性
		this.useTransform = this._prefixStyle('transform');
		this.useTransition = this._prefixStyle('transition');
		this.hasTouch = 'ontouchstart' in window;
		this.translateZ = this._hasPerspective() ?  ' translateZ(0)' : '';

		// 单一方向执行
		this.Locked = true; // 滑动锁定方向
		this.LockThreshold = 10; // 判断的权衡值
		this.position = false; // 是否锁定方向
		this.hasPosition = false;

		// 处理单一方向锁定配置
		this.LockPostion = false;
		this.LockType = 'h';

		// 继承传进来的参数
		for ( var i in options ) {
			this[i] = options[i];
		}

		// 默认执行的初始化函数	
		this._init();			//	初始化函数
		this.refresh();			//	刷新对象插件需要的参数值

		this.scrollTo(this.startX, this.startY);	//	移动到初始化位置
		this.enable();
	}

	// 滑动插件继承处理函数
	iScroll.prototype = $.extend({},widget,{
		// this对象中，事件handle对象（处理事件的绑定函数）
		handleEvent: function (e) {
			switch ( e.type ) {
				case 'touchstart':
				case 'mousedown':
					this._start(e);
					break;
				case 'touchmove':
				case 'mousemove':
					this._move(e);
					break;
				case 'touchend':
				case 'mouseup':
				case 'touchcancel':
				case 'mousecancel':
					this._end(e);
					break;
				case 'orientationchange':
				case 'resize':
					// this._resize();
					break;
				case 'webkitTransitionEnd':
				case 'MSTransitionEnd':
				case 'oTransitionEnd':
				case 'transitionend':
					this._transitionEnd(e);
					break;
				case 'DOMMouseScroll':
				case 'mousewheel':
				case 'wheel':
					this._wheel(e);
					break;
				case 'keydown':
					this._key(e);
					break;
			}
		},

		// 对象事件绑定（或者注销-true为注销，false为绑定）
		initEvents: function (remove) {
			var eventType = remove ? this.removeEvent : this.addEvent;
			var target = this.self ? this.scroller : (this.wraperdistand ? this.wraperdistand : this.wrapper);

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			// 默认开启touch事件
			if ( this.hasTouch ) {
				eventType(target, 'touchstart', this);
				eventType(target, 'touchmove', this);
				eventType(target, 'touchcancel', this);
				eventType(target, 'touchend', this);
			} else {
				eventType(target, 'mousedown', this);
				eventType(target, 'mousemove', this);
				eventType(target, 'mousecancel', this);
				eventType(target, 'mouseup', this);
			}

			// 效果结束后触发的事件--只有在开启useTransition,useTranform
			eventType(this.scroller, 'webkitTransitionEnd', this);
			eventType(this.scroller, 'MSTransitionEnd', this);
			eventType(this.scroller, 'oTransitionEnd', this);
			eventType(this.scroller, 'transitionend', this);
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

		_init: function () {
			this.initEvents(false);

			// 执行初始化事件
			this._handleEvent('init');
		},

		// 函数注销
		destroy: function () {
			this.initEvents(true);

			// 执行注销事件
			this._handleEvent('destroy');
		},

		// 刷新对象参数值
		refresh: function (scrollerHeight) {
			// to do;
			this.wrapperWidth	= this.wrapperWidth ? this.wrapperWidth : this.wrapper.clientWidth;
			this.wrapperHeight	= this.wrapperHeight ? this.wrapperHeight : this.wrapper.clientHeight;

			this.scrollerWidth	= this.scrollerWidth ? this.scrollerWidth : this.scroller.offsetWidth;
			this.scrollerHeight	= this.scrollerHeight ? this.scrollerHeight : this.scroller.offsetHeight;

			if (scrollerHeight) {
				this.scrollerHeight = scrollerHeight;
			}

			this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
			this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

			this.hasHorizontalScroll	= this.scrollX && this.maxScrollX < 0;
			this.hasVerticalScroll		= this.scrollY && this.maxScrollY < 0;

			if ( !this.hasHorizontalScroll ) {
				this.maxScrollX = 0;
				this.scrollerWidth = this.wrapperWidth;
			}

			if ( !this.hasVerticalScroll ) {
				this.maxScrollY = 0;
				this.scrollerHeight = this.wrapperHeight;
			}

			this.endTime = 0;

			// this.resetPosition();

			this._handleEvent('refresh');
		},

		_preventDefaultException : function (el, exceptions) {
			for ( var i in exceptions ) {
				if ( exceptions[i].test(el[i]) ) {
					return true;
				}
			}

			return false;
		},

		_resize : function(){
			var that = this;

			clearTimeout(this.resizeTimeout);

			this.resizeTimeout = setTimeout(function () {
				that.refresh();
			}, this.resizeTime);
		},

		// 不开启事件单一处理
		disable: function () {
			this.enabled = false;
		},

		// 开启事件单一处理
		enable: function () {
			this.enabled = true;
		},

		// 移动开始处理的函数
		_start: function (e) {
			// 若为鼠标操作，确保是鼠标左键点击触发
			if ( this.eventType[e.type] != 1 ) {
				if ( e.button !== 0 ) {		// 鼠标左键为0，右键为2 ，中建为1 ---标准（非IE）
					return;
				}
			}

			// 确保操作从一个事件触发（touch--1,mouse--2）
			if ( !this.enabled || (this.initiated && this.eventType[e.type] !== this.initiated) ) {
				return;
			}

			if ( this.preventDefault && !this._preventDefaultException(e.target, this.preventDefaultException) ) {
				e.preventDefault();		// This seems to break default Android browser
			}

			var point = e.touches ? e.touches[0] : e;

			this.initiated	= this.eventType[e.type];		//	记录从事件触发开始，事件流的类型
			this.moved		= false;						//  标记开始move移动
			this.distY		= 0;
			this.distX      = 0;

			this._transitionTime();

			this.isAnimating = false;
			this.startTime = this.getTime();

			if ( this.useTransition && this.isInTransition ) {
				pos = this.getComputedPosition();

				this._translate(Math.round(pos.x), Math.round(pos.y));
				this.isInTransition = false;
			}

			this.startX = this.x;
			this.startY = this.y;
			this.pointY = point.pageY;
			this.pointX = point.pageX;

			this._handleEvent('beforeStart');
		},

		// 移动函数处理
		_move: function (e) {
			// 确保操作从一个事件触发（touch--1,mouse--2）
			if ( !this.enabled || this.eventType[e.type] !== this.initiated ) {
				return;
			}

			if ( this.preventDefault ) {
				e.preventDefault();
			}

			var point		= e.touches ? e.touches[0] : e,
				deltaY		= point.pageY - this.pointY,
				deltaX 		= point.pageX - this.pointX,
				timestamp	= this.getTime(),
				newX, newY, absDistY, absDistX;

			this.pointY		= point.pageY;		// 处理距离值
			this.pointX		= point.pageX;		// 处理距离值

			this.distY		+= deltaY;
			this.distX 		+= deltaX;
			absDistX		= Math.abs(this.distX);
			absDistY		= Math.abs(this.distY);

			// 确保滑动的距离超出了10px,让开始move函数处理，否则true
			if ( timestamp - this.endTime > 300 && absDistX < 10 && absDistY < 10 ) {
				return;
			}

			// 处理滑动方向
			if ( !this.hasPosition ) {
				if ( this.Locked && !this.position ) {
					if ( absDistX + this.LockThreshold > absDistY ) {
						this.position = 'h';		// lock horizontally -----X锁定滑动
					} else if ( absDistY >= absDistX ) {
						this.position = 'v';		// lock vertically	-----y锁定滑动
					} else {
						this.position = false;		// no lock -----不滑动
						return;
					}
				} else {
					this.position = 'v';
				}
				this.hasPosition = true;
			}

			if ( this.LockPostion && this.position == this.LockType ) {
				// move变量来启动move事件的开启，一次	
				if ( !this.moved ) {
					this._handleEvent('lockFn_start');
				}

				this.moved = true;
			} else {
				// 每一次move的距离
				deltaY = this.hasVerticalScroll ? deltaY : 0;
				deltaX = this.hasHorizontalScroll ? deltaX : 0;

				// 计算move后，滑动到的最终位置
				newX = this.x + deltaX;
				newY = this.y + deltaY;

				var delX,delY;
				// Slow down if outside of the boundaries
				if ( newX > 0 || newX < this.maxScrollX ) {
					newX = this.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
					delX = newX > 0 ? 0 : this.maxScrollX - newX;
				}
				if ( newY > 0 || newY < this.maxScrollY ) {
					newY = this.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
					delY = newY > 0 ? 0 : this.maxScrollY - newY;
				}

				// move变量来启动move事件的开启，一次	
				if ( !this.moved ) {
					this._handleEvent('start');
				} else{
					this._handleEvent('move',this.x,this.y,this.maxScrollX,this.maxScrollY,this.wrapper);
				}

				this.moved = true;

				this._translate(newX, newY);

				// 大于300ms,则重新计算，不作为惯性处理
				if ( timestamp - this.startTime > 300 ) {
					this.startTime = timestamp;
					this.startY = this.y;
				}
			}
		},

		// 移动结束的函数处理
		_end: function (e) {
			// 确保操作从一个事件触发（touch--1,mouse--2）
			if ( !this.enabled || this.eventType[e.type] !== this.initiated ) {
				return;
			}
			
			this._handleEvent('end',this.x,this.y,this.maxScrollX,this.maxScrollY,this.wrapper);
			
			if ( this.preventDefault && !this._preventDefaultException(e.target, this.preventDefaultException) ) {
				e.preventDefault();
			}

			// 处理方向上的运动
			if ( this.LockPostion && this.position == this.LockType ) {
				if ( Math.abs(this.distX) >= 100 ) {
					// lock-fn 回掉函数
					// this.lockFn(this.distX);
				}
			} else {
				if ( this.sliderX && Math.abs(this.distX) >= 100 && Math.abs(this.distX) > Math.abs(this.distY) + 50) {
					// lock-fn 回掉函数
					this.lockFn(this.distX);
				}

				var point = e.changedTouches ? e.changedTouches[0] : e,
					momentumY,
					momentumX,
					duration = this.getTime() - this.startTime,
					newX = Math.round(this.x),
					newY = Math.round(this.y),
					distanceX = Math.abs(newX - this.startX),
					distanceY = Math.abs(newY - this.startY),
					time = 0,
					easing = '';

				this.scrollTo(newX, newY);	// 确保移动到最终的位置

				this.isInTransition = 0;
				this.initiated = 0;
				this.endTime = this.getTime();

				// 检测滑动是否超出
				if ( this.resetPosition(this.bounceTime) ) {
					return;
				}

				// 轻拂的动作，自定义动作--点击事件
				if ( this.flick && duration < 300 && distanceX < 50 && distanceY < 50 ) {
					this.flickFn(e);
				} else {
					// start momentum animation if needed
					if ( duration < 300 ) {
						momentumX = this.hasHorizontalScroll ? this.momentum(this.x, this.startX, duration, this.maxScrollX, this.wrapperWidth) : { destination: newX, duration: 0 };
						momentumY = this.hasVerticalScroll ? this.momentum(this.y, this.startY, duration, this.maxScrollY, this.wrapperHeight) : { destination: newY, duration: 0 };
						newX = momentumX.destination;
						newY = momentumY.destination;
						time = Math.max(momentumX.duration, momentumY.duration);
						this.isInTransition = 1;
					}

					if ( newX != this.x || newY != this.y ) {
						// change easing function when scroller goes out of the boundaries
						if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
							easing = this.ease.quadratic;
						}

						this.scrollTo(newX, newY, time, easing);
						return;
					}
				}
			}

			this.position = false;
			this.hasPosition = false;

			// this._handleEvent('end',this.x,this.y,this.maxScrollX,this.maxScrollY,this.wrapper);
		},

		// 滚动处理
		scrollTo: function (x, y, time, easing) {
			easing = easing || this.ease.circular;

			// this.isInTransition = this.useTransition && time > 0;

			if ( !time || (this.useTransition && easing.style) ) {
				this._transitionTimingFunction(easing.style);
				this._transitionTime(time);
				this._translate(x, y);
			} else {
				this._animate(x, y, time, easing.fn);
			}
		},

		// 移动时间设置
		_transitionTime: function (time) {
			time = time || 0;

			this.scroller.style[this._prefixStyle('transitionDuration')] = time + 'ms';
		},

		// 移动效果函数设置
		_transitionTimingFunction: function (easing) {
			this.scroller.style[this._prefixStyle('transitionTimingFunction')] = easing;
		},

		// 移动函数设置
		_translate: function (x, y) {
			//	是否开启旋转--并且支持
			if ( this.useTransform ) {
				this.scroller.style[this._prefixStyle('transform')] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
			} else {
				x = Math.round(x);
				y = Math.round(y);
				this.scroller.style.left = x + 'px';
				this.scroller.style.top = y + 'px';
			}
			this.x = x;
			this.y = y;
		},

		// 移动结束函数处理
		_transitionEnd: function (event) {
			var e = event ? event : window.event;
			if ( e.target != this.scroller || !this.isInTransition ) {
				return;
			}

			// 停止运动
			this._transitionTime();

			// 确认已经停止
			// 并将isInTransition设为false
			// 执行停止回调函数
			if ( !this.resetPosition(this.bounceTime) ) {
				this.isInTransition = false;
				this._handleEvent('scrollEnd');
			}
		},

		// 动画函数处理
		_animate: function (destX, destY, duration, easingFn) {
			var that = this,
				startX = this.x,
				startY = this.y,
				startTime = this.getTime(),
				destTime = startTime + duration;

			function step () {
				var now = this.getTime(),
					newX, newY,
					easing;

				if ( now >= destTime ) {
					that.isAnimating = false;
					that._translate(destX, destY);

					if ( !that.resetPosition(that.bounceTime) ) {
						// that._execEvent('scrollEnd');
					}

					return;
				}

				now = ( now - startTime ) / duration;
				easing = easingFn(now);
				newX = ( destX - startX ) * easing + startX;
				newY = ( destY - startY ) * easing + startY;
				that._translate(newX, newY);

				if ( that.isAnimating ) {
					__requestAnimationFrame(step);
				}
			}

			this.isAnimating = true;
			step();
		},

		// 获取当前的位置值
		getComputedPosition: function () {
			var matrix = window.getComputedStyle(this.scroller, null),
				x, y;

			if ( this.useTransform ) {
				matrix = matrix[this._prefixStyle('transform')].split(')')[0].split(', ');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +matrix.left.replace(/[^-\d.]/g, '');
				y = +matrix.top.replace(/[^-\d.]/g, '');
			}

			return { x: x, y: y };
		},

		// 当超出范围时，函数处理回到最大值
		resetPosition: function (time) {
			var y = this.y;
			var x = this.x;
			var delX,delY;

			time = time || 0;

			if ( !this.hasHorizontalScroll || this.x > 0 ) {
				x = 0;
				delX = 0;
			} else if ( this.x < this.maxScrollX ) {
				x = this.maxScrollX;
				delX = this.maxScrollX - this.x;
			}

			if ( !this.hasVerticalScroll || this.y > 0 ) {
				y = 0;
				delY = 0;
			} else if ( this.y < this.maxScrollY ) {
				y = this.maxScrollY;
				delY = this.maxScrollY - this.y;
			}

			if ( x == this.x && y == this.y ) {
				return false;
			}

			this._handleEvent('bounce',delX,delY,this.wrapper);

			this.scrollTo(x, y, time, '');

			return true;
		},
	})

	module.exports = iScroll;
});

