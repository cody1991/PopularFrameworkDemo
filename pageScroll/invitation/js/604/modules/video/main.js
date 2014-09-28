define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/touch"), $ = require("units/maskLayer"), $ = require("./youkuVideo"), app = require("modules/app/main"), globalAudio = require("units/globalAudio"), $videoPages = $(".page-video");
    module.exports = {init: function() {
            $videoPages.each(function(i, item) {
                console.log("video init");
                var youkuVideo, $page = $(item), $btnPlay = $page.find(".m-btnPlay"), $youkuVideo = $page.find(".m-youkuVideo"), playState = "playing", youkuVideoLayer = $page.find(".m-youkuVideoLayer").maskLayer({onShow: function() {
                        $btnPlay.hide(), app.disableFlipPage(), playState = globalAudio.playState, globalAudio.pause(), globalAudio.isAllowManually = !1, youkuVideo = $youkuVideo.youkuVideo().youkuVideo("getPluginObject")
                    },onHide: function() {
                        $btnPlay.show(), app.enableFlipPage(), "playing" == playState && globalAudio.play(), globalAudio.isAllowManually = !0, youkuVideo.destroy()
                    }}).maskLayer("getPluginObject");
                $btnPlay.on($.isPC ? "click" : "tap", function() {
                    youkuVideoLayer.show()
                }), $page.on("active", function() {
                    console.log("video active")
                }).on("current", function() {
                    console.log("video current")
                })
            })
        }}
});
