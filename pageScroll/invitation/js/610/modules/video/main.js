/* 
 *  视频模块页面程序入口
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-20
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用功能模块
	var $ = require('lib/zepto/zepto'),				//zepto模块
		$ = require('lib/zepto/touch'),				//touch模块
		$ = require('units/maskLayer'),				//优酷视频播放插件模块
		$ = require('./youkuVideo');				//优酷视频播放插件模块
	var app = require('modules/app/main');			//App模块

	//引用全局模块
	var globalAudio = require('units/globalAudio');	//全局音频模块

	//获取页面模块jQuery对象
	var $videoPages = $('.page-video');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化视频模块
			$videoPages.each(function (i, item) {
				console.log('video init');
				//获取当前page页
				var $page = $(item);

				//播放按钮
				var $btnPlay = $page.find('.m-btnPlay');
				var $youkuVideo = $page.find('.m-youkuVideo');

				//视频组件
				var youkuVideo;

				//全局音频播放状态变量
				var playState = 'playing';
				
				//视频弹出层
				var youkuVideoLayer = $page.find('.m-youkuVideoLayer').maskLayer({
					onShow : function (e) {
						//隐藏按钮
						$btnPlay.hide();
						//禁止app翻页
						app.disableFlipPage();
						//保存当前播放状态
						playState = globalAudio.playState;
						//打开视频时暂停全局音频
						globalAudio.pause();
						//禁用手动操作
						globalAudio.isAllowManually = false;
						//创建视频对象
						youkuVideo = $youkuVideo.youkuVideo().youkuVideo('getPluginObject');
					},
					onHide : function (e) {
						//显示按钮
						$btnPlay.show();
						//启用app翻页
						app.enableFlipPage();
						//关闭视频时，如果打开前是播放状态则启动播放
						if(playState == 'playing'){
							globalAudio.play();
						}
						//启动手动操作
						globalAudio.isAllowManually = true;
						//销毁视频对象
						youkuVideo.destroy();
					}
				}).maskLayer('getPluginObject');

				//播放按钮点击事件
				$btnPlay.on($.isPC ? 'click' : 'tap', function (e) {
					youkuVideoLayer.show();
				});

				//注册页面激活时的事件和当前页面事件
				$page.on('active', function (e) {
					console.log('video active');
				}).on('current', function (e) {
					console.log('video current');
				});
			});
		}
	}
});