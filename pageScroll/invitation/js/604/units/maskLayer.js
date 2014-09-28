define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/selector"), $ = require("lib/zepto/touch"), $ = require("lib/zepto/data");
    !function() {
        var MaskLayer = function($item, options) {
            var theClass = this;
            if (this._$maskLayer = $item.addClass("u-maskLayer"), this.state = this._$maskLayer.is(".z-show") ? "show" : "hide", this.settings = $.extend({clickHideMode: 1,closeButton: !0,onShow: function() {
                },onHide: function() {
                }}, options), this._events = {show: [],hide: []}, this._events.show.push(this.settings.onShow), this._events.hide.push(this.settings.onHide), this.settings.closeButton) {
                var $closeButton = $('<a href="javascript:void(0);" class="u-maskLayer-close"></a>');
                theClass._$maskLayer.append($closeButton), $closeButton.on($.isPC ? "click" : "tap", function(e) {
                    e.preventDefault(), theClass.hide()
                })
            }
            "show" == this.state ? theClass.show("_init") : theClass.hide("_init"), this.settings.clickHideMode && (theClass._$maskLayer.on($.isPC ? "click" : "tap", function() {
                theClass.hide()
            }), 1 == theClass.settings.clickHideMode && theClass._$maskLayer.children().on($.isPC ? "click" : "tap", function(e) {
                e.stopPropagation()
            }))
        };
        MaskLayer.prototype.on = function(eventName, fn) {
            this._events[eventName] && fn && this._events[eventName].push(fn)
        }, MaskLayer.prototype.trigger = function(eventName) {
            if (this._events[eventName])
                for (var callbacks = this._events[eventName], i = 0; i < callbacks.length; i++)
                    callbacks[i]()
        }, MaskLayer.prototype.show = function() {
            var theClass = this;
            "_init" == arguments[0] ? this._$maskLayer.addClass("z-show").show() : (this._$maskLayer.show().removeClass("z-hide").addClass("z-showing"), setTimeout(function() {
                theClass._$maskLayer.addClass("z-show").removeClass("z-showing"), theClass.state = "show", theClass.trigger("show")
            }, 500))
        }, MaskLayer.prototype.hide = function() {
            var theClass = this;
            "_init" == arguments[0] ? this._$maskLayer.addClass("z-hide").hide() : (this._$maskLayer.removeClass("z-show").addClass("z-hideing"), setTimeout(function() {
                theClass._$maskLayer.addClass("z-hide").removeClass("z-hideing").hide(), theClass.state = "hide", theClass.trigger("hide")
            }, 500))
        }, $.fn.maskLayer = function(options) {
            var command = "init";
            switch (arguments.length > 0 && "string" == typeof arguments[0] && (command = arguments[0]), command) {
                case "init":
                    this.each(function(i, item) {
                        var $item = $(item), pluginObj = new MaskLayer($item, options);
                        $item.data("plugin_maskLayer", pluginObj)
                    });
                    break;
                case "getPluginObject":
                    return this.data("plugin_maskLayer");
                default:
                    var pluginObj = this.data("plugin_maskLayer"), method = pluginObj[command];
                    if (method) {
                        var parameters = [];
                        arguments.length > 1 && (parameters = arguments[1]), method.apply(pluginObj, parameters)
                    }
            }
            return this
        }
    }(), module.exports = $
});
