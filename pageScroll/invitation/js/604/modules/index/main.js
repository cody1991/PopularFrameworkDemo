define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("./animationCloudBg"), $ = require("./meteorShower"), $indexPages = $(".page-index");
    module.exports = {init: function() {
            var $app = $("body");
            $indexPages.each(function(i, item) {
                console.log("index init"), $page = $(item), function() {
                    var $animationBox = $page.find(".m-animationBox"), appBgClass = "appBg1";
                    $animationBox.is(".m-animationCloudBg") ? ($animationBox.animationCloudBg(), appBgClass = "appBg1") : $animationBox.is(".m-meteorShower") && ($animationBox.meteorShower({starCount: 30,meteorCount: 26}), appBgClass = "appBg2"), $(window).on("load", function() {
                        var appID = parseInt($app.data("app-id")), arr = [3468];
                        arr.indexOf(appID) >= 0 ? $app.css("background-image", "url(/template/22/data/images/bg/app_" + appID + ".jpg)") : $app.addClass(appBgClass)
                    })
                }(), $page.on("active", function() {
                    console.log("index active")
                }).on("current", function() {
                    console.log("index current")
                })
            })
        }}
});
