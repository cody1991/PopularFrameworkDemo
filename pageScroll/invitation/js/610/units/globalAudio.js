/* 
 *  全局音频组件
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-04-26
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/
 
define(function(require, exports, module){

	//引用功能模块
	var $ = require('lib/zepto/zepto'),		//zepto模块
		$ = require('lib/zepto/touch'),		//触摸插件模块
		$ = require('lib/zepto/coffee')
	var objectUtil = require('system/util/objectUtil');		//触摸插件模块

	//全局音频类
	var GlobalAudio = function ($item) {
		//定义属性
		this._$globalAudio = $item;							//容器对象
		this._$tip = $('<span></span>');					//文本提示容器
		this.audio = this._$globalAudio.find('audio')[0];	//获取音频控件
		this.isAllowManually = false;						//是否允许手动操作
		this.playState = 'ready';							//当前播放状态

		//定义临时变量
		var theClass = this;

		//添加文本提示容器
		this._$globalAudio.append(this._$tip);

		// 音符飘逸
		this._$globalAudio.coffee({
			steams : ['<img src="invitation/images/610/musicalNotes.png"/>'
					,'<img src="invitation/images/610/musicalNotes.png"/>'
					,'<img src="invitation/images/610/musicalNotes.png"/>'
					,'<img src="invitation/images/610/musicalNotes.png"/>'
					,'<img src="invitation/images/610/musicalNotes.png"/>'
					,'<img src="invitation/images/610/musicalNotes.png"/>'],
			steamHeight : 100,
			steamWidth : 50
		});

		//加载完成时自动播放
		if(this.audio.autoplay){
			this.audio.pause();
			$(window).on('load', function (e) {
				theClass.play();
			});
		}

		//加载完成后才允许手动控制播放
		$(window).on('load', function (e) {
			theClass.isAllowManually = true;		
		});

		//播放控制
		this._$globalAudio.on( $.isPC ? 'click' : 'tap', function (e) {
			e.preventDefault();
			if(theClass.isAllowManually){
				theClass._$globalAudio.is('.z-play') ? theClass.pause() : theClass.play();
			}
		});

		//修复ios/android 4.4下音频不播放的问题
		$(document).one('touchstart', function (e) {
			theClass.audio.play();
		});
	};

	//播放
	GlobalAudio.prototype.play = function() {
		if(!this._$globalAudio.is('.z-play')){
			this.audio.play();
			this._$globalAudio.removeClass('z-pause').addClass('z-play');
			this._showTip('开启');
			this.playState = 'playing';
			$.fn.coffee.start();
		}
	};

	//暂停
	GlobalAudio.prototype.pause = function() {
		if(!this._$globalAudio.is('.z-pause')){
			this.audio.pause();
			this._$globalAudio.removeClass('z-play').addClass('z-pause');
			this._showTip('关闭');
			this.playState = 'pause';
			$.fn.coffee.stop();
		}
	};

	//显示提示
	GlobalAudio.prototype._showTip = function(msg) {
		var theClass = this;
		this._$tip.text(msg);
		this._$tip.addClass('z-show');
		setTimeout(function(){
			theClass._$tip.removeClass('z-show');
		}, 1000);
	};

	//获取全局音频容器
	var $globalAudio = $('.u-globalAudio');
	var globalAudio;

	if($globalAudio.length){
		//初始化全局音频对象
		globalAudio = new GlobalAudio( $('.u-globalAudio') );
	}else{
		//根据GlobalAudio类创建一个空对象，以免其它模块调用方法时报错
		globalAudio = objectUtil.createEmptyObject(GlobalAudio);
	}

	//对外输出接口
	module.exports = globalAudio;
});
