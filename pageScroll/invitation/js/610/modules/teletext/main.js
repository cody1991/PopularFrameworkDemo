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
	var $ = require('lib/zepto/zepto');
		$ = require('./cascadingTeletext');
		
	//获取页面模块jQuery对象
	var $teletextPages = $('.page-teletext');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化图文模块
			$teletextPages.each(function (i, item) {
				console.log('teletext init');
				//获取当前page页
				$page = $(item);
			
				//初始化层叠图文组件
				var $cascadingTeletext = $page.find('.m-cascadingTeletext').cascadingTeletext();

				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('teletext active');
					$cascadingTeletext.removeClass('z-viewArea').find('li.z-current').removeClass('z-current');
				}).on('current', function (e) {
					console.log('teletext current');
					$cascadingTeletext.addClass('z-viewArea').find('li:first').addClass('z-current');
				});
			});
		}
	}
});