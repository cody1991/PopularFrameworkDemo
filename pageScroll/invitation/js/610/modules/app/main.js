/* 
 *  app全局模块
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-16
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用功能库模块
	var $ = require("lib/zepto/zepto"),					//zepto模块
		$ = require("units/weixin"),
		$ = require("lib/zepto/selector");			//选择器插件模块
		require("units/lightAppAd");						//云来轻app广告

	//引用app全局模块
	var globalAudio = require('units/globalAudio');		//全局音频模块
	var statistics = require('./statistics');			//流量统计模块

	//App类
	var App = function ($item) {
		console.log('app init');

		//定义属性对象
		this._$app = $item;							//app容器包装对象
		this._$pages = this._$app.find('.page');	//app中所有的页面集合
		this.$currentPage = this._$pages.eq(0);		//当前显示的页面
		this._isFirstShowPage = true;				//是否第一次显示页面
		this._isInitComplete = false;				//是否初始化已经完成
		this._isDisableFlipPage = false;			//是否禁止翻页
		this._first = false;

		// 定义page高度(body高度)
		this._$app.height($(window).height());
		this._$pages.height($(window).height());

		//定义变量
		var theClass = this;
		var $win = $(window);

		//禁用不需要的浏览器默认行为
		(function () {
			//禁止ios的浏览器容器弹性
			$win.on('scroll.elasticity', function (e) {
				e.preventDefault();
			}).on('touchmove.elasticity', function (e) {
				e.preventDefault();
			});

			//禁止拖动图片
			$win.delegate('img', 'mousemove', function (e) {
				e.preventDefault();
			});
		})();

		//初始化页面切换效果
		$win.on('load', function (e) {
			//定义临时变量
			var currentPage = null, activePage = null;
			var startX = 0, startY = 0, moveDistanceX = 0, moveDistanceY = 0, isStart = false, isNext = false, isFirstTime = true;
			//为theClass._$app添加事件
			theClass._$app.on('mousedown touchstart', function (e) {
				//动画正在运行时或禁止翻页时不进行下一轮切换
				if(theClass._isDisableFlipPage){
					return;
				}
				//获取当前显示的页面和将要显示的页面
				currentPage = theClass._$pages.filter('.z-current').get(0);
				activePage = null;
				//初始化切换变量、属性
				if(currentPage){
					isStart = true;
					isNext = false;
					isFirstTime = true;
					moveDistanceX = 0;
					moveDistanceY = 0;
					if(e.type == 'mousedown'){
						startX = e.pageX;
						startY = e.pageY;
					}else{
						startX = e.touches[0].pageX;
						startY = e.touches[0].pageY;
					}
					currentPage.classList.add('z-move');
					currentPage.style.webkitTransition = 'none';
				}
			}).on('mousemove touchmove', function (e) {
				//当启动新一轮切换并且将要显示的页面不为null或者为启动后第一次进入move事件
				if(isStart && (activePage || isFirstTime)){
					//获取移动距离
					if(e.type == 'mousemove'){
						moveDistanceX = e.pageX - startX;
						moveDistanceY = e.pageY - startY;
					}else{
						moveDistanceX = e.touches[0].pageX - startX;
						moveDistanceY = e.touches[0].pageY - startY;
					}

					//如果Y移动的距离大于X移动的距离，并且大于50，则进行翻页操作
					if(Math.abs(moveDistanceY) > Math.abs(moveDistanceX)){
						//判断用户是向上还是向下拉
						if(moveDistanceY > 0){
							if (!theClass._first && $(currentPage).index() == 0) {
								return
							}

							//向下拉：显示上一页
							if(isNext || isFirstTime){
								//设置临时变量值
								isNext = false;
								isFirstTime = false;
								//清除上次将要显示的页面
								if(activePage){
									activePage.classList.remove('z-active');
									activePage.classList.remove('z-move');
								}
								//获取当前将要显示的上一页
								activePage = currentPage.previousElementSibling;
								if(!activePage) {
									activePage = $(currentPage).siblings().last()[0];
								}
								if(activePage){
									//获取成功：初始化上一页
									activePage.classList.add('z-active')
									activePage.classList.add('z-move');
									activePage.style.webkitTransition = 'none';
									activePage.style.webkitTransform = 'translateY(-100%)';
									$(activePage).trigger('active');
									currentPage.style.webkitTransformOrigin = 'bottom center';
								}else{
									//获取失败：重置当前页
									currentPage.style.webkitTransform = 'translateY(0px) scale(1)';
								}
							}else{
								//移动时设置样式
								currentPage.style.webkitTransform = 'scale('+1 +')';
								activePage.style.webkitTransform = 'translateY(-'+ (window.innerHeight - moveDistanceY) +'px)';
							}
						}else if(moveDistanceY < 0){
							//向上拉：显示下一页
							if(!isNext || isFirstTime){
								//设置临时变量值
								isNext = true;
								isFirstTime = false;
								//清除上次将要显示的页面
								if(activePage){
									activePage.classList.remove('z-active');
									activePage.classList.remove('z-move');
								}
								//获取当前将要显示的下一页
								activePage = currentPage.nextElementSibling;
								if(!activePage) {
									activePage = $(currentPage).siblings().eq(0)[0];
								}

								if(activePage){
									//获取成功：初始化下一页
									activePage.classList.add('z-active');
									activePage.classList.add('z-move');
									activePage.style.webkitTransition = 'none';
									activePage.style.webkitTransform = 'translateY('+window.innerHeight+'px)';
									$(activePage).trigger('active');
									currentPage.style.webkitTransformOrigin = 'top center';
								}else{
									//获取失败：重置当前页
									currentPage.style.webkitTransform = 'translateY(0px) scale(1)';

								}
							}else{
								//移动时设置样式
								currentPage.style.webkitTransform = 'scale('+1 +')';
								activePage.style.webkitTransform = 'translateY('+ (window.innerHeight + moveDistanceY) +'px)';
							}
						}
					}
				}
			}).on('mouseup touchend', function (e) {
				if(isStart){
					//设置临时变量
					isStart = false;
					if(activePage){
						theClass._isDisableFlipPage = true;
						//启动转场动画
						currentPage.style.webkitTransition = '-webkit-transform 0.4s ease-out';
						activePage.style.webkitTransition = '-webkit-transform 0.4s ease-out';
						//判断移动距离是否超过100
						if(Math.abs(moveDistanceY) > Math.abs(moveDistanceX) && Math.abs(moveDistanceY) > 100){
							//切换成功：设置当前页面动画
							if(isNext){
								currentPage.style.webkitTransform = 'scale(1)';
								activePage.style.webkitTransform = 'translateY(0px)';
							}else{
								currentPage.style.webkitTransform = 'scale(1)';
								activePage.style.webkitTransform = 'translateY(0px)';
							}
							//页面动画运行完成后处理
							setTimeout(function () {
								activePage.classList.remove('z-active');
								activePage.classList.remove('z-move');
								activePage.classList.add('z-current');
								currentPage.classList.remove('z-current');
								currentPage.classList.remove('z-move');
								theClass._isDisableFlipPage = false;
								//保存当前页面，并触发页面激活事件
								this.$currentPage = $(activePage).trigger('current');

								if (!theClass._first && $(currentPage).index() == theClass._$pages.size() -1) {
									theClass._first = true;
								}
							},500);
						}else{
							//切换取消：设置当前页面动画
							if(isNext){
								currentPage.style.webkitTransform = 'scale(1)';
								activePage.style.webkitTransform = 'translateY(100%)';
							}else{
								currentPage.style.webkitTransform = 'scale(1)';
								activePage.style.webkitTransform = 'translateY(-100%)';
							}
							//页面动画运行完成后处理
							setTimeout(function () {
								activePage.classList.remove('z-active');
								activePage.classList.remove('z-move');
								theClass._isDisableFlipPage = false;
							},500);
						}
					}else{
						currentPage.classList.remove('z-move');
					}
				}
			});
		});

		//为非最后页的页面添加手引标记
		$win.on('load', function (e) {
			var guideHtml = '<a href="javascript:void(0);" class="u-guideTop z-move"></a>';
			theClass._$pages.not(theClass._$pages.last()).append(guideHtml);
		});

		//分享后跳转到用户指定页面
		function jump() {
			var weixin_callback = $('input[data-weixin-callback]');
			if(weixin_callback.length>0 && weixin_callback.val()!="") {
				window.location = weixin_callback.val();	
			}
		};
		
		//初始化微信分享接口
		(function () {
			//获取内容
			var title = $('title').text(),
				content = $('[name="description"]').length ? $('[name="description"]').attr('content') : title+'，敬请访问！',
				picUrl = $('input[data-share-pic]').val();
				image = 'http://'+location.host+'/'+picUrl;
			//调用微信插件接口
			theClass._$app.wx({
				title : title, 
				con : content,
				img : image,
				handler : {callback:jump},
			});
		})();


		//初始化Loading组件
		$win.on('load', function (e) {
			//获取对象
			var $appLoading = $('#app-loading');
			//控制隐藏/移除
			$appLoading.addClass('z-hide');
			$appLoading.on('webkitTransitionEnd', function (e) {
				$appLoading.remove();
			});

			//指示初始化完成
			theClass._isInitComplete = true;
			//显示第一个页面
			theClass.showPage();
		});
	};

	//显示页面
	App.prototype.showPage = function(page) {
		var theClass = this;
		//获取方法
		window._app_showPage ? window._app_showPage : window._app_showPage = function (page) {
			//找到要显示的页面
			var type = typeof(page);
			var $page;
			switch(type){
				case 'number':
					$page = this._$pages.eq(page);
				break;
				case 'string':
					$page = this._$pages.filter(page).first();
				break;
				case 'object':
					$page = $(page);
				break;
			}
			//判断是否为第一次显示页面并且没带页面参数，则当前页面为第一个页面
			if(this._isFirstShowPage && (!$page || !$page.length)){
				$page = this.$currentPage;
				this._isFirstShowPage = false;
			}
			//如果存在则显示当前页面
			if($page && $page.length){
				this._$pages.filter('.z-current').removeClass('z-current');
				$page.css('-webkit-transform', 'none').addClass('z-current');
				this.$currentPage = $page;
			}
		};

		//如果初始化已完成
		if(this._isInitComplete){
			//直接调用
			window._app_showPage.apply(theClass, [page]);
		}else{
			//等加载完成后再调用
			$(window).one('load', function () {
				window._app_showPage.apply(theClass, [page]);
			});
		}
	};

	//禁用翻页
	App.prototype.disableFlipPage = function () {
		//设置禁止翻页变量值
		this._isDisableFlipPage = true;
	};

	//启用翻页
	App.prototype.enableFlipPage = function () {
		//设置禁止翻页变量值
		this._isDisableFlipPage = false;
	};

	//创建app对象
	var app = new App( $('body') );

	//对外提供app对象接口
	module.exports = app;
});