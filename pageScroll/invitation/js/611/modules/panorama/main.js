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
	var app = require('modules/app/main');
	var imageUtil = require('system/util/imageUtil');
	var styleUtil = require('system/util/styleUtil');
		
	//获取页面模块jQuery对象 
	var $panoramaPages = $('.page-panorama');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//修改panoramaImg全屏时的高度
			styleUtil.addStyle('.panoramaImg.z-fullScreen{height:'+ window.innerHeight +'px !important;}');
			var panoramaImgIndex = 0;

			//初始化图文模块
			$panoramaPages.one('current', function (e) {
				var $page = $(this);
				//获取图片框，并设置一个自增ID
				var $panoramaImg = $page.find('.panoramaImg').attr('id', 'panoramaImg' + (++ panoramaImgIndex));
				//获取滚动图片
				var $img = $panoramaImg.find('img');
				var panoramaImgID= $panoramaImg.attr('id');
				//判断滚动方式
				if($panoramaImg.is('.z-horizontal')){
					//=============动态生成初始大小时的水平滚动动画样式=============//
					//容器宽高
					var boxWidth = $panoramaImg.width();
					//图片原宽高
					var imgWidth = $img.width(),
						imgHeight = $img.height();
					//图片如果超出屏幕宽度
					var moveX = (moveX = imgWidth - boxWidth) > 0 ? moveX : 0;
					var animationStyle = '@-webkit-keyframes '+ panoramaImgID +'_default{'+
											'0% {-webkit-transform: translateX(0px);}'+
											'50% {-webkit-transform: translateX(-'+ moveX +'px);}'+
											'100% {-webkit-transform: translateX(0px);}'+
										'}';
					styleUtil.addStyle(animationStyle);
					//=============动态生成全屏大小时的水平滚动动画样式=============//
					//图片全屏后宽高
					var fullImgHeight = window.innerHeight,
						fullImgWidth = window.innerHeight * (imgWidth / imgHeight);
					//图片如果超出屏幕宽度
					var moveX = (moveX = fullImgWidth - 640) > 0 ? moveX : 0;
					var animationStyle = '@-webkit-keyframes '+ panoramaImgID +'_fullScreen{'+
											'0% {-webkit-transform: translateX(0px);}'+
											'50% {-webkit-transform: translateX(-'+ moveX +'px);}'+
											'100% {-webkit-transform: translateX(0px);}'+
										'}';
					styleUtil.addStyle(animationStyle);
					//初始化水平动画滚动
					$img.css('-webkit-animation', panoramaImgID + '_default ' + ($img.width() / 65).toFixed(2) + 's linear infinite');
				}else{
					//=============动态生成初始大小时的伸缩滚动动画样式=============//
					//容器宽高
					var boxWidth = $panoramaImg.width();
					var boxHeight = $panoramaImg.height();
					//图片原宽高
					var imgWidth = $img.width(),
						imgHeight = $img.height();
					var moveX = moveY = 0;
					if((imgWidth / imgHeight) < (boxWidth / boxHeight)){
						styleUtil.addStyle('.panoramaImg.z-retractable img{width: 100%; height: auto;}');
						imgWidth = $img.width();
						imgHeight = $img.height();
						moveY = (moveY = (imgHeight - boxHeight) / 2) > 0 ? moveY : 0;
					}else{
						styleUtil.addStyle('.panoramaImg.z-retractable img{width: auto; height: 100%;}');
						imgWidth = $img.width();
						imgHeight = $img.height();
						moveX = (moveX = (imgWidth - boxWidth) / 2) > 0 ? moveX : 0;
					}

					//获取超出容器宽度的一半
					var moveX = (moveX = (imgWidth - boxWidth) / 2) > 0 ? moveX : 0;
					var animationStyle = '@-webkit-keyframes '+ panoramaImgID +'_default{'+
											'0% {-webkit-transform: translate(-'+ moveX +'px, -'+ moveY +'px) scale(1);}'+
											'50% {-webkit-transform: translate(-'+ moveX +'px, -'+ moveY +'px) scale(1.8);}'+
											'100% {-webkit-transform: translate(-'+ moveX +'px, -'+ moveY +'px) scale(1);}'+
										'}';
					styleUtil.addStyle(animationStyle);
					//=============动态生成全屏大小时的伸缩滚动动画样式=============//
					//图片全屏后宽高
					var fullImgHeight = window.innerHeight,
						fullImgWidth = window.innerHeight * (imgWidth / imgHeight);
					//获取超出屏幕宽度的一半
					moveX = (moveX = (fullImgWidth - 640) / 2) > 0 ? moveX : 0;
					moveY = 0;
					styleUtil.addStyle('.panoramaImg.z-retractable.z-fullScreen img{width: auto; height: 100%;}');
					var animationStyle = '@-webkit-keyframes '+ panoramaImgID +'_fullScreen{'+
											'0% {-webkit-transform: translate(-'+ moveX +'px, -'+ moveY +'px) scale(1);}'+
											'50% {-webkit-transform: translate(-'+ moveX +'px, -'+ moveY +'px) scale(1.8);}'+
											'100% {-webkit-transform: translate(-'+ moveX +'px, -'+ moveY +'px) scale(1);}'+
										'}';
					styleUtil.addStyle(animationStyle);
					//初始化伸缩动画滚动
					$img.css('-webkit-animation', panoramaImgID + '_default 16s linear infinite');
				}

				//注册点击事件
				$panoramaImg.on($.isPC ? 'click' : 'tap', function (e) {
					var $this = $(this);
					$this.toggleClass('z-fullScreen');
					setTimeout(function () {
						var animationName = $this.is('.z-fullScreen') ? $this.attr('id') + '_fullScreen' : $this.attr('id') + '_default';
						if($this.is('.z-retractable')){
							$img.css('-webkit-animation', animationName + ' 16s linear infinite');
						}else{
							$img.css('-webkit-animation', animationName + ' ' + ($img.width() / 65).toFixed(2) + 's linear infinite');
						}
					}, 700);
				});
			});

			//注册激活时的事件
			$panoramaPages.on('active', function (e) {
				console.log('panorama active');
				$(this).find('.m-panorama').removeClass('z-viewArea');
			}).on('current', function (e) {
				console.log('panorama current');
				$(this).find('.m-panorama').addClass('z-viewArea');
			});
		}
	};
});