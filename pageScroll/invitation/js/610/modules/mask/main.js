/* 
 *  图片蒙板组件
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

	var mask = require('./mask');

	var maskNode = $('.page-mask');
	 var app = require('modules/app/main'); 
//对外提供接口
	module.exports = {
		//初始化
		init : function(){
			// 生成mask插件
			maskNode.each(function(i,item){
				console.log('m-mask init');
				var $page = $(item);
				var opts = {
					"circle1" : $(this).find('.mask-circle-1'),
					"circle2" : $(this).find('.mask-circle-2'),
					"circle3" : $(this).find('.mask-circle-3'),
					"mask" : $(this)
				}

				var plugin = new mask(opts);
				$(this).data('mask',plugin);

				// 初始化执行mask
				plugin.init();
				//注册激活时的事件
				console.log($page);
				$page.on('active', function (e) {
					console.log('m-mask active');
				}).on('current', function (e) {
					console.log('m-mask current');
					
				}).one('current', function (e) {
					
					app.disableFlipPage();
				});
			})
		}
	}
});