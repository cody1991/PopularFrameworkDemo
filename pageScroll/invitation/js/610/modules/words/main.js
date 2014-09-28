/* 
 *  留言模块
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
		$ = require('lib/zepto/data');

	var app = require('modules/app/main'); 
	var widget = require('units/widget');
	var iScroll = require('./iScroll');		

	var words = function(){
		this.wordsWall = null;
		this.plugin = null;
		this.openWallBtn = $('.j-wall-open');
		this.editWallBtn = null;
		this.editWallTet = null;
		this.editWallInput = null;
		this.submitWallBtn = null;
		this.wodrdsDetail = null;
		this.wordsWarn = null;


		var that = this;
		// 留言内容iscroll插件生成
		$('.m-words-wall').each(function(){
			var wrap = $(this).find('.content')[0];
			var scroller = $(this).find('.content-wrap')[0];

			var plugin = new iScroll(wrap,scroller);
			$(this).data('scroll', plugin);
			
			// 插件绑定事件
			that.event(plugin,that);
		})
	}

	words.prototype = $.extend({},widget,{

		init : function(){
			this.wallOpen();
		},

		wallOpen : function(){
			var that = this;

			this.openWallBtn.on(this._click,function(){
				// 记录当前留言模块
				that.wordsWall = $(this).parents('.page-words').find('.m-words-wall');
				that.editWallBtn = that.wordsWall.find('.j-wall-edit');
				that.editWallTet = that.wordsWall.find('.j-wall-txt');
				that.editWallInput = that.wordsWall.find('.j-wall-input');
				that.submitWallBtn = that.wordsWall.find('.j-wall-submit');
				that.wodrdsDetail = that.wordsWall.find('.m-words-detail');
				that.wordsWarn = that.wordsWall.find('.m-words-warn');
				that.plugin = that.wordsWall.data('scroll');

				// 绑定事件
				that.wallClose();
				that.wordEdit();
				that.wordSubmit();

				// 判断是否评论可加载更多
				var len = that.wodrdsDetail.find('ul li').size();
				if (len < 10) {
					that.wordsWarn.data('noInfo','true');
					that.wordsWarn.hide();
				}

				that.wordsWall.show();

				setTimeout(function(){
					that.wordsWall.addClass('z-show');
				},20)

				// iscoll插件刷新
				var height = that.plugin.scroller.offsetHeight;
				that.plugin.refresh(height - 60);

				app.disableFlipPage();
			})
		},

		wallClose : function(){
			var that = this;

			this.wordsWall.off(this._click);
			this.wordsWall.on(this._click,function(e){
				var node = e.target;
				var $node = $(node);

				if ( ($node.parents('.wrap').length>0 || $node.hasClass('wrap')) && $node.parents('.j-wall-close').length<=0 ) {
					return;
				} else {
					that.wordsWall.removeClass('z-show');
					setTimeout(function(){
						that.wordsWall.hide();
					},500)

					app.enableFlipPage();
				}
			})
		},

		wordEdit : function(){
			var that = this;
			
			this.editWallBtn.off(this._click);
			this.editWallBtn.on('click',function(){
				// iscoll插件刷新
				that.plugin.scrollTo(0, 0);

				that.editWallTet.focus();
			})

			this.editWallTet.off('focus blur');
			this.editWallTet.on('focus',function(){
				var span = $(this).next('span');

				span.hide();

				that.plugin.initEvents(true);
				that.windowStart();
			})

			this.editWallTet.on('blur',function(){
				var span = $(this).next('span');

				span.show();

				that.plugin.initEvents(false);
				that.windowStop();
			})

			this.editWallInput.off('focus blur');
			this.editWallInput.on('focus',function(){
				that.plugin.initEvents(true);
				that.windowStart();
			})

			this.editWallInput.on('blur',function(){
				that.plugin.initEvents(false);
				that.windowStop();
			})
		},

		wordSubmit : function(){
			var that = this;

			this.submitWallBtn.on(this._click,function(){
				var node = that.wordsWall.find('.m-words-form');
				var verify = that.wordsVerify(node,that);

				if (!verify) return;

				if (that.wordsWall.data('ajaxSubmit') == 'true') {
					return
				}

				// loading-show
				that.loadingPageShow($('.u-pageLoading'));

				// 输入框失去焦点
				that.wordsWall.find('input').blur();
				that.wordsWall.find('textarea').blur();

				// 提交信息
				var txt = that.wordsWall.find('.m-words-form').find('textarea[name="content"]').val();
				var name = that.wordsWall.find('.m-words-form').find('input[name="name"]').val();
				var layout_id = $(this).parents('.page').data('layout-id');
				var app_id = $('body').data('app-id');
				var url = '/school/comment';

				// 记录请求发起
				that.wordsWall.data('ajaxSubmit','true');

				$.ajax({
					url: url,
					cache: false,
					dataType: 'json',
					async: true,
					type:'POST',
					data : {
						"content" : txt,
						"from" : name,
						"layout_id" : layout_id,
						"app_id" : app_id
					},	
					success: function(msg){
						// loading-hide
						that.loadingPageHide($('.u-pageLoading'));

						// 记录请求成功
						that.wordsWall.data('ajaxSubmit','false');
						if (msg.success) {
							// 成功
							var data = eval('('+msg.data+')');
							var time = data.date ? data.date : "今天";
							var id = data.id;

							// 插入评论信息
							var h = $('<h4><span></span><strong>发表于'+time+'</strong></h4>');
							h.children("span").text(name);
							var p =$('<p></p>');
							p.text(txt);
							var li = $('<li class="detail-item" data-comment-id="'+id+'"></li>').append(h).append(p);
							that.wodrdsDetail.find('ul').prepend(li);

							// 评论总数+1
							var num = parseInt(that.wodrdsDetail.find('h3 em strong').text()) + 1;
							that.wodrdsDetail.find('h3 em strong').text(num);

							// 清空评论
							that.wordsWall.find('.m-words-form').find('textarea[name="content"]').val('');

							// iscoll插件刷新
							var height = that.plugin.scroller.offsetHeight;
							that.plugin.refresh(height - 60);

							that.showCheckMessage($('.u-note'),'提交成功',true);
						} else{
							// 失败
							that.showCheckMessage($('.u-note'),'提交失败',false);
						}
					},
					error : function (XMLHttpRequest, textStatus, errorThrown) {
						// loading-hide
						that.loadingPageHide($('.u-pageLoading'));

						// 失败
						that.showCheckMessage($('.u-note'),'提交失败',false);

						// 记录请求失败
						that.wordsWall.data('ajaxSubmit','false');
					}
				})
			})
		},

		wordsVerify : function(node,obj){
			var input = node.find('input');
			var textarea = node.find('textarea');
			var note = $('.u-note');

			var con = textarea.val();
			var name = input.val();

			if ($.trim(con) == '') {
				obj.showCheckMessage(note,'你想对他说点什么!',false);
				textarea.focus();
				return false;
			}

			if ($.trim(name) == '') {
				obj.showCheckMessage(note,'请留下大名哦',false);
				input.focus();
				return false;
			}

			if (con.length>=140 && con != '') {
				obj.showCheckMessage(note,'评论最多只能容纳140个字哦！',false);
				textarea.focus();
				return false;	
			}

			if (name.length>=30 && name != '') {
				obj.showCheckMessage(note,'名字不能太长哦，30个字',false);
				input.focus();
				return false;
			}

			return true;
		},

		event : function(el,obj){
			el._on('move',function(){
				app.disableFlipPage();
				
				if (obj.wordsWall) {
					obj.wordsWall.find('input').blur();
					obj.wordsWall.find('textarea').blur();
				} else {
					return;
				}
			})

			// 页面评论加载更多
			el._on('end',function(x,y,x2,y2,node){
				// 没有信息加载
				if (obj.wordsWarn.data('noInfo') == 'true') {
					return
				}

				var height = obj.plugin.scroller.offsetHeight;

				if ( (x2 - x) >= 50 || (y2 - y) >= 50) {
					obj.wordsWarn.data('loading','true');

					if (obj.wordsWarn.data('loadMore') == 'true') {
						return
					}

					obj.plugin.refresh(height);

					obj.wordsWarn.find('.warn-txt').hide();
					obj.wordsWarn.find('.warn-loading').show();

					obj.loadMoreCommend(obj);
				} else {
					obj.wordsWarn.data('loading','false');

					obj.plugin.refresh(height - 60);
				}
			})

			// 页面滑动
			el._on('move',function(x,y,x2,y2,node){
				if (!$(node).hasClass('content')) {
					return
				}

				// 没有信息加载
				if (obj.wordsWarn.data('noInfo') == 'true') {
					return
				}

				if (obj.wordsWarn.data('loading') == 'true') {
					return
				}

				obj.wordsWarn.find('.warn-txt').show();
				obj.wordsWarn.find('.warn-loading').hide();
				if ( (x2 - x) >= 50 || (y2 - y) >= 50) {
					obj.wordsWarn.find('.warn-txt').addClass('z-change');
				} else {
					obj.wordsWarn.find('.warn-txt').removeClass('z-change');
				}
			})
		},

		loadMoreCommend : function(obj){
			obj.wordsWarn.data('loadMore','true');

			// 提交信息
			var count = 10;
			var start = obj.wodrdsDetail.find('ul li').last().data('comment-id');
			var layout_id = obj.wodrdsDetail.parents('.page').data('layout-id');
			var app_id = $('body').data('app-id');
			var url = '/school/getcomment';

			$.ajax({
				url: url,
				cache: false,
				dataType: 'json',
				async: true,
				type:'POST',
				data : {
					"count" : count,
					"start" : start,
					"layout_id" : layout_id,
					"app_id" : app_id
				},	
				success: function(msg){
					if (msg.success) {
						var data = eval('('+msg.data+')');
						console.log("xxxxxxx")

						// 插入评论信息
						for (var i = 0; i < data.length; i++) {
							var h = $('<h4><span>'+data[i].from+'</span><strong>发表于'+data[i].date+'</strong></h4>');
							var p =$('<p>'+data[i].content+'</p>');
							var li = $('<li class="detail-item" data-comment-id="'+data[i].id+'"></li>').append(h).append(p);
							obj.wodrdsDetail.find('ul').append(li);
						}

						// 没有信息加载,关闭评论加载更多功能
						if (data.length < 10) {
							obj.wordsWarn.data('noInfo','true');
							obj.wordsWarn.hide();
						}

					} else {
						// todo
						obj.wordsWarn.data('loadMore','false');
						obj.wordsWarn.data('loading','false');

						// iscoll插件刷新
						var height = obj.plugin.scroller.offsetHeight;
						obj.plugin.refresh( height - 60);

						// 提示
						obj.showCheckMessage($('.u-note'),'提交失败!',false);
					}

					obj.wordsWarn.data('loadMore','false');
					obj.wordsWarn.data('loading','false');

					// iscoll插件刷新
					var height = obj.plugin.scroller.offsetHeight;
					obj.plugin.refresh( height - 60);
					obj.plugin.resetPosition();
				},
				error : function (XMLHttpRequest, textStatus, errorThrown) {
					// todo
					console.log("yyyhyyyy")
					obj.wordsWarn.data('loadMore','false');
					obj.wordsWarn.data('loading','false');

					// iscoll插件刷新
					var height = obj.plugin.scroller.offsetHeight;
					obj.plugin.refresh( height - 60);

					// 提示
					obj.showCheckMessage($('.u-note'),'errorThrown!',false);
				}
			})
		},

		windowStart : function(){
			//禁止ios的浏览器容器弹性
			$(window).off('scroll.elasticity touchmove.elasticity');
		},

		windowStop : function(){
			//禁止ios的浏览器容器弹性
			$(window).on('scroll.elasticity', function (e) {
				e.preventDefault();
			}).on('touchmove.elasticity', function (e) {
				e.preventDefault();
			});
		}
	})

	var wordsEnter = new words();

	//对外提供接口
	module.exports = wordsEnter;
});