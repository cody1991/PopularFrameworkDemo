/* 
 *  页面程序入口
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),
		$ = require('./animationCloudBg'),
		$ = require('./meteorShower');

	//获取页面模块jQuery对象
	var $indexPages = $('.page-index');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			var $app = $('body');
			//初始化首页模块
			$indexPages.each(function (i, item) {
				console.log('index init');
				//获取当前page页
				$page = $(item);

				//初始化动画
				(function () {
					//动画样式1
					var $animationBox = $page.find('.m-animationBox');
					var appBgClass = 'appBg1';
					if($animationBox.is('.m-animationCloudBg')){
						$animationBox.animationCloudBg();
						appBgClass = 'appBg1';
					}else if($animationBox.is('.m-meteorShower')){
						$animationBox.meteorShower({
							starCount : 30,		//星星个数
							meteorCount : 26	//流星个数
						});
						appBgClass = 'appBg2';
					}

					//根据不同动画应用不同的背景
					$(window).on('load', function (e) {
						$app.addClass(appBgClass);
					});
				})();
				
				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('index active');
				}).on('current', function (e) {
					console.log('index current');
				});
			});
		}
	}
});