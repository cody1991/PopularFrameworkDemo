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
		$ = require('units/maskLayer');
	var app = require('modules/app/main');
	var IScroll = require('lib/iscroll/iscroll');
	var articlePop = require('modules/common/articlePop');
		
	//获取页面模块jQuery对象
	var $teletextPopPages = $('.page-teletextPop');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化图文模块
			$teletextPopPages.each(function (i, item) {
				console.log('teletextPop init');
				//获取当前page页
				$page = $(item);
				
				//初始化m-teletextPop模块
				var $teletextPop = $page.find('.m-teletextPop');
				(function ($teletextPop) {
					//获取打开按钮和内容容器
					var $linkOpen = $teletextPop.find('.linkOpen');
					var $popContent = $teletextPop.find('.popContent');
					//注册点击事件
					$linkOpen.on($.isPC ? 'click' : 'tap', function (e) {
						articlePop.show($linkOpen.siblings('textarea').val());
					});
				})($teletextPop);

				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('teletextPop active');
					$teletextPop.removeClass('z-viewArea');
				}).on('current', function (e) {
					console.log('teletextPop current');
					$teletextPop.addClass('z-viewArea');
				});
			});
		}
	};
});