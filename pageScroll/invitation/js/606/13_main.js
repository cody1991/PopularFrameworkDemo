var slitslider;
//预加载图片
function load_img(obj){
	if($(obj).is("img")){
		$(obj).attr('src',$(obj).attr('data-src'));
	}else{
		$(obj).css({
			'background-image'	: 'url('+$(obj).attr('data-src')+')'
		});
	}
	$(obj).removeClass('lazy-img');
	$(obj).bind('touchstart', function(){
		if($(this).is("img")){
			$(this).attr('src',$(this).attr('data-src'));
		}else{
			$(this).css({
				'background-image'	: 'url('+$(this).attr('data-src')+')'
			});
		}
	});
}
jQuery(function(){
	var clientType = 0;
	var u = navigator.userAgent; // 客户端环境信息
	if( ! u.match(/AppleWebKit.*Mobile.*/i) && ! u.match(/Android.*/i) ){
		$('body').addClass('pc');
		clientType = 1;
	}
	
	$('.lazy-img').each(function(){
		load_img(this);
	});
	
	var leftScroll;
	var Page = (function() {
		var $navArrows = $( '#nav-arrows' ),$nav = $( '#nav-dots > span' );
			slitslider = $( '#slider' ).slitslider({
				onBeforeChange : function( slide, pos ) {
					$nav.removeClass( 'nav-dot-current' );
					$nav.eq( pos ).addClass( 'nav-dot-current' );
					if (!slide.next().hasClass('noSwipe')) {
						$navArrows.hide();
					}

					// 手指引导关闭
					$('#arrow-h').addClass('hide_');

					//表单输入框失去焦点
					$('input').blur();
				},
				onAfterChange : function(slide, pos) {
					if ($('.sl-slides-wrapper .sl-slide:visible').hasClass('slide-map')){
						$('.sl-slides-wrapper .sl-slide:visible').find('#map').triggerHandler("setCenter");
					}
					if ($('.sl-slides-wrapper .sl-slide:visible').hasClass('noSwipe')) {
						$navArrows.show();
					} else {
						$navArrows.hide();
					}
				}
				
			}),
			init = function() {

				initEvents();
				
				/* 第二张图片加载 */
				var node = $('.sl-slides-wrapper').find('.sl-slide').eq(1),
					img = node.find('.lazy-img');	
					img.each(function(){
						load_img(this);
					});
			},
			initEvents = function() {
				$('#slider').swipe({
					swipeLeft:function(event, direction, distance, duration, fingerCount) {
						if(distance>100){
							if($('#st-trigger-effects').data('status') === 1){
								menuHide();
							} else {
								slitslider.next();
							}
							return false;
						}
					},
					swipeRight:function(event, direction, distance, duration, fingerCount) {
						if(distance>100){
							if($('#st-trigger-effects').data('status') === 1){
								menuHide();
							} else {
								if ($('.sl-slides-wrapper .sl-slide:visible').attr('id') == 'realty-poster') {
									menuShow();
								} else {
									slitslider.previous();
								}
							}
							return false;
						}
					},
					tap:function(e){
						if($('#st-trigger-effects').attr('data-status') == 1){
							menuHide();
						} else {
							e = e||window.event;
							tar = e.target||e.srcElement;
							if ($(tar).hasClass('swipe-click') === true) {
								$(tar).triggerHandler("swipeclick");
							} else {
								$(tar).parents('.swipe-click').triggerHandler("swipeclick");
							}
						}
						return false;
					},
					excludedElements:"input, select, .noSwipe, .share-block, .nav-arrows",
					threshold:10,
					allowPageScroll:'auto',
					fingers:'all'
				});
				$navArrows.children( ':last' ).on( 'click', function(){
					slitslider.next();
					return false;
				});
				$navArrows.children( ':first' ).on( 'click', function(){
					slitslider.previous();
					return false;
				});
				$nav.each( function( i ){
					$( this ).on( 'click', function( event ){
						var $dot = $( this );
						if( !slitslider.isActive() ){
							$nav.removeClass( 'nav-dot-current' );
							$dot.addClass( 'nav-dot-current' );
						}
						slitslider.jump( i + 1 );
						return false;
					});
				});
			};
			return { init : init };
	})();
	
	Page.init();

	$('.menu-switch').swipe({
		swipe:function(event, direction, distance, duration, fingerCount) {
			if($('#st-trigger-effects').data('status') === 0){
				menuShow();
			}else{
				menuHide();
			}
			event = event||window.event;
			tar = event.target||event.srcElement;
			return false;
		},
		threshold:0,
		allowPageScroll:'none',
		fingers:'all'
	});
	
	var _liHtml = '';
	var _imgWidth = ($(window).width()*0.8-4*5)/2;
	
	$('.nav-bg-thumb').each(function(){
		_liHtml += '<li><a href="javascript:void(0);"><img style="width:'+_imgWidth+'px;height:'+_imgWidth+'px;" src="'+$.trim($(this).val())+'" /></a></li>';
	});
	$('.img-nav-ul').html(_liHtml);
	$('.img-nav-ul li').each(function(i){
		$(this).find('a').on('click',function(e) {
			menuHide(false);
			slitslider.jump((i+1));
		});
	});
	
	$('#bigimg-box').swipe({
		tap:function(e){
			$(this).hide();
			setTimeout(function(){
				$('#st-container').css('pointer-events', 'auto');
			}, 500);
			return false;
		},
		allowPageScroll:'none',
		fingers:'all'
	});
	$('#close-dialog-btn').on('click', function(){
		dialogClose();
	});
	function menuShow(){
		$('.st-menu').show();
		$('#st-trigger-effects').data('status',1);
		$('.st-pusher').animate({left: "80%"}, 600, function(){
			$('.st-menu').css('pointer-events','auto');
		});
		if(leftScroll==null){
			leftScroll = new IScroll('#leftScorll', { scrollX: true, scrollY: true, momentum: true, mouseWheel: true });
		}
	}
	function menuHide(anim){
		$('.st-menu').css('pointer-events','none');
		$('#st-trigger-effects').data('status',0);
		if (anim === false) {
			$('.st-pusher').css('left','0%');
			$('.st-menu').hide();
		} else {
			$('.st-pusher').animate({left: "0%"}, 600, function(){
				$('.st-menu').hide();
			});
		}
		
	}
});

function dialogClose() {
	$('#dialog').css('pointer-events', 'none');
	$('#dialog').hide();
	$('#dialog-overlay').hide();
	$('#dialog').find('.modal-body').html('');
	$('#dialog').width(270);
}
function dialogShow(title,content) {
	var dialog = $('#dialog');
	if (title == '') {
		title = '温馨提示';
	}
	dialog.find('.title').html(title);
	dialog.find('.modal-body').html(content);
	dialog.width(document.documentElement.clientWidth * 0.9);
	var left = document.documentElement.clientWidth * 0.1 * 0.5;
	var top = ($(window).height() - dialog.height()) / 2;
	dialog.css({top:top,left:left});
	$('#dialog-overlay').height($(document).height());
	$('#dialog-overlay').show();
	dialog.show();
	setTimeout(function(){
		dialog.css('pointer-events', 'auto');
	}, 500);
	return;
}

// 所有文档加载完后才出现，引导手势最后加载
$(window).on('load',function(){$('#arrow-h').removeClass('hide_');})
