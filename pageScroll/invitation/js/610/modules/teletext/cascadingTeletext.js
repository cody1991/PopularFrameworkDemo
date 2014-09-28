/* 
 *  cascadingTeletext插件
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),
		$ = require('lib/zepto/touch'),
		$ = require('lib/zepto/data');

	//注册CascadingTeletext插件
	(function () {
		//定义CascadingTeletext插件对象
		var CascadingTeletext = function ($item, options) {
			var theClass = this;
			//定义属性
			this.$target = $item.addClass('m-cascadingTeletext');
			this.$_currentItem = this.$target.find('li').first().addClass('z-current');

			//设定高度
			$(window).on('resize', function (e) {
				theClass.$target.height(window.innerHeight);
			}).trigger('resize');

			//注册事件
			this.$target.on( $.isPC ? 'click' : 'swipeLeft swipeRight', function (e) {
				//设置隐藏动画
				theClass.$_currentItem.addClass(e.type == 'swipeLeft' ? 'z-hideToLeft' : 'z-hideToRight');
			}).delegate('li', 'webkitAnimationEnd', function (e) {
				//排到最后面
				theClass.$target.append(theClass.$_currentItem);
				//切换当前页面
				theClass.$_currentItem.removeClass('z-current z-hideToLeft z-hideToRight');
				theClass.$_currentItem = theClass.$target.find('li').first().addClass('z-current');
			});
		};

		//显示的方法
		CascadingTeletext.show = function(first_argument) {
			this.$target.addClass('z-show');
		};

		//注册cascadingTeletext插件接口
		$.fn.cascadingTeletext = function (options) {
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
						//实例化CascadingTeletext对象
						var pluginObj = new CascadingTeletext($item);
						//将当前插件对象保存到data中
						$item.data('plugin_cascadingTeletext', pluginObj);
					});
				break;
				//对象初始化
				case 'getPluginObject':
					//将当前插件对象保存到data中
					return $item.data('plugin_cascadingTeletext');
				break;
			}

			//保持操作链
			return this;
		};
	})();

	module.exports = $;
});