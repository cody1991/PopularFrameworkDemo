/* 
 *  maskLayer插件
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),
		$ = require('lib/zepto/selector'),
		$ = require('lib/zepto/touch'),
		$ = require('lib/zepto/data');

	//注册MaskLayer插件
	(function () {
		//定义MaskLayer插件对象
		var MaskLayer = function ($item, options) {
			var theClass = this;
			//定义属性
			this._$maskLayer = $item.addClass('u-maskLayer');			//目标容器
			this.state = this._$maskLayer.is('.z-show') ? 'show' : 'hide';	//显示状态

			//初始化设置
			this.settings = $.extend({
				clickHideMode : 1,		//点击层自动隐藏模式（0:禁用点击隐藏/ 1:启用遮罩区点击隐藏/ 2:启用所有区域点击隐藏）
				closeButton : true,		//关闭按钮
				onShow : function () { },
				onHide : function () { }
			}, options);

			//注册事件
			this.on('show', this.settings.onShow);
			this.on('hide', this.settings.onHide);

			//初始化关闭按钮
			if(this.settings.closeButton){
				//添加关闭按钮
				var $closeButton = $('<a href="javascript:void(0);" class="u-maskLayer-close"></a>');
				theClass._$maskLayer.append($closeButton);
				//注册点击事件
				$closeButton.on($.isPC ? 'click' : 'tap', function (e) {
					e.preventDefault();
					theClass.hide();
				});				
			}

			//应用显示状态
			this.state == 'show' ? theClass.show('_init') : theClass.hide('_init');

			//判断是否点击自动隐藏
			if(this.settings.clickHideMode){
				//点击隐藏
				theClass._$maskLayer.on($.isPC ? 'click' : 'tap', function (e) {
					//隐藏
					theClass.hide();
				});

				//判断是否为模式1（启用遮罩区点击隐藏），如果是则阻止子元素事件冒泡
				if(theClass.settings.clickHideMode == 1){
					theClass._$maskLayer.children().on($.isPC ? 'click' : 'tap', function (e) {
						//阻止子元素事件冒泡
						e.stopPropagation();
					});
				}
			}
		};

		//事件注册
		MaskLayer.prototype.on = function(eventName, fn) {
			if(eventName && fn){
				this._$maskLayer.on('maskLayer/' + eventName, fn);
			}
		};

		//事件注册
		MaskLayer.prototype.one = function(eventName, fn) {
			if(eventName && fn){
				this._$maskLayer.one('maskLayer/' + eventName, fn);
			}
		};

		//事件触发
		MaskLayer.prototype.trigger = function(eventName) {
			if(eventName){
				this._$maskLayer.trigger('maskLayer/' + eventName);
			}
		};

		//显示
		MaskLayer.prototype.show = function() {
			var theClass = this;
			if(arguments[0] == '_init'){
				this._$maskLayer.addClass('z-show').show();
			}else{
				this._$maskLayer.show().removeClass('z-hide').addClass('z-showing');
				setTimeout(function () {
					theClass._$maskLayer.addClass('z-show').removeClass('z-showing');
					theClass.state = 'show';
					//触发显示事件
					theClass.trigger('show');
				}, 500);
			}
		};

		//隐藏
		MaskLayer.prototype.hide = function() {
			var theClass = this;
			if(arguments[0] == '_init'){
				this._$maskLayer.addClass('z-hide').hide();
			}else{
				this._$maskLayer.removeClass('z-show').addClass('z-hideing');
				setTimeout(function () {
					theClass._$maskLayer.addClass('z-hide').removeClass('z-hideing').hide();
					theClass.state = 'hide';
					//触发隐藏事件
					theClass.trigger('hide');
				}, 500);
			}
		};

		//m册MaskLayer插件接口
		$.fn.maskLayer = function (options) {
			//获取指令
			var command = 'init';
			if(arguments.length > 0){
				if (typeof arguments[0] == 'string'){
					command = arguments[0];
				}
			}

			//判断指令
			switch(command){
				//对象初始化
				case 'init':
					//循环操作
					this.each(function (i, item) {
						var $item = $(item);
						//实例化MaskLayer对象
						var pluginObj = new MaskLayer($item, options);
						//将当前插件对象保存到data中
						$item.data('plugin_maskLayer', pluginObj);
					});
				break;
				//获取插件对象
				case 'getPluginObject':
					//将当前插件对象保存到data中
					return this.data('plugin_maskLayer');
				break;
				//调用插件对象方法
				default:
					var pluginObj = this.data('plugin_maskLayer');
					var method = pluginObj[command];
					if(method){
						var parameters = [];
						if(arguments.length > 1){
							parameters = arguments[1];
						}
						method.apply(pluginObj, parameters);
					}
				break;
			}

			//保持操作链
			return this;
		};
	})();

	module.exports = $;
});