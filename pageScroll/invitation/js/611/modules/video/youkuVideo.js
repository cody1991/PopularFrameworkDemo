/* 
 *  video插件
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
		$ = require('lib/zepto/selector'),
		$ = require('lib/zepto/data');
	var youkuApi = require('lib/youku/jsapi');

	//注册YoukuVideo插件
	(function () {
		var playerIndex = 0;
		//定义YoukuVideo插件对象
		var YoukuVideo = function ($item, options) {
			var theClass = this;
			//定义属性
			this.$target = $item.addClass('m-youkuVideo');		//目标容器
			this.settings = null;								//设置项
			this.player = null;									//优酷播放器对象
			this._playerID = 'videoBody_' + (++playerIndex);	//视频对象容器ID

			//初始化设置
			var devID = this.$target.data('devid'),
				videoUrl = this.$target.data('src');

			this.settings = $.extend({
				devID : devID ? devID : '168eed9e805f5239',											//忧库开发者ID
				url : (videoUrl && videoUrl.indexOf('youku') >= 0) ? videoUrl : 'http://v.youku.com/v_show/id_XNzAyNDcyMzAw.html',	//视频链接
				onPlayerReady : function(){ console.log("event：准备就绪"); },	//准备就绪事件
				onPlayStart : function(){ console.log("event：播放开始"); },	//播放开始事件
				onPlayEnd : function(){ console.log("event：播放结束"); }		//播放结束事件
			}, options);

			//初始化播放器
			this.$target.attr('id', this._playerID);
			this.player = new youkuApi.YKU.Player(this._playerID ,{
				styleid: '0',
				client_id: theClass.settings.devID,
				vid: theClass._getVidByUrl(theClass.settings.url),
				show_related : false,
				autoplay : true,
				events:{
					onPlayerReady: theClass.settings.onPlayerReady,
					onPlayStart: function (e) {
						theClass._isPlayStart = true;
						theClass.settings.onPlayStart(e);
					},
					onPlayEnd: theClass.settings.onPlayEnd
				}
			});


			//解决android 4.2下播放一次后再次播放一直loading的问题
			this._isPlayStart = false;
			this.$target.on($.isPC ? 'click' : 'tap', function (e) {
				if(!theClass._isPlayStart){
					setTimeout(function () {
						theClass.play();
					}, 200);
				}
			});
		};
		
		//根据优酷视频地址获取视频ID
		YoukuVideo.prototype._getVidByUrl = function (url) {
			var vid = url ? vid = url.substring(url.indexOf('/id_')+4, url.indexOf('.html')) : '';
			if(!vid){
				console.log('error：视频地址不正确！');
			}
			return vid;
		}
		
		//播放
		YoukuVideo.prototype.play = function () {
			try{
				this.player.playVideo();
			}catch(e){
				console.log(e);
			}
		}
		
		//暂停
		YoukuVideo.prototype.pause = function () {
			try{
				this.player.pauseVideo();
			}catch(e){
				console.log(e);
			}
		}
		
		//销毁
		YoukuVideo.prototype.destroy = function () {
			this.$target.html('').data('plugin_video', null);
			delete this.player;
		}

		//注册video插件接口
		$.fn.youkuVideo = function (options) {
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
						//实例化YoukuVideo对象
						var pluginObj = new YoukuVideo($item, options);
						//将当前插件对象保存到data中
						$item.data('plugin_video', pluginObj);
					});
				break;
				//对象初始化
				case 'getPluginObject':
					//将当前插件对象保存到data中
					return this.data('plugin_video');
				break;
			}

			//保持操作链
			return this;
		};
	})();

	module.exports = $;
});