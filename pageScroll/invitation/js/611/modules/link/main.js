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
	var $ = require('lib/zepto/zepto'),			//Zepto模块
		$ = require('lib/zepto/selector'),		//Zepto选择器插件模块
		$ = require('units/maskLayer');			//弹出层模块
	var app = require('modules/app/main');		//App模块

	//获取页面模块jQuery对象
	var $linkPages = $('.page-link');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化链接模块
			$linkPages.each(function (i, item) {
				console.log('link init');
				//获取当前page页
				$page = $(item);

				//微信分享提示功能
				var $shareLink = $page.find('[href="weixin:share"]');
				if($shareLink.length){
					var $weixinShareLayer = $page.find('.m-weixinShareLayer');
					$page.find('.page-content').append($weixinShareLayer);
					$weixinShareLayer.maskLayer({
						clickHideMode : 2,
						onShow : function (e) {
							app.disableFlipPage();		//禁止app翻页
						},
						onHide : function (e) {
							app.enableFlipPage();		//启用app翻页
						}
					});
					$shareLink.on($.isPC ? 'click' : 'tap', function(){
						$weixinShareLayer.maskLayer('show');
					});
				}
				
				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('link active');
				}).on('current', function (e) {
					console.log('link current');
				});
			});
		}
	}
});