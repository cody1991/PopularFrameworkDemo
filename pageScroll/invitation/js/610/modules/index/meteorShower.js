/* 
 *  meteorShower插件
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

	//注册MeteorShower插件
	(function () {
		//定义MeteorShower插件对象
		var MeteorShower = function ($item, options) {
			var theClass = this;
			//定义属性
			this.$target = $item.addClass('m-meteorShower');
			this.settings = $.extend({
				starCount : 30,
				meteorCount : 20
			}, options);


			//临时变量
			var left, top, styleIndex, delay, duration, scale;

			//生成星星
			var html = '';
			for(var i = 0; i < this.settings.starCount; i++){
				//计算属性值
				left = (Math.random() * 640).toFixed(2);
				top = (Math.random() * 600).toFixed(2);
				delay = Math.random().toFixed(2);
				duration = (1 + Math.random() * (5 - 1)).toFixed();
				styleIndex = Math.round(1 + Math.random() * (4-1));
				//生成一个星星
				html += '<i class="star style'+ styleIndex +'" style="left:'+ left +'px; top:'+ top +'px; -webkit-animation-delay:'+ delay +'s; -webkit-animation: star '+ duration +'s linear infinite;"></i>';
			}

			//生成流星
			for(var i = 0; i < this.settings.meteorCount; i++){
				//计算属性值
				left = (Math.random() * 800 - 280).toFixed(2);
				top = (Math.random() * 100 - 80).toFixed(2);
				delay = (0.5 + Math.random() * (3 - 0.5)).toFixed();
				duration = (1.2 + Math.random() * (4 - 1.2)).toFixed();
				styleIndex = Math.round(1 + Math.random() * (4-1));
				//生成一个流星
				html += '<i class="meteor style'+ styleIndex +'" style="left:'+ left +'px; top:'+ top +'px; -webkit-animation-delay:'+ delay +'s; -webkit-animation: meteor '+ duration +'s linear infinite;"></i>';
			}

			//将星星添加到容器
			this.$target.append(html);
		};

		//注册meteorShower插件接口
		$.fn.meteorShower = function (options) {
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
						//实例化MeteorShower对象
						var pluginObj = new MeteorShower($item);
						//将当前插件对象保存到data中
						$item.data('plugin_meteorShower', pluginObj);
					});
				break;
				//对象初始化
				case 'getPluginObject':
					//将当前插件对象保存到data中
					return $item.data('plugin_meteorShower');
				break;
			}

			//保持操作链
			return this;
		};
	})();

	module.exports = $;
});