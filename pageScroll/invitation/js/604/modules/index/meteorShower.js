define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/touch"), $ = require("lib/zepto/data");
    !function() {
        var MeteorShower = function($item, options) {
            this.$target = $item.addClass("m-meteorShower"), this.settings = $.extend({starCount: 30,meteorCount: 20}, options);
            for (var left, top, styleIndex, delay, duration, html = "", i = 0; i < this.settings.starCount; i++)
                left = (640 * Math.random()).toFixed(2), top = (600 * Math.random()).toFixed(2), delay = Math.random().toFixed(2), duration = (1 + 4 * Math.random()).toFixed(), styleIndex = Math.round(1 + 3 * Math.random()), html += '<i class="star style' + styleIndex + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: star " + duration + 's linear infinite;"></i>';
            for (var i = 0; i < this.settings.meteorCount; i++)
                left = (800 * Math.random() - 280).toFixed(2), top = (100 * Math.random() - 80).toFixed(2), delay = (.5 + 2.5 * Math.random()).toFixed(), duration = (1.2 + 2.8 * Math.random()).toFixed(), styleIndex = Math.round(1 + 3 * Math.random()), html += '<i class="meteor style' + styleIndex + '" style="left:' + left + "px; top:" + top + "px; -webkit-animation-delay:" + delay + "s; -webkit-animation: meteor " + duration + 's linear infinite;"></i>';
            this.$target.append(html)
        };
        $.fn.meteorShower = function() {
            var command = "init";
            switch (arguments.length > 0 && "string" == typeof arguments[0] && (command = arguments[0]), command) {
                case "init":
                    this.each(function(i, item) {
                        var $item = $(item), pluginObj = new MeteorShower($item);
                        $item.data("plugin_meteorShower", pluginObj)
                    });
                    break;
                case "getPluginObject":
                    return $item.data("plugin_meteorShower")
            }
            return this
        }
    }(), module.exports = $
});
