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
	var IScroll = require('lib/iscroll/iscroll');
	var articlePop = require('modules/common/articlePop');
	var mortgageCalculator = require('modules/common/mortgageCalculator');
		
	//获取页面模块jQuery对象
	var $houseType = $('.page-houseType');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化图文模块
			$houseType.each(function (i, item) {
				console.log('houseType init');
				//获取当前page页
				$page = $(item);
				
				//初始化m-houseTypeList模块
				var $houseTypeList = $page.find('.m-houseTypeList');
				(function ($houseTypeList) {
					//多户型滚动
					$page.one('current', function (e) {
						var $ul = $houseTypeList.find('ul');
						$ul.width($ul.children().length * 640);
						new IScroll($houseTypeList[0], {
							scrollX: true,
							scrollY: false,
							momentum: false,
							snap: true,
							snapSpeed: 640,
							keyBindings: true
						});
					});

					//注册链接点击事件
					$houseTypeList.delegate('.linkDetail', $.isPC ? 'click' : 'tap', function (e) {
						//显示房型详情
						articlePop.show($(this).siblings('textarea').val());
					}).delegate('.linkCalculator', $.isPC ? 'click' : 'tap', function (e) {
						var $this = $(this);
						//设置字段
						mortgageCalculator.setFields({
							area : $this.data('area'),
							unitPrice : $this.data('price')
						});
						//显示计算器
						mortgageCalculator.show();
					});
				})($houseTypeList);

				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('houseType active');
					$houseTypeList.removeClass('z-viewArea');
				}).on('current', function (e) {
					console.log('houseType current');
					$houseTypeList.addClass('z-viewArea');
				});
			});
		}
	}
});