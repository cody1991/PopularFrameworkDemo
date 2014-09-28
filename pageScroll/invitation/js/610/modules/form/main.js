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
	var $ = require('lib/zepto/zepto'),				//Zepto模块
		$ = require('units/maskLayer');				//弹出层模块
	var app = require('modules/app/main');			//App模块

	//获取页面模块jQuery对象
	var $formPages = $('.page-form');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化联系我们模块
			$formPages.each(function (i, item) {
				console.log('form init');
				//获取当前page页
				$page = $(item);

				//获取相关对象
				var $contactFormBox = $page.find('.m-contactForm');
				//判断是否存在
				if($contactFormBox.length){
					var $formContact = $contactFormBox.find('#formContact'),
						$btnSubmit = $formContact.find('.btn-submit');
					//应用遮罩层插件
					var $contactFormLayer = $page.find('.m-contactFormLayer').maskLayer(),
						$successTipLayer = $contactFormBox.find('.successTipLayer').maskLayer({closeButton: false});
					var contactFormLayer = $contactFormLayer.maskLayer('getPluginObject'),
						successTipLayer = $successTipLayer.maskLayer('getPluginObject');

					//注册显示事件
					contactFormLayer.on('show', function () {
						//禁止app翻页
						app.disableFlipPage();

						$(window).off('scroll.elasticity touchmove.elasticity');
					});
					contactFormLayer.on('hide', function () {
						//启用app翻页
						app.enableFlipPage();
						//清除表单数据
						$formContact[0].reset();
						$btnSubmit.prop('disabled', false);

						//禁止ios的浏览器容器弹性
						$(window).on('scroll.elasticity', function (e) {
							e.preventDefault();
						}).on('touchmove.elasticity', function (e) {
							e.preventDefault();
						});
					});
					
					//点击联系我们时显示遮表单罩层
					$page.delegate('.m-contactUs a', $.isPC ? 'click' : 'click', function (e) {
						contactFormLayer.show();
					});
						
					//显示验证提示的方法
					function showValidateTip($input , msg) {
						var type =$('[name="name"]').prop('type');
						if(type != 'radio' && type != 'checkbox'){
							$input.data('value', $input.val()).val(msg).addClass('z-error');
							$input.blur();
						}
						$btnSubmit.val('请填写完整').prop('disabled', true);
						return false;
					}

					//注册验证和点击提交事件
					$formContact.delegate('input.z-error', 'focus', function (e) {
						var $input = $(this);
						$input.val($input.data('value')).removeClass('z-error');
						$btnSubmit.prop('disabled', false);
					}).delegate('.btn-submit', $.isPC ? 'click' : 'tap', function (e) {
						if(!$btnSubmit.prop('disabled')){
							$formContact.find('input').blur();
							$formContact.submit();
						}
					});

					//注册表单提交事件
					$formContact.on('submit', function (e) {
						e.preventDefault();
						//获取可能有的字段input
						var $name = $formContact.find('input[name="name"]'),		//姓名
							$sex = $formContact.find('input[name="sex"]'),			//性别
							$tel = $formContact.find('input[name="tel"]'),			//电话
							$company = $formContact.find('input[name="company"]'),	//公司
							$post = $formContact.find('input[name="post"]'),		//职务
							$email = $formContact.find('input[name="email"]');		//邮箱

						//如果有这些字段，则进行验证
						if($name.length && $.trim($name.val()).length == 0){
							return showValidateTip($name, '请输入姓名！');
						}
						if($tel.length && $.trim($tel.val()).length == 0){
							return showValidateTip($tel, '请输入电话！');
						}
						if($tel.length>0 && $.trim($tel.val()).length > 0){
							var reg = /^13[0-9]{9}|15[0-9]{9}|17[0-9]{9}|18[0-9]{9}$/;
							if(!$.trim($tel.val()).match(reg)){
								return showValidateTip($tel, '电话号码输入不正确！');
							}
						}
						if($email.length && $.trim($email.val()).length == 0){
							return showValidateTip($email, '请输入邮箱！');
						}
						if($email.length>0 && $.trim($email.val()).length > 0){
							var reg = /(^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$)/i;
							if(!$.trim($email.val()).match(reg)){
								return showValidateTip($email, '邮箱格式不正确！');
							}
						}
						if($company.length && $.trim($company.val()).length == 0){
							return showValidateTip($company, '请输入公司名称！');
						}
						if($post.length && $.trim($post.val()).length == 0){
							return showValidateTip($post, '请输入职务！');
						}
						//Ajax提交表单
						$.ajax({
							url : $formContact.attr('action'),
							type : $formContact.attr('method'),
							data : $formContact.serialize(),
							dataType : 'json',
							success : function (data) {
								//显示提示并定时2s隐藏
								successTipLayer.show();
								setTimeout(function () {
									successTipLayer.hide();
									setTimeout(function () {
										contactFormLayer.hide();
										//清除输入的数据
										$formContact[0].reset();
									}, 800);
								}, 2000);
							},
							error : function (e) {
								alert($("input[data-fail-msg]").val());
							}
						});
					});
				}

				//注册激活时的事件
				$page.on('active', function (e) {
					console.log('form active');
				}).on('current', function (e) {
					console.log('form current');
				});
			});
		}
	}
});