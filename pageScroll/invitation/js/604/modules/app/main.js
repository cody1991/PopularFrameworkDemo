define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/selector"), $ = require("units/weixin");
    require("units/lightAppAd");
    var App = (require("units/globalAudio"), require("./statistics"), function($item) {
        function jump() {
            var weixin_callback = $("input[data-weixin-callback]");
            weixin_callback.length > 0 && (window.location = weixin_callback.val())
        }
        console.log("app init"), this._$app = $item, this._$pages = this._$app.find(".page"), this.$currentPage = this._$pages.eq(0), this._isFirstShowPage = !0, this._isInitComplete = !1, this._isDisableFlipPage = !1, this._isDisableFlipPrevPage = !1, this._isDisableFlipNextPage = !1;
        var theClass = this, $win = $(window);
        !function() {
            $win.on("scroll.elasticity", function(e) {
                e.preventDefault()
            }).on("touchmove.elasticity", function(e) {
                e.preventDefault()
            }), $win.delegate("img", "mousemove", function(e) {
                e.preventDefault()
            })
        }(), $win.on("load", function() {
            var currentPage = null, activePage = null, triggerLoop = !1, startX = 0, startY = 0, moveDistanceX = 0, moveDistanceY = 0, isStart = !1, isNext = !1, isFirstTime = !0;
            theClass._$app.on("mousedown touchstart", function(e) {
                theClass._isDisableFlipPage || (currentPage = theClass._$pages.filter(".z-current").get(0), activePage = null, currentPage && (isStart = !0, isNext = !1, isFirstTime = !0, moveDistanceX = 0, moveDistanceY = 0, "mousedown" == e.type ? (startX = e.pageX, startY = e.pageY) : (startX = e.touches[0].pageX, startY = e.touches[0].pageY), currentPage.classList.add("z-move"), currentPage.style.webkitTransition = "none"))
            }).on("mousemove touchmove", function(e) {
                if (isStart && (activePage || isFirstTime) && ("mousemove" == e.type ? (moveDistanceX = e.pageX - startX, moveDistanceY = e.pageY - startY) : (moveDistanceX = e.touches[0].pageX - startX, moveDistanceY = e.touches[0].pageY - startY), Math.abs(moveDistanceY) > Math.abs(moveDistanceX)))
                    if (moveDistanceY > 0) {
                        if (theClass._isDisableFlipPrevPage)
                            return;
                        isNext || isFirstTime ? (isNext = !1, isFirstTime = !1, activePage && (activePage.classList.remove("z-active"), activePage.classList.remove("z-move")), activePage = currentPage.previousElementSibling && currentPage.previousElementSibling.classList.contains("page") ? currentPage.previousElementSibling : triggerLoop ? theClass._$pages.last().get(0) : !1, activePage && activePage.classList.contains("page") ? (activePage.classList.add("z-active"), activePage.classList.add("z-move"), activePage.style.webkitTransition = "none", activePage.style.webkitTransform = "translateY(-100%)", $(activePage).trigger("active"), currentPage.style.webkitTransformOrigin = "bottom center") : (currentPage.style.webkitTransform = "translateY(0px) scale(1)", activePage = null)) : (currentPage.style.webkitTransform = "scale(" + (window.innerHeight / (window.innerHeight + moveDistanceY)).toFixed(3) + ")", activePage.style.webkitTransform = "translateY(-" + (window.innerHeight - moveDistanceY) + "px)")
                    } else if (0 > moveDistanceY) {
                        if (theClass._isDisableFlipNextPage)
                            return;
                        !isNext || isFirstTime ? (isNext = !0, isFirstTime = !1, activePage && (activePage.classList.remove("z-active"), activePage.classList.remove("z-move")), currentPage.nextElementSibling && currentPage.nextElementSibling.classList.contains("page") ? activePage = currentPage.nextElementSibling : (activePage = theClass._$pages.first().get(0), triggerLoop = !0), activePage && activePage.classList.contains("page") ? (activePage.classList.add("z-active"), activePage.classList.add("z-move"), activePage.style.webkitTransition = "none", activePage.style.webkitTransform = "translateY(" + window.innerHeight + "px)", $(activePage).trigger("active"), currentPage.style.webkitTransformOrigin = "top center") : (currentPage.style.webkitTransform = "translateY(0px) scale(1)", activePage = null)) : (currentPage.style.webkitTransform = "scale(" + ((window.innerHeight + moveDistanceY) / window.innerHeight).toFixed(3) + ")", activePage.style.webkitTransform = "translateY(" + (window.innerHeight + moveDistanceY) + "px)")
                    }
            }).on("mouseup touchend", function() {
                isStart && (isStart = !1, activePage ? (theClass._isDisableFlipPage = !0, currentPage.style.webkitTransition = "-webkit-transform 0.4s ease-out", activePage.style.webkitTransition = "-webkit-transform 0.4s ease-out", Math.abs(moveDistanceY) > Math.abs(moveDistanceX) && Math.abs(moveDistanceY) > 100 ? (isNext ? (currentPage.style.webkitTransform = "scale(0.2)", activePage.style.webkitTransform = "translateY(0px)") : (currentPage.style.webkitTransform = "scale(0.2)", activePage.style.webkitTransform = "translateY(0px)"), setTimeout(function() {
                    activePage.classList.remove("z-active"), activePage.classList.remove("z-move"), activePage.classList.add("z-current"), currentPage.classList.remove("z-current"), currentPage.classList.remove("z-move"), theClass._isDisableFlipPage = !1, theClass.$currentPage = $(activePage).trigger("current"), $(currentPage).trigger("hide")
                }, 500)) : (isNext ? (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateY(100%)") : (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateY(-100%)"), setTimeout(function() {
                    activePage.classList.remove("z-active"), activePage.classList.remove("z-move"), theClass._isDisableFlipPage = !1
                }, 500))) : currentPage.classList.remove("z-move"))
            })
        }), $win.on("load", function() {
            var guideHtml = '<a href="javascript:void(0);" class="u-guideTop z-move"></a>';
            theClass._$pages.not(theClass._$pages.last()).append(guideHtml)
        }), function() {
            var title = $("title").text(), content = $('[name="description"]').length ? $('[name="description"]').attr("content") : title + "，敬请访问！", picUrl = $("input[data-share-pic]").val();
            image = "http://" + location.host + "/" + picUrl, theClass._$app.wx({title: title,con: content,img: image,handler: {callback: jump}})
        }(), $win.on("load", function() {
            var $appLoading = $("#app-loading");
            $appLoading.addClass("z-hide"), $appLoading.on("webkitTransitionEnd", function() {
                $appLoading.remove()
            }), theClass._isInitComplete = !0, theClass.showPage()
        })
    });
    App.prototype.showPage = function(page) {
        var theClass = this;
        window._app_showPage ? window._app_showPage : window._app_showPage = function(page) {
            var $page, type = typeof page;
            switch (type) {
                case "number":
                    $page = this._$pages.eq(page);
                    break;
                case "string":
                    $page = this._$pages.filter(page).first();
                    break;
                case "object":
                    $page = $(page)
            }
            !this._isFirstShowPage || $page && $page.length || ($page = this.$currentPage, this._isFirstShowPage = !1), $page && $page.length && (this._$pages.filter(".z-current").removeClass("z-current"), $page.css("-webkit-transform", "none").addClass("z-current"), $page.trigger("current"), this.$currentPage = $page)
        }, this._isInitComplete ? window._app_showPage.apply(theClass, [page]) : $(window).one("load", function() {
            window._app_showPage.apply(theClass, [page])
        })
    }, App.prototype.disableFlipPage = function() {
        this._isDisableFlipPage = !0
    }, App.prototype.enableFlipPage = function() {
        this._isDisableFlipPage = !1
    }, App.prototype.setFlipPageMode = function(mode) {
        if ("number" != typeof mode || 0 > mode || mode > 3)
            throw "App.setFlipPageMode 方法调用错误：请提供以下正确的参数（0:禁用翻页、1:启用上下翻页、2:仅启用向上翻页、3:仅启用向下翻页）";
        switch (mode) {
            case 0:
                this._isDisableFlipPage = !0, this._isDisableFlipPrevPage = !0, this._isDisableFlipNextPage = !0;
                break;
            case 1:
                this._isDisableFlipPage = !1, this._isDisableFlipPrevPage = !1, this._isDisableFlipNextPage = !1;
                break;
            case 2:
                this._isDisableFlipPage = !1, this._isDisableFlipPrevPage = !1, this._isDisableFlipNextPage = !0;
                break;
            case 3:
                this._isDisableFlipPage = !1, this._isDisableFlipPrevPage = !0, this._isDisableFlipNextPage = !1
        }
    };
    var app = new App($("body"));
    module.exports = app
});
