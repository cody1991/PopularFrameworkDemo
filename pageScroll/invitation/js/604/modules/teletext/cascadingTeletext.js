define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/touch"), $ = require("lib/zepto/data");
    !function() {
        var CascadingTeletext = function($item) {
            var theClass = this;
            this.$target = $item.addClass("m-cascadingTeletext"), this.$_currentItem = this.$target.find("li").first().addClass("z-current"), $(window).on("resize", function() {
                theClass.$target.height(window.innerHeight)
            }).trigger("resize"), this.$target.find(".imgText").each(function(i, item) {
                0 == $.trim(item.innerText).length && $(item).remove()
            }), this.$target.on($.isPC ? "click" : "swipeLeft swipeRight", function(e) {
                theClass.$_currentItem.addClass("swipeLeft" == e.type ? "z-hideToLeft" : "z-hideToRight")
            }).delegate("li", "webkitAnimationEnd", function() {
                theClass.$target.append(theClass.$_currentItem), theClass.$_currentItem.removeClass("z-current z-hideToLeft z-hideToRight"), theClass.$_currentItem = theClass.$target.find("li").first().addClass("z-current")
            })
        };
        CascadingTeletext.show = function() {
            this.$target.addClass("z-show")
        }, $.fn.cascadingTeletext = function() {
            var command = "init";
            switch (arguments.length > 0 && "string" == typeof arguments[0] && (command = arguments[0]), command) {
                case "init":
                    this.each(function(i, item) {
                        var $item = $(item), pluginObj = new CascadingTeletext($item);
                        $item.data("plugin_cascadingTeletext", pluginObj)
                    });
                    break;
                case "getPluginObject":
                    return $item.data("plugin_cascadingTeletext")
            }
            return this
        }
    }(), module.exports = $
});
