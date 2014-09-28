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

	//内容Pop弹层类
	var ArticlePop = function () {
		//定义属性
		this.$articlePop;
		this.articlePop;
		this.$articleWrapper;
		this.$article;
		this.articleWrapperIScroll;

		//初始化
		this._init();
	};

	//初始化
	ArticlePop.prototype._init = function() {
		var $appContent = $('.app-content');
		//初始化弹出层
		//this.$articlePop = $appContent.find('.m-articlePop');
		/*
		this.$articlePop.maskLayer({
					clickHideMode: 2,
					closeButton: false,
					onShow: function (e) {
						app.disableFlipPage();
					},
					onHide: function (e) {
						app.enableFlipPage();
					}
				});
				this.articlePop = this.$articlePop.maskLayer('getPluginObject');
		*/
		
		//初始化内容区滚动条
		//this.$articleWrapper = this.$articlePop.find('.m-articleWrapper');
		//this.$article = this.$articleWrapper.children('article');
		//this.articleWrapperIScroll = new IScroll(this.$articleWrapper[0]);
	};
	
	//显示
	ArticlePop.prototype.show = function(htmlContent) {
		var theClass = this;
		//显示内容
		this.$article.html(htmlContent);
		this.articlePop.show();
		setTimeout(function () {
			theClass.articleWrapperIScroll.scrollTo(0, 0);
			theClass.articleWrapperIScroll.refresh();
		}, 100);
	};

	//隐藏
	ArticlePop.prototype.hide = function() {
		this.articlePop.hide();
	};

	//提供模块接口
	module.exports = new ArticlePop();
});