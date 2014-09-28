/* 
 *  联系方式模块：contact
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-04-26
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){

	//引用相关模块
	var $ = require('lib/zepto/zepto'),
		$ = require('lib/zepto/touch');
	var objectUtil = require('system/util/objectUtil');

	//LightApp广告类
	var LightAppAd = function () {
		//初始化变量
		this.$lightAppAd;
		//初始化
		this._init();
	}

	//初始化广告
	LightAppAd.prototype._init = function (e) {
		var theClass = this;
		if($('.m-lightAppAd').length <= 0){
			//广告
			theClass.$lightAppAd = $('<div class="m-lightAppAd">'+
										'<a href="javascript:void(0);" class="m-lightAppAd-link-guide"></a>'+
										'<div class="m-lightAppAd-body">'+
											'<div class="m-lightAppAd-title"></div>'+
											'<a href="http://mp.weixin.qq.com/s?__biz=MjM5NTI3Mzk0MA==&mid=200206728&idx=1&sn=8edd0353287f322d1279e0d4eb581c2d#rd" class="m-lightAppAd-link-get"></a>'+
											'<a href="tel:4000168906" class="m-lightAppAd-link-tel"></a>'+
										'</div>'+
									'</div>');
			//将广告放到最后一页
			$('.page:last').find('.page-content').append(theClass.$lightAppAd);
			//获取广告引导链接和主体
			var $linkGuide = theClass.$lightAppAd.find('.m-lightAppAd-link-guide'),
				$lightAppAdBody = theClass.$lightAppAd.find('.m-lightAppAd-body');
			//添加引导链接事件
			$linkGuide.on( 'click', function (e) {
				theClass.$lightAppAd.addClass('z-showBody');
				e.stopPropagation();
			});
			//点击空白处隐藏
			theClass.$lightAppAd.on('click', function (e) {
				theClass.$lightAppAd.removeClass('z-showBody');
			});
			//阻止lightAppAdBody事件冒泡
			$lightAppAdBody.on('click', function (e) {
				e.stopPropagation();
			});
		}
	};

	//移除广告
	LightAppAd.prototype.remove = function () {
		this.$lightAppAd.remove();
	}

	//判断是否需要输出广告
	var lightappAd;
	var isShowAd = $('body').data('ad');
	if(isShowAd == undefined || isShowAd == 1 || isShowAd == 'true'){
		//创建广告实例
		lightappAd = new LightAppAd();
	}else{
		//创建空的广告实例（注：避免调用错误）
		lightappAd = objectUtil.createEmptyObject(LightAppAd);
	}

	//对外提供接口
	module.exports = lightappAd;
});