define(function(require, exports, module) {
    var Zepto = require("./zepto");
    module.exports = Zepto, function($) {
        function swipeDirection(x1, x2, y1, y2) {
            return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? "Left" : "Right" : y1 - y2 > 0 ? "Up" : "Down"
        }
        function longTap() {
            longTapTimeout = null, touch.last && (touch.el.trigger("longTap"), touch = {})
        }
        function cancelLongTap() {
            longTapTimeout && clearTimeout(longTapTimeout), longTapTimeout = null
        }
        function cancelAll() {
            touchTimeout && clearTimeout(touchTimeout), tapTimeout && clearTimeout(tapTimeout), swipeTimeout && clearTimeout(swipeTimeout), longTapTimeout && clearTimeout(longTapTimeout), touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null, touch = {}
        }
        function isPrimaryTouch(event) {
            return ("touch" == event.pointerType || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
        }
        function isPointerEventType(e, type) {
            return e.type == "pointer" + type || e.type.toLowerCase() == "mspointer" + type
        }
        var touchTimeout, tapTimeout, swipeTimeout, longTapTimeout, gesture, touch = {}, longTapDelay = 750;
        $(document).ready(function() {
            var now, delta, firstTouch, _isPointerType, deltaX = 0, deltaY = 0;
            "MSGesture" in window && (gesture = new MSGesture, gesture.target = document.body), $(document).bind("MSGestureEnd", function(e) {
                var swipeDirectionFromVelocity = e.velocityX > 1 ? "Right" : e.velocityX < -1 ? "Left" : e.velocityY > 1 ? "Down" : e.velocityY < -1 ? "Up" : null;
                swipeDirectionFromVelocity && (touch.el.trigger("swipe"), touch.el.trigger("swipe" + swipeDirectionFromVelocity))
            }).on("touchstart MSPointerDown pointerdown", function(e) {
                (!(_isPointerType = isPointerEventType(e, "down")) || isPrimaryTouch(e)) && (firstTouch = _isPointerType ? e : e.touches[0], e.touches && 1 === e.touches.length && touch.x2 && (touch.x2 = void 0, touch.y2 = void 0), now = Date.now(), delta = now - (touch.last || now), touch.el = $("tagName" in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode), touchTimeout && clearTimeout(touchTimeout), touch.x1 = firstTouch.pageX, touch.y1 = firstTouch.pageY, delta > 0 && 250 >= delta && (touch.isDoubleTap = !0), touch.last = now, longTapTimeout = setTimeout(longTap, longTapDelay), gesture && _isPointerType && gesture.addPointer(e.pointerId))
            }).on("touchmove MSPointerMove pointermove", function(e) {
                (!(_isPointerType = isPointerEventType(e, "move")) || isPrimaryTouch(e)) && (firstTouch = _isPointerType ? e : e.touches[0], cancelLongTap(), touch.x2 = firstTouch.pageX, touch.y2 = firstTouch.pageY, deltaX += Math.abs(touch.x1 - touch.x2), deltaY += Math.abs(touch.y1 - touch.y2))
            }).on("touchend MSPointerUp pointerup", function(e) {
                (!(_isPointerType = isPointerEventType(e, "up")) || isPrimaryTouch(e)) && (cancelLongTap(), touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30 ? swipeTimeout = setTimeout(function() {
                    touch.el.trigger("swipe"), touch.el.trigger("swipe" + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)), touch = {}
                }, 0) : "last" in touch && (30 > deltaX && 30 > deltaY ? tapTimeout = setTimeout(function() {
                    var event = $.Event("tap");
                    event.cancelTouch = cancelAll, touch.el.trigger(event), touch.isDoubleTap ? (touch.el && touch.el.trigger("doubleTap"), touch = {}) : touchTimeout = setTimeout(function() {
                        touchTimeout = null, touch.el && touch.el.trigger("singleTap"), touch = {}
                    }, 250)
                }, 0) : touch = {}), deltaX = deltaY = 0)
            }).on("touchcancel MSPointerCancel pointercancel", cancelAll), $(window).on("scroll", cancelAll)
        }), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function(eventName) {
            $.fn[eventName] = function(callback) {
                return this.on(eventName, callback)
            }
        })
    }(Zepto)
});
