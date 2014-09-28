define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/touch"), objectUtil = require("system/util/objectUtil"), LightAppAd = function() {
        this.$lightAppAd, this._init()
    };
    LightAppAd.prototype._init = function() {
        var theClass = this;
        if ($(".m-lightAppAd").length <= 0) {
            theClass.$lightAppAd = $('<div class="m-lightAppAd"><a href="javascript:void(0);" class="m-lightAppAd-link-guide"></a><div class="m-lightAppAd-body"><div class="m-lightAppAd-title"></div><a href="http://mp.weixin.qq.com/s?__biz=MjM5NTI3Mzk0MA==&mid=200206728&idx=1&sn=8edd0353287f322d1279e0d4eb581c2d#rd" class="m-lightAppAd-link-get"></a><a href="tel:4000168906" class="m-lightAppAd-link-tel"></a></div></div>'), $(".page:last").find(".page-content").append(theClass.$lightAppAd);
            var $linkGuide = theClass.$lightAppAd.find(".m-lightAppAd-link-guide"), $lightAppAdBody = theClass.$lightAppAd.find(".m-lightAppAd-body");
            $linkGuide.on($.isPC ? "click" : "tap", function(e) {
                if ($("body").attr("data-app-id") != "4740") {
                    theClass.$lightAppAd.addClass("z-showBody"), e.stopPropagation()
                }
            }), theClass.$lightAppAd.on($.isPC ? "click" : "tap", function() {
                theClass.$lightAppAd.removeClass("z-showBody")
            }), $lightAppAdBody.on($.isPC ? "click" : "tap", function(e) {
                e.stopPropagation()
            })
        }
    }, LightAppAd.prototype.remove = function() {
        this.$lightAppAd.remove()
    };
    var lightappAd, isShowAd = $("body").data("ad");
    lightappAd = void 0 == isShowAd || 1 == isShowAd || "true" == isShowAd ? new LightAppAd : objectUtil.createEmptyObject(LightAppAd), module.exports = lightappAd
});
