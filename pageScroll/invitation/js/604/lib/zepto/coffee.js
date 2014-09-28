define(function(require, exports, module) {
    var Zepto = require("./zepto");
    module.exports = Zepto, function($, undefined) {
        function dasherize(str) {
            return str.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
        }
        function normalizeEvent(name) {
            return eventPrefix ? eventPrefix + name : name.toLowerCase()
        }
        var eventPrefix, transform, transitionProperty, transitionDuration, transitionTiming, transitionDelay, animationName, animationDuration, animationTiming, animationDelay, prefix = "", vendors = {Webkit: "webkit",Moz: "",O: "o"}, document = window.document, testEl = document.createElement("div"), supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, cssReset = {};
        $.each(vendors, function(vendor, event) {
            return testEl.style[vendor + "TransitionProperty"] !== undefined ? (prefix = "-" + vendor.toLowerCase() + "-", eventPrefix = event, !1) : void 0
        }), transform = prefix + "transform", cssReset[transitionProperty = prefix + "transition-property"] = cssReset[transitionDuration = prefix + "transition-duration"] = cssReset[transitionDelay = prefix + "transition-delay"] = cssReset[transitionTiming = prefix + "transition-timing-function"] = cssReset[animationName = prefix + "animation-name"] = cssReset[animationDuration = prefix + "animation-duration"] = cssReset[animationDelay = prefix + "animation-delay"] = cssReset[animationTiming = prefix + "animation-timing-function"] = "", $.fx = {off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,speeds: {_default: 400,fast: 200,slow: 600},cssPrefix: prefix,transitionEnd: normalizeEvent("TransitionEnd"),animationEnd: normalizeEvent("AnimationEnd")}, $.fn.animate = function(properties, duration, ease, callback, delay) {
            return $.isFunction(duration) && (callback = duration, ease = undefined, duration = undefined), $.isFunction(ease) && (callback = ease, ease = undefined), $.isPlainObject(duration) && (ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration), duration && (duration = ("number" == typeof duration ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1e3), delay && (delay = parseFloat(delay) / 1e3), this.anim(properties, duration, ease, callback, delay)
        }, $.fn.anim = function(properties, duration, ease, callback, delay) {
            var key, cssProperties, wrappedCallback, cssValues = {}, transforms = "", that = this, endEvent = $.fx.transitionEnd, fired = !1;
            if (duration === undefined && (duration = $.fx.speeds._default / 1e3), delay === undefined && (delay = 0), $.fx.off && (duration = 0), "string" == typeof properties)
                cssValues[animationName] = properties, cssValues[animationDuration] = duration + "s", cssValues[animationDelay] = delay + "s", cssValues[animationTiming] = ease || "linear", endEvent = $.fx.animationEnd;
            else {
                cssProperties = [];
                for (key in properties)
                    supportedTransforms.test(key) ? transforms += key + "(" + properties[key] + ") " : (cssValues[key] = properties[key], cssProperties.push(dasherize(key)));
                transforms && (cssValues[transform] = transforms, cssProperties.push(transform)), duration > 0 && "object" == typeof properties && (cssValues[transitionProperty] = cssProperties.join(", "), cssValues[transitionDuration] = duration + "s", cssValues[transitionDelay] = delay + "s", cssValues[transitionTiming] = ease || "linear")
            }
            return wrappedCallback = function(event) {
                if ("undefined" != typeof event) {
                    if (event.target !== event.currentTarget)
                        return;
                    $(event.target).unbind(endEvent, wrappedCallback)
                } else
                    $(this).unbind(endEvent, wrappedCallback);
                fired = !0, $(this).css(cssReset), callback && callback.call(this)
            }, duration > 0 && (this.bind(endEvent, wrappedCallback), setTimeout(function() {
                fired || wrappedCallback.call(that)
            }, 1e3 * duration + 25)), this.size() && this.get(0).clientLeft, this.css(cssValues), 0 >= duration && setTimeout(function() {
                that.each(function() {
                    wrappedCallback.call(this)
                })
            }, 0), this
        }, testEl = null
    }(Zepto), function($) {
        $.fn.coffee = function(option) {
            function steam() {
                var fontSize = rand(8, opts.steamMaxSize), steamsFontFamily = randoms(1, opts.steamsFontFamily), color = "#" + randoms(6, "0123456789ABCDEF"), position = rand(0, 44), rotate = rand(-90, 89), scale = rand02(.4, 1), transform = $.fx.cssPrefix + "transform";
                transform = transform + ":rotate(" + rotate + "deg) scale(" + scale + ");";
                var $fly = $('<span class="coffee-steam">' + randoms(1, opts.steams) + "</span>"), left = rand(0, coffeeSteamBoxWidth - opts.steamWidth - fontSize);
                left > position && (left = rand(0, position)), $fly.css({position: "absolute",left: position,top: opts.steamHeight,"font-size:": fontSize + "px",color: color,"font-family": steamsFontFamily,display: "block",opacity: 1}).attr("style", $fly.attr("style") + transform).appendTo($coffeeSteamBox).animate({top: rand(opts.steamHeight / 2, 0),left: left,opacity: 0}, rand(opts.steamFlyTime / 2, 1.2 * opts.steamFlyTime), __flyFastSlow, function() {
                    $fly.remove(), $fly = null
                })
            }
            function wind() {
                var left = rand(-10, 10);
                left += parseInt($coffeeSteamBox.css("left")), left >= 54 ? left = 54 : 34 >= left && (left = 34), $coffeeSteamBox.animate({left: left}, rand(1e3, 3e3), __flyFastSlow)
            }
            function randoms(length, chars) {
                length = length || 1;
                var hash = "", maxNum = chars.length - 1, num = 0;
                for (i = 0; length > i; i++)
                    num = rand(0, maxNum - 1), hash += chars.slice(num, num + 1);
                return hash
            }
            function rand(mi, ma) {
                var range = ma - mi, out = mi + Math.round(Math.random() * range);
                return parseInt(out)
            }
            function rand02(mi, ma) {
                var range = ma - mi, out = mi + Math.random() * range;
                return parseFloat(out)
            }
            var __time_val = null, __time_wind = null, __flyFastSlow = "cubic-bezier(.09,.64,.16,.94)", $coffee = $(this), opts = $.extend({}, $.fn.coffee.defaults, option), coffeeSteamBoxWidth = opts.steamWidth, $coffeeSteamBox = $('<div class="coffee-steam-box"></div>').css({height: opts.steamHeight,width: opts.steamWidth,left: 60,top: -50,position: "absolute",overflow: "hidden","z-index": 0}).appendTo($coffee);
            return $.fn.coffee.stop = function() {
                clearInterval(__time_val), clearInterval(__time_wind)
            }, $.fn.coffee.start = function() {
                __time_val = setInterval(function() {
                    steam()
                }, rand(opts.steamInterval / 2, 2 * opts.steamInterval)), __time_wind = setInterval(function() {
                    wind()
                }, rand(100, 1e3) + rand(1e3, 3e3))
            }, $coffee
        }, $.fn.coffee.defaults = {steams: ["jQuery", "HTML5", "HTML6", "CSS2", "CSS3", "JS", "$.fn()", "char", "short", "if", "float", "else", "type", "case", "function", "travel", "return", "array()", "empty()", "eval", "C++", "JAVA", "PHP", "JSP", ".NET", "while", "this", "$.find();", "float", "$.ajax()", "addClass", "width", "height", "Click", "each", "animate", "cookie", "bug", "Design", "Julying", "$(this)", "i++", "Chrome", "Firefox", "Firebug", "IE6", "Guitar", "Music", "攻城师", "旅行", "王子墨", "啤酒"],steamsFontFamily: ["Verdana", "Geneva", "Comic Sans MS", "MS Serif", "Lucida Sans Unicode", "Times New Roman", "Trebuchet MS", "Arial", "Courier New", "Georgia"],steamFlyTime: 5e3,steamInterval: 500,steamMaxSize: 30,steamHeight: 200,steamWidth: 300}, $.fn.coffee.version = "2.0.0"
    }(Zepto)
});
