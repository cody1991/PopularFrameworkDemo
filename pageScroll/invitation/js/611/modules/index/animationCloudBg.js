/* 
 *  animationCloudBg插件
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),
		$ = require('lib/zepto/data');

	//注册AnimationCloudBg插件
	(function () {
		//定义AnimationCloudBg插件对象
		var AnimationCloudBg = function ($item, options) {
			//定义属性
			this.$target = $item.addClass('m-animationCloudBg');

			this.$target.height(window.innerHeight);

			//循环添加云的i标记
			for(var i=1; i<13; i++){
				var $cloudItem = $('<i></i>');
				$item.append($cloudItem);
			}
		};
		//开启动画
		AnimationCloudBg.prototype.start = function () {
			//移除停止动画class
			this.$target.removeClass('z-stop');
		}
		//停止动画
		AnimationCloudBg.prototype.stop = function () {
			//添加停止动画class
			this.$target.addClass('z-stop');
		}

		//注册animationCloudBg插件接口
		$.fn.animationCloudBg = function (options) {
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
						//实例化AnimationCloudBg对象
						var pluginObj = new AnimationCloudBg($item);
						//将当前插件对象保存到data中
						$item.data('plugin_animationcloudbg', pluginObj);
					});
				break;
				//对象初始化
				case 'getPluginObject':
					//将当前插件对象保存到data中
					return $item.data('plugin_animationcloudbg');
				break;
				//对象初始化
				case 'start':
					//获取插件对象
					var pluginObj = this.data('plugin_animationcloudbg');
					pluginObj.start();
				break;
				//对象初始化
				case 'stop':
					//将当前插件对象保存到data中
					return $item.data('plugin_animationcloudbg');
					pluginObj.stop();
				break;
			}

			//保持操作链
			return this;
		};
	})();

	module.exports = $;
});