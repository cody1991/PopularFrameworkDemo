define(function(require, exports, module) {
    var Zepto = require("lib/zepto/zepto");
    module.exports = Zepto, function($) {
        $.fn.wx = function(option) {
            function CallWeiXinAPI(fn, count) {
                var total = 2e3;
                count = count || 0, !0 === window.G_WEIXIN_READY || "WeixinJSBridge" in window ? fn.apply(null, []) : total >= count && setTimeout(function() {
                    CallWeiXinAPI(fn, count++)
                }, 15)
            }
            var $wx = $(this), opts = $.extend({}, $.fn.wx.defaults, option);
            document.addEventListener("WeixinJSBridgeReady", function() {
                window.G_WEIXIN_READY = !0
            }, !1);
            {
                var _unit = {execHandler: function(handler) {
                        if (handler && handler instanceof Object) {
                            var callback = handler.callback || null, args = handler.args || [], context = handler.context || null, delay = handler.delay || -1;
                            callback && callback instanceof Function && ("number" == typeof delay && delay >= 0 ? setTimeout(function() {
                                callback.apply(context, args)
                            }, delay) : callback.apply(context, args))
                        }
                    },execAfterMergerHandler: function(handler, _args) {
                        if (handler && handler instanceof Object) {
                            var args = handler.args || [];
                            handler.args = _args.concat(args)
                        }
                        this.execHandler(handler)
                    }}, _api = {Share: {weibo: function(options, handler) {
                            CallWeiXinAPI(function() {
                                WeixinJSBridge.on("menu:share:weibo", function() {
                                    WeixinJSBridge.invoke("shareWeibo", options, function(res) {
                                        -1 == res.err_msg.indexOf("cancel") && _unit.execAfterMergerHandler(handler, [res])
                                    })
                                })
                            })
                        },timeline: function(options, handler) {
                            CallWeiXinAPI(function() {
                                WeixinJSBridge.on("menu:share:timeline", function() {
                                    WeixinJSBridge.invoke("shareTimeline", options, function(res) {
                                        -1 == res.err_msg.indexOf("cancel") && _unit.execAfterMergerHandler(handler, [res])
                                    })
                                })
                            })
                        },message: function(options, handler) {
                            CallWeiXinAPI(function() {
                                WeixinJSBridge.on("menu:share:appmessage", function() {
                                    WeixinJSBridge.invoke("sendAppMessage", options, function(res) {
                                        -1 == res.err_msg.indexOf("cancel") && _unit.execAfterMergerHandler(handler, [res])
                                    })
                                })
                            })
                        }},setToolbar: function(visible, handler) {
                        CallWeiXinAPI(function() {
                            WeixinJSBridge.call(!0 === visible ? "showToolbar" : "hideToolbar"), _unit.execAfterMergerHandler(handler, [visible])
                        })
                    },setOptionMenu: function(visible, handler) {
                        CallWeiXinAPI(function() {
                            WeixinJSBridge.call(!0 === visible ? "showOptionMenu" : "hideOptionMenu"), _unit.execAfterMergerHandler(handler, [visible])
                        })
                    },pay: function(data, handlerMap) {
                        CallWeiXinAPI(function() {
                            var requireData = {appId: "",timeStamp: "",nonceStr: "","package": "",signType: "",paySign: ""}, map = handlerMap || {}, handler = null, args = [data];
                            for (var key in requireData)
                                requireData.hasOwnProperty(key) && (requireData[key] = data[key] || "", console.info(key + " = " + requireData[key]));
                            WeixinJSBridge.invoke("getBrandWCPayRequest", requireData, function(response) {
                                var key = "get_brand_wcpay_request:";
                                switch (response.err_msg) {
                                    case key + "ok":
                                        handler = map.success;
                                        break;
                                    case key + "fail":
                                        handler = map.fail || map.error;
                                        break;
                                    case key + "cancel":
                                        handler = map.cancel || map.error;
                                        break;
                                    default:
                                        handler = map.error
                                }
                                _unit.execAfterMergerHandler(handler, args)
                            })
                        })
                    }}, opt1 = {content: opts.con}, opt2 = {img_url: opts.img,img_width: 180,img_height: 180,link: opts.link,desc: opts.con,title: opts.title};
                $.extend({appid: "wx21f7e6a981efd178"}, opt2)
            }
            return _api.Share.timeline(opt2, opts.handler), _api.Share.message(opt2, opts.handler), _api.Share.weibo(opt1, opts.handler), $wx
        }, $.fn.wx.defaults = {title: "云来轻APP",con: "云来轻APP",link: document.URL,img: location.protocol + "//" + location.hostname + ":" + location.port + "/template/19/img/wx_img_01@2x.jpg"}, $.fn.wx.version = "1.0.0"
    }(Zepto)
});
