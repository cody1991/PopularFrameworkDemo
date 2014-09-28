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
	var $ = require('lib/zepto/zepto'),				//Zepto模块
		$ = require('lib/zepto/selector');			//Zepto选择器插件模块
	var app = require('modules/app/main');			//app模块
	var IScroll = require('lib/iscroll/iscroll');	//IScroll模块

	//获取页面模块jQuery对象
	var $moreAppPages = $('.page-moreApp');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化链接模块
			$moreAppPages.each(function (i, item) {
				console.log('moreApp init');
				//获取当前page页
				$page = $(item);

				//app列表IScroll对象
				var appListIScroll;
				//更新app翻页模式的方法
				var updateFlipPageMode = function () {
					if(appListIScroll.maxScrollY==0){
						return;	
					}else if(appListIScroll.y > -5){
						//仅允许向上翻页
						app.setFlipPageMode(2);
					}else if(appListIScroll.y < appListIScroll.maxScrollY + 5){
						//仅允许向下翻页
						app.setFlipPageMode(3);
					}else{
						//禁用翻页
						app.disableFlipPage();
					}
				}

				//初始化轻app列表
				var $moreAppList = $page.find('.m-moreAppList');
				(function ($moreAppList) {
					$page.one('active', function (e) {
						//如果有轻app广告则调整轻app列表大小 
						if($page.find('.m-lightAppAd').length > 0){
							$moreAppList.css('bottom', '50px');
						}
					}).one('current', function (e) {
						//实例化app列表滚动条
						appListIScroll = new IScroll($moreAppList[0]);
						appListIScroll.on('scrollEnd', updateFlipPageMode);
					});
				})($moreAppList);
				
				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('moreApp active');
				}).on('current', function (e) {
					console.log('moreApp current');
					//更新翻页模式
					updateFlipPageMode();
				}).on('hide', function (e) {
					//禁用上下翻页
					app.setFlipPageMode(1);
				});
			});
		}
	};
});