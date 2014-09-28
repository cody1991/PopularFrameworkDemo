define(function(require, exports, module) {
    var $ = require('lib/zepto/zepto'), $ = require('units/maskLayer');
    var app = require('modules/app/main');
    var IScroll = require('lib/iscroll/iscroll');
    var $formPages = $('.page-form');
    module.exports = {init: function() {
            $formPages.each(function(i, item) {
                console.log('form init');
                $page = $(item);
                var $contactFormBox = $page.find('.m-contactForm');
                if ($contactFormBox.length) {
                    var $formContact = $contactFormBox.find('#formContact'), $btnSubmit = $formContact.find('.btn-submit');
                    var $contactFormLayer = $page.find('.m-contactFormLayer').maskLayer(), $successTipLayer = $contactFormBox.find('.successTipLayer').maskLayer({closeButton: false});
                    var contactFormLayer = $contactFormLayer.maskLayer('getPluginObject'), successTipLayer = $successTipLayer.maskLayer('getPluginObject');
                    contactFormLayer.on('show', function() {
                        app.disableFlipPage()
                    });
                    contactFormLayer.on('hide', function() {
                        app.enableFlipPage();
                        $formContact[0].reset();
                        $btnSubmit.prop('disabled', false)
                    });
                    $page.delegate('.m-contactUs a', $.isPC ? 'click' : 'tap', function(e) {
                        contactFormLayer.show();
                        if (!window.form_contactFormLayer_iScrollFloag) {
                            window.form_contactFormLayer_iScrollFloag = true;
                            $(window).on('resize', function() {
                                $contactFormBox.css('margin-top', 120);
                                setTimeout(function() {
                                    $contactFormBox.css('margin-top', 0);
                                    $contactFormBox.parent().css('margin-top', 120)
                                }, 100);
                                if (window.navigator.userAgent.indexOf('iPhone') >= 0) {
                                    $contactFormLayer.css('height', window.innerHeight)
                                }
                            }).resize();
                            new IScroll($contactFormLayer[0])
                        }
                    });
                    function showValidateTip($input, msg) {
                        var type = $('[name="name"]').prop('type');
                        if (type != 'radio' && type != 'checkbox') {
                            $input.data('value', $input.val()).val(msg).addClass('z-error');
                            $input.blur()
                        }
                        $btnSubmit.val('请填写完整').prop('disabled', true);
                        return false
                    }
                    $formContact.delegate('input.z-error', 'focus', function(e) {
                        var $input = $(this);
                        $input.val($input.data('value')).removeClass('z-error');
                        $btnSubmit.prop('disabled', false)
                    }).delegate('.btn-submit', $.isPC ? 'click' : 'tap', function(e) {
                        if (!$btnSubmit.prop('disabled')) {
                            $formContact.submit()
                        }
                    });
                    $formContact.on('submit', function(e) {
                        e.preventDefault();
                        var $name = $formContact.find('input[name="name"]'), $sex = $formContact.find('input[name="sex"]'), $tel = $formContact.find('input[name="tel"]'), $company = $formContact.find('input[name="company"]'), $post = $formContact.find('input[name="post"]'), $email = $formContact.find('input[name="email"]');
                        if ($name.length && $.trim($name.val()).length == 0) {
                            return showValidateTip($name, '请输入姓名！')
                        }
                        if ($tel.length && $.trim($tel.val()).length == 0) {
                            return showValidateTip($tel, '请输入电话！')
                        }
                        if ($tel.length > 0 && $.trim($tel.val()).length > 0) {
                            var reg = /^13[0-9]{9}|15[0-9]{9}|17[0-9]{9}|18[0-9]{9}$/;
                            if (!$.trim($tel.val()).match(reg)) {
                                return showValidateTip($tel, '电话号码输入不正确！')
                            }
                        }
                        if ($email.length && $.trim($email.val()).length == 0) {
                            return showValidateTip($email, '请输入邮箱！')
                        }
                        if ($email.length > 0 && $.trim($email.val()).length > 0) {
                            var reg = /(^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$)/i;
                            if (!$.trim($email.val()).match(reg)) {
                                return showValidateTip($email, '邮箱格式不正确！')
                            }
                        }
                        if ($company.length && $.trim($company.val()).length == 0) {
                            return showValidateTip($company, '请输入公司名称！')
                        }
                        if ($post.length && $.trim($post.val()).length == 0) {
                            return showValidateTip($post, '请输入职务！')
                        }
                        $.ajax({url: $formContact.attr('action'),type: $formContact.attr('method'),data: $formContact.serialize(),dataType: 'json',success: function(data) {
                                successTipLayer.show();
                                setTimeout(function() {
                                    successTipLayer.hide();
                                    setTimeout(function() {
                                        contactFormLayer.hide();
                                        $formContact[0].reset()
                                    }, 800)
                                }, 3000)
                            },error: function(e) {
                                alert($("input[data-fail-msg]").val())
                            }})
                    })
                }
                $page.on('active', function(e) {
                    console.log('form active')
                }).on('current', function(e) {
                    console.log('form current')
                })
            })
        }}
});
