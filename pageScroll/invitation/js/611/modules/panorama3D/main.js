/* 
 *  3D全景图模块页面程序入口
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-06-27
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用功能模块
	var $ = require('lib/zepto/zepto'),				//zepto模块
		$ = require('lib/zepto/touch'),				//touch模块
		$ = require('units/maskLayer');				//弹出层插件模块
	var app = require('modules/app/main');
	var pano2vrPlayer = require('lib/pano2vr/pano2vrPlayer');

	//获取页面模块jQuery对象
	var $panorama3DPages = $('.page-panorama3D');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化视频模块
			$panorama3DPages.each(function (i, item) {
				console.log('video init');
				//获取当前page页
				var $page = $(item);

				//播放按钮
				var $btnPlay = $page.find('.m-btnPlay');
				var $panorama3D = $page.find('.m-panorama3D');

				//视频组件
				var panorama3DPlayer;

				//获取ID和xml文件url
				var panoramaID = 'panorama_' + i;
				$panorama3D.attr('id', panoramaID);
				var xmlFile = document.location.origin + $panorama3D.data('file');
				var isFirst = true;
				//视频弹出层
				var panorama3DLayer = $page.find('.m-panorama3DLayer').maskLayer({
					onShow : function (e) {
						//隐藏按钮
						$btnPlay.hide();
						//禁止app翻页
						app.disableFlipPage();
						if(isFirst){
							isFirst = false;
							//初始化3D全景图
							panorama3DPlayer = new pano2vrPlayer(panoramaID);
							//读取XML数据
							panorama3DPlayer.readConfigUrl(xmlFile);
						}
					},
					onHide : function (e) {
						//显示按钮
						$btnPlay.show();
						//启用app翻页
						app.enableFlipPage();
					}
				}).maskLayer('getPluginObject');

				//播放按钮点击事件
				$btnPlay.on($.isPC ? 'click' : 'tap', function (e) {
					panorama3DLayer.show();
				});

				//注册页面激活时的事件和当前页面事件
				$page.on('active', function (e) {
					console.log('panorama3D active');
				}).on('current', function (e) {
					console.log('panorama3D current');
				});
			});
		}
	};
});