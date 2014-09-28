define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("units/yunlaiMap"), app = require("modules/app/main"), $mapPages = $(".page-map");
    module.exports = {init: function() {
            $mapPages.each(function(i, item) {
                console.log("map init"), $page = $(item);
                var $map = $page.find(".u-yunlaiMap"), map = $map.yunlaiMap().yunlaiMap("getPluginObject");
                map.on("show", function() {
                    app.disableFlipPage()
                }), map.on("hide", function() {
                    app.enableFlipPage()
                }), $page.find(".m-distributedPoints").delegate("a", $.isPC ? "click" : "tap", function(e) {
                    var $this = $(this);
                    try {
                        map.show(), map.clearOverlays();
                        var markers = $this.data("map-markers");
                        if (markers)
                            for (var markersArr = eval(markers), i = 0; i < markersArr.length; i++) {
                                var marker = markersArr[i];
                                marker.title = marker.name, marker.content = '电话：<a href="tel:' + marker.tel + '">' + marker.tel + "</a><br/>" + marker.desc + "<br/>地址：" + marker.addr, delete marker.name, delete marker.tel, delete marker.addr, delete marker.desc, marker.content = marker.content.replace(/(\<br\s*\/\>\s*)+/gi, "<br/>"), map.addMarker(marker)
                            }
                    } catch (e) {
                        console.log(e)
                    }
                });
                var distributedPointsInitFlag = !0;
                $page.on("active", function() {
                    console.log("map active");
                    var $page = $(this);
                    distributedPointsInitFlag && (distributedPointsInitFlag = !1, $page.find(".m-distributedPoints li").each(function(i, item) {
                        item.style.top = item.offsetTop - item.offsetHeight + 6 + "px", item.style.left = item.offsetLeft - item.offsetWidth / 2 + "px", $(item).find("a").css("left", item.offsetWidth / 2 - 31.5)
                    }))
                }).on("current", function() {
                    console.log("map current")
                })
            })
        }}
});
