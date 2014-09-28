define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/selector"), $ = require("units/maskLayer"), app = require("modules/app/main"), $linkPages = $(".page-link");
    module.exports = {init: function() {
            $linkPages.each(function(i, item) {
                console.log("link init"), $page = $(item);
                var $shareLink = $page.find('[href="weixin:share"]');
                if ($shareLink.length) {
                    var $weixinShareLayer = $page.find(".u-maskLayer");
                    $page.find(".page-content").append($weixinShareLayer), $weixinShareLayer.maskLayer({clickHideMode: 2,onShow: function() {
                            app.disableFlipPage()
                        },onHide: function() {
                            app.enableFlipPage()
                        }}), $shareLink.on($.isPC ? "click" : "tap", function() {
                        $weixinShareLayer.maskLayer("show")
                    })
                }
                $page.on("active", function() {
                    console.log("link active")
                }).on("current", function() {
                    console.log("link current")
                })
            })
        }}
});
