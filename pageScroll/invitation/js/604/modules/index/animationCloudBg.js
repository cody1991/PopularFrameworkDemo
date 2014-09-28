define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/data");
    !function() {
        var AnimationCloudBg = function($item) {
            this.$target = $item.addClass("m-animationCloudBg"), this.$target.height(window.innerHeight);
            for (var i = 1; 13 > i; i++) {
                var $cloudItem = $("<i></i>");
                $item.append($cloudItem)
            }
        };
        AnimationCloudBg.prototype.start = function() {
            this.$target.removeClass("z-stop")
        }, AnimationCloudBg.prototype.stop = function() {
            this.$target.addClass("z-stop")
        }, $.fn.animationCloudBg = function() {
            var command = "init";
            switch (arguments.length > 0 && "string" == typeof arguments[0] && (command = arguments[0]), command) {
                case "init":
                    this.each(function(i, item) {
                        var $item = $(item), pluginObj = new AnimationCloudBg($item);
                        $item.data("plugin_animationcloudbg", pluginObj)
                    });
                    break;
                case "getPluginObject":
                    return $item.data("plugin_animationcloudbg");
                case "start":
                    var pluginObj = this.data("plugin_animationcloudbg");
                    pluginObj.start();
                    break;
                case "stop":
                    return $item.data("plugin_animationcloudbg")
            }
            return this
        }
    }(), module.exports = $
});
