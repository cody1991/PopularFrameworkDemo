/**
 * @author Abel
 * 
 * 2013-11-28
 * 依赖jquery.js 与 iscroll-zoom.js
 * 
 */
var IView = (function (window, document, Math) {
	function IView (el, options) {
		this.imgs = document.querySelectorAll(el);
		
		this.options = {
			idPrefix :		'iview',
			idSuffix :		'img',
			scrollEle :		$(window),
			disablePointer:	false,
			disableTouch:	false,
			disableMouse:	false
		};

		for ( var i in options ) {
			this.options[i] = options[i];
		}
		
		this.iViewId = this.options.idPrefix + '_' + this.options.idSuffix;
		this.iViewDiv = null;
		
		this.scrollId = this.options.idPrefix + '_scroll_' + this.options.idSuffix;
		this.scrollDiv = null;
		
		this.iScroll = null;
		this.zoomArr = new Array();
		
		this.shadeId = this.options.idPrefix + '_shade_' + this.options.idSuffix;
		this.shadeDiv = null;
		this.shadeImg = null;
		this.canClose = true;
		
		this.hasTouch = 'ontouchstart' in window;
		this.hasPointer = navigator.msPointerEnabled;
		this.handel = new Array();
		
		this._init();
	}
	
	IView.prototype = {
			version: '1.0.0',
			_init: function () {
				if (this.shadeDiv == null) {
					this.shadeDiv = $('<div></div>');
					this.shadeDiv.attr('id', this.shadeId);
					this.shadeDiv.css({
						display: 'none',
						background: 'rgba(0,0,0,0)',
					    height: '100%',
					    position: 'fixed',
					    top: '0',
					    width: '100%',
					    zIndex: '99996',
					    transition: 'all 0.5s ease 0s',
					    mozTransition: 'all 0.5s ease 0s',
					    webkitTransition: 'all 0.5s ease 0s',
					});
					
					this.shadeDiv.html('<img />');
					this.shadeImg = this.shadeDiv.find('img');
					$('body').append(this.shadeDiv);
				}
				
				this._eventInit(false);
				this._addEvent(document.getElementById(this.shadeId), "touchmove", this, 'shadeDiv');
				
			},
			destroy: function () {
				this._eventInit(true);
			},
			_click : function () {
				this.moveOut();
			},
			moveIn : function(index) {
				$(this.imgs).css({visibility: 'visible'});
				$(this.imgs[index]).css({visibility: 'hidden'});
				this.shadeImg.attr('src', this.imgs[index].src);
				var size = this.getImgSize($(this.imgs[index]));
				var newTop = (document.documentElement.clientHeight - size.height)/2;
				var newLeft = (document.documentElement.clientWidth - size.width)/2;
								
				this.shadeImg.css({
					width : size.width,
					marginTop : newTop,
					marginLeft : newLeft,
				});
				
				this.shadeDiv.css({background: 'rgba(0,0,0,1)'});
				this.shadeDiv.show();
				this.iScroll._initEvents(true);
				for (var i in this.zoomArr) {
					this.zoomArr[i]._initEvents(true);
				}
				this.iViewDiv.hide();
				var info = this.getImgInfo($(this.imgs[index]));
				
				var $this = this;
				setTimeout(function(){
					$this.shadeDiv.css({background: 'rgba(0,0,0,0)'});
				}, 20);
				
				this.shadeImg.animate({
					width : info.width,
					marginTop : info.top,
					marginLeft : info.left,
				}, 520, function(){
					$($this.imgs[index]).css({visibility: 'visible'});
					$this.shadeDiv.hide();
				});
				
			},
			moveOut: function(){
				var info = this.getImgInfo($(this.imgs[this.index]));
				
				this.shadeImg.attr('src', info.src).css({
					width : info.width,
					marginLeft : info.left,
					marginTop : info.top,
				});
				
				var size = this.getImgSize($(this.imgs[this.index]));
				var newTop = (document.documentElement.clientHeight - size.height)/2;
				var newLeft = (document.documentElement.clientWidth - size.width)/2;
				
				var $this = this;
				this.shadeDiv.show();
				$(this.imgs[this.index]).css({visibility: 'hidden'});
				
				setTimeout(function(){
					$this.shadeDiv.css({background: 'rgba(0,0,0,1)'});
				},20);
				
				this.shadeImg.animate({
					width : size.width,
					marginTop : newTop,
					marginLeft : newLeft,
				}, 500);
				
				if (this.iScroll == null) {
					this._scrollInit(this.index);
					this.canClose = true;
				} else {
					this.iScroll._initEvents(false);
					for (var i in this.zoomArr) {
						this.zoomArr[i]._initEvents(false);
					}
					this.iScroll.goToPage(this.index, 0, 0, '', 'haha');

					setTimeout(function(){
						$this.iViewDiv.show();
						$this.shadeDiv.hide();
						this.canClose = true;
					}, 520);
				}
				
			},
			_scrollInit : function () {
				var iViewDiv = $('<div></div>');
				iViewDiv.attr('id', this.iViewId);
				iViewDiv.css({
					display: 'none',
					background: '#000',
				    height: '100%',
				    position: 'fixed',
				    top: '0',
				    width: '100%',
				    zIndex: '99997',
				});
				
				var scrollDiv = $('<div></div>');
				scrollDiv.attr('id', this.scrollId);
				scrollDiv.css({
					position: 'absolute',
				    zIndex: '99998',
				});
				
				iViewDiv.append(scrollDiv);
				
				$('body').append(iViewDiv);
				
				this.iViewDiv = $('#'+this.iViewId);
				
				this.scrollDiv = $('#'+this.scrollId);
				
				this._createImgList();
				var $this = this;
				setTimeout(function(){
					$this.iViewDiv.show();
					$this.shadeDiv.hide();
					$this._iScrollInit();
					$this.iScroll.goToPage($this.index, 0, 0);
					$this._zoomInit();
				},550);
				
			},
			_createImgList : function () {
				for (var i = 0, len = this.imgs.length; i < len; i++) {
					var info = this.getImgInfo($(this.imgs[i]));
					
					var imgZoom = $('<div></div>');
					imgZoom.addClass(this.scrollId + '_zoom');
					imgZoom.attr('id', this.scrollId + '_zoom_' + i);
					
					var img = $('<img>');
					img.attr('src', info.src);
					
					imgZoom.append('<div></div>');
					imgZoom.find('div').css({
						display: 'table-cell',
						verticalAlign: 'middle'
					}).append(img);
					
					this.scrollDiv.append(imgZoom);
					
					var size = this.getImgSize($(this.imgs[i]));
					var newTop = (document.documentElement.clientHeight - size.height)/2;
					
					img.css({
						width : size.width
					});
					
					imgZoom.css({
						textAlign: 'center',
						display: 'table',
						float: 'left',
						overflow: 'hidden',
					    height: document.documentElement.clientHeight,
					    width: document.documentElement.clientWidth
					});
				}
				this.scrollDiv.css({
					width: document.documentElement.clientWidth * len 
				});
				
			},
			_zoomInit : function (id) {
				for (var i = 0, len = this.imgs.length; i < len; i++) {
					var id = this.scrollId + '_zoom_' + i;
					this.zoomArr[id] = new IScroll('#'+id, {
						zoom: true,
						scrollX: true,
						scrollY: true,
						mouseWheel: true,
						wheelAction: 'zoom',
						zoomMin: 1,
						zoomMax: 10,
						id: id,
						index: i,
						iView : this,
					});
					this.zoomArr[id].on('zoomStart', function() {
						this.iView._zoomStart();
					});
					this.zoomArr[id].on('zoomEnd', function(){
						this.iView._zoomEnd(this);
					});
					this.zoomArr[id].on('click', function() {
						this.iView._zoomClick(this);
					});
				}
			},
			_zoomStart : function() {
				this.iScroll._initEvents(true);
				this.canClose = false;
			},
			_zoomEnd : function(obj) {
				this.zoomArr[obj.id].zoom(obj.scale + 0.0000001);
				if (obj.scale <= 1.0000001 ) {
					this.zoomArr[obj.id].zoom(1);
					var $this = this;
					setTimeout(function(){
						$this.iScroll._initEvents(false);
						$this.canClose = true;
					},100);
				}
			},
			_zoomClick : function (obj) {
				if (obj.scale > 1.0000001) {
					this.zoomArr[obj.id].zoom(1);
					this.iScroll._initEvents(false);
					var $this = this;
					setTimeout(function(){
						$this.canClose = true;
					},500);
				} else {
					if (this.canClose == true) {
						this.moveIn(obj.index);
					}
				}
			},
			_iScrollInit : function() {
				this.iScroll = new IScroll('#'+ this.iViewId, {
					scrollX: true,
					scrollY: false,
					iView : this,
					momentum: false,
					snap: true,
					snapThreshold: 0.2,
					keyBindings: true
				});
				this.iScroll.on('scrollEnd', function(){
					this.iView._scrollEnd(this);
				});
			},
			_scrollEnd : function(obj) {
				var index = obj.currentPage.pageX;
				var img = $(this.imgs[index]);
				var offset = img.offset();
				var marginTop = (document.documentElement.clientHeight - img.height()) / 2;
				var scrollTop = this.options.scrollEle.scrollTop() + (offset.top - marginTop);
				if (this.options.scrollEle[0] === window.window) {
					scrollTop = offset.top - marginTop;
				}
				this.options.scrollEle.scrollTop(scrollTop);
			},
			getImgInfo : function(obj) {
				var info = new Object();
				var offset = obj.offset();
				info.src = obj.attr('src');
				info.width = obj.width();
				info.height = obj.height();
				info.left = offset.left;
				info.top = offset.top - $(window).scrollTop();
				return info;
			},
			getImgSize : function (obj) {
				var size = new Object();
				var imgW = obj.width();
				var imgH = obj.height();
				var wW = document.documentElement.clientWidth;
				var wH = document.documentElement.clientHeight;
				if (wH/wW > imgH/imgW) {
					//宽度匹配
					imgH = wW * imgH / imgW;
					imgW = wW;
				} else if (wH/wW < imgH/imgW) {
					//高度匹配
					imgW = wH * imgW / imgH;
					imgH = wH;
				} else {
					imgW = wW;
					imgH = wH;
				}
				size.width = imgW;
				size.height = imgH;
				return size;
			},
			_getTime : function () {
				return Date.now() || Date().getTime();
			},
			_scrollStop : function (e) {
				e=e||window.event;
				if (e&&e.preventDefault) {
					e.preventDefault();
					e.stopPropagation();
				} else {
					e.returnvalue=false;
					return false;
				}
			},
			_start : function (e) {
				var point = e.touches ? e.touches[0] : e;
				this.startPointX	= point.pageX;
				this.startPointY	= point.pageY;
				this.startTime = this._getTime();
				if (!this.hasTouch) {
					e.preventDefault();
					e.stopPropagation();
				}
			},
			_move: function (e) {
				var point = e.touches ? e.touches[0] : e;
				this.endPointX	= point.pageX;
				this.endPointY	= point.pageY;
				if (!this.hasTouch) {
					e.preventDefault();
					e.stopPropagation();
				}
			},
			_end: function (e) {
				this.duration = this._getTime() - this.startTime;
				var x = this.startPointX - this.endPointX;
				var y = this.startPointY - this.endPointY;
				this.endPointX	= 0;
				this.endPointY	= 0;
				this.startPointX	= 0;
				this.startPointY	= 0;
				this.startTime = 0;
				
				//click
				if(this.duration < 200 && (isNaN(x) || isNaN(y) || (Math.abs(x) < 10 && Math.abs(y) < 10))) {
					this._click(e);
					return;
				}
				
				//swipeLeft
				if (x > 0 && Math.abs(x) > 10 && Math.abs(y) < 10) {
					if (this.options.swipeLeft) {
						this.options.swipeLeft.call(this, x, this.duration);
					}
				}
				
				//swipeRight
				if (x < 0 && Math.abs(x) > 10 && Math.abs(y) < 10) {
					if (this.options.swipeRight) {
						this.options.swipeRight.call(this, x, this.duration);
					}
				}
				
				//swipeUp
				if (y > 0 && Math.abs(y) > 10 && Math.abs(x) < 10) {
					if (this.options.swipeUp) {
						this.options.swipeUp.call(this, x, this.duration);
					}
				}
				
				//swipeDown
				if (y < 0 && Math.abs(y) > 10 && Math.abs(x) < 10) {
					if (this.options.swipeDown) {
						this.options.swipeDown.call(this, x, this.duration);
					}
				}
			},
			extend : function (target, obj) {
				for ( var i in obj ) {
					target[i] = obj[i];
				}
			},
			_eventInit : function(remove) {
				var event = remove ? this._removeEvent : this._addEvent;
				for (var i = 0, len = this.imgs.length; i < len; i++) {
					if ( !this.options.disableMouse ) {
						event(this.imgs[i], "mousedown", this, i);
						event(this.imgs[i], "mousemove", this, i);
						event(this.imgs[i], "mouseup", this, i);
						event(this.imgs[i], "mousecancel", this, i);
					}

					if ( this.hasPointer && !this.options.disablePointer ) {
						event(this.imgs[i], "MSPointerDown", this, i);
						event(this.imgs[i], "MSPointerMove", this, i);
						event(this.imgs[i], "MSPointerUp", this, i);
						event(this.imgs[i], "MSPointerCancel", this, i);
					}

					if ( this.hasTouch && !this.options.disableTouch ) {
						event(this.imgs[i], "touchstart", this, i);
						event(this.imgs[i], "touchmove", this, i);
						event(this.imgs[i], "touchend", this, i);
						event(this.imgs[i], "touchcancel", this, i);
					}
				}
			},
			_addEvent : function (elm, evType, fn, index, capture) {
				var name = evType + '_' + index;
				fn.handel[name] = function(e) {
					fn.handleEvent.call(fn, e, index);
				};
				if (elm.addEventListener) {
					elm.addEventListener(evType, fn.handel[name], !!capture);
					return true;
				} else if (elm.attachEvent) {
					var r = elm.attachEvent('on' + evType, fn.handel[name]);
					return r;
				}
			},
			_removeEvent : function (elm, evType, fn, index, capture) {
				var name = evType + '_' + index;
				if (elm.removeEventListener) {
					elm.removeEventListener(evType, fn.handel[name], !!capture);
				} else if (elm.detachEvent) {
					elm.detachEvent("on" + evType, fn.handel[name]);
				}
			},
			handleEvent: function (e, index) {
				this.index = index;
				switch ( e.type ) {
					case 'touchstart':
					case 'MSPointerDown':
					case 'mousedown':
						this._start(e);
						break;
					case 'touchmove':
					case 'MSPointerMove':
					case 'mousemove':
						if (this.index == 'shadeDiv') {
							this._scrollStop(e);
							return;
						}
						this._move(e);
						break;
					case 'touchend':
					case 'MSPointerUp':
					case 'mouseup':
					case 'touchcancel':
					case 'MSPointerCancel':
					case 'mousecancel':
						this._end(e);
						break;
					case 'click':
						this._click(e);
						break;
			}
		}
	}
	return IView;
})(window, document, Math);