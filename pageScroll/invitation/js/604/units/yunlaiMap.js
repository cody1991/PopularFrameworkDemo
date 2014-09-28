define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto"), $ = require("lib/zepto/selector"), $ = require("lib/zepto/touch"), $ = require("lib/zepto/data");
    require("http://api.map.baidu.com/getscript?v=1.4&ak=h6rMzpaZgIOMvdzzGEzcGgBk&services=true&t=20140320104737"), function() {
        var mapID = 0, YunlaiMap = function($item, options) {
            var theClass = this;
            this._$yunlaiMap = $item.addClass("u-yunlaiMap"), this._mapID = "map-" + ++mapID, this._$mapBox = $('<div id="' + this._mapID + '" class="baiduMap"></div>'), this._$mapToolBar = $('<div class="mapToolBar"><a href="javascript:void(0);" class="closeMap">关闭</a><span class="navigationControl"><a href="javascript:void(0);" class="z-current" data-route-type="1">公交</a><a href="javascript:void(0);" data-route-type="2">自驾</a><a href="javascript:void(0);" data-route-type="3">步行</a></span><span class="navigationTip">正在获取您所在的位置...</span></div>'), this._$navigationTip = this._$mapToolBar.find(".navigationTip"), this._$navigationControl = this._$mapToolBar.find(".navigationControl"), this._$mapRoutePanel = $('<div class="mapRoutePanel"><div id="routeResult_' + mapID + '" class="routeResult"><p class="noRouteInfo">暂无路线信息！</p></div><a href="javascript:void(0);" class="toggle"></a></div>'), this._baiduMap = null, this.markers = [], this._activedPoint = new BMap.Point(116.404, 39.915), this.settings = $.extend({markers: [],mapType: 0}, options), this._events = {show: [],hide: []}, this._$yunlaiMap.append(this._$mapRoutePanel), this._$yunlaiMap.append(this._$mapToolBar), this._$yunlaiMap.append(this._$mapBox), this._$yunlaiMap.is(".z-hide") && this._$yunlaiMap.hide(), this._baiduMap = new BMap.Map(theClass._mapID, {mapType: theClass._util.mapTypes[theClass.settings.mapType]}), this._baiduMap.enableScrollWheelZoom(), this._baiduMap.enableInertialDragging(), this._baiduMap.centerAndZoom(theClass._activedPoint, 12);
            var mapTypeControl = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]});
            mapTypeControl.setOffset(new BMap.Size(145, 246)), this._baiduMap.addControl(mapTypeControl), this._$yunlaiMap.delegate(".closeMap", "click", function(e) {
                e.preventDefault(), theClass.hide()
            }), this._$navigationControl.delegate("a", "click", function() {
                var $this = $(this), routeType = $this.data("route-type");
                theClass.drawRoute(null, theClass._activedPoint, routeType), theClass._setNavigationMode(routeType)
            }), this._$mapRoutePanel.delegate(".toggle", "click", function() {
                theClass._$mapRoutePanel.toggleClass("z-show")
            }), this._$yunlaiMap.on("mousedown mousemove mouseup touchstart touchmove touchend", function(e) {
                e.stopPropagation()
            })
        };
        YunlaiMap.prototype._util = {geocoder: new BMap.Geocoder,geolocation: new BMap.Geolocation,mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP, BMAP_SATELLITE_MAP, BMAP_PERSPECTIVE_MAP]}, YunlaiMap.prototype.on = function(eventName, callback) {
            this._events[eventName] && this._events[eventName].push(callback)
        }, YunlaiMap.prototype.trigger = function(eventName) {
            if (this._events[eventName])
                for (var callbacks = this._events[eventName], i = 0; i < callbacks.length; i++)
                    callbacks[i]()
        }, YunlaiMap.prototype.show = function() {
            var theClass = this;
            this._$yunlaiMap.addClass("z-hide"), this._$yunlaiMap.show(), setTimeout(function() {
                theClass._$yunlaiMap.removeClass("z-hide"), theClass.trigger("show")
            }, 0), this._$navigationTip.hide(), this._$navigationControl.hide(), this._$mapRoutePanel.hide()
        }, YunlaiMap.prototype.hide = function() {
            var theClass = this;
            this._$yunlaiMap.addClass("z-hide"), this.trigger("hide"), setTimeout(function() {
                theClass._$yunlaiMap.hide()
            }, 520)
        }, YunlaiMap.prototype._updateNavigationInfo = function(setup, tip) {
            switch (setup) {
                case 0:
                    this._showNavigationTip(tip ? tip : "正在获取您所在的位置...", "loading"), this._$mapRoutePanel.removeClass("z-show").find(".routeResult").html('<p class="noRouteInfo">暂无路线信息！</p>'), console.log(tip ? tip : "正在获取您所在的位置...");
                    break;
                case 1:
                    this._showNavigationTip(tip ? tip : "获取位置失败！", "error", 5e3), console.log(tip ? tip : "获取位置失败！");
                    break;
                case 2:
                    this._showNavigationTip(tip ? tip : "正在绘制公交路线！", "loading"), this._setNavigationMode(1), console.log(tip ? tip : "正在绘制公交路线！");
                    break;
                case 3:
                    this._showNavigationTip(tip ? tip : "正在绘制驾车路线！", "loading"), this._setNavigationMode(2), console.log(tip ? tip : "正在绘制驾车路线！");
                    break;
                case 4:
                    this._showNavigationTip(tip ? tip : "正在绘制步行路线！", "loading"), this._setNavigationMode(3), console.log(tip ? tip : "正在绘制步行路线！");
                    break;
                case 5:
                    this._showNavigationTip(tip ? tip : "路线绘制成功！", "success", 1e3), console.log(tip ? tip : "路线绘制成功！");
                    var theClass = this;
                    setTimeout(function() {
                        theClass._$navigationTip.html("").hide(), theClass._$navigationControl.show(), theClass._$mapRoutePanel.show().addClass("z-show")
                    }, 1e3);
                    break;
                case 6:
                    this._showNavigationTip(tip ? tip : "路线绘制失败！", "error", 5e3), this._$mapRoutePanel.removeClass("z-show"), console.log(tip ? tip : "路线绘制失败！")
            }
        }, YunlaiMap.prototype._showNavigationTip = function(tip, icon, timeout) {
            if (tip = tip ? tip : "", icon && (tip = '<i class="icon-' + icon + '"></i>' + tip), this._$navigationTip.html(tip).show(), this._$navigationControl.hide(), timeout) {
                var theClass = this;
                setTimeout(function() {
                    theClass._$navigationTip.html("").hide()
                }, timeout)
            }
        }, YunlaiMap.prototype._setNavigationMode = function(routeType) {
            var $links = this._$navigationControl.find("a");
            $links.filter(".z-current").removeClass("z-current"), $links.filter('[data-route-type="' + routeType + '"]').addClass("z-current")
        }, YunlaiMap.prototype.addMarker = function(_marker) {
            var theClass = this, point = new BMap.Point(_marker.lng, _marker.lat), marker = new BMap.Marker(point), infoWindow = new BMap.InfoWindow, navigationHtml = '<div class="navigationButtons"> <a href="#" data-route-type="1">公交</a><a href="#" data-route-type="2">自驾</a><a href="#" data-route-type="3">步行</a> </div>';
            return _marker.title && infoWindow.setTitle(_marker.title), _marker.content && infoWindow.setContent(_marker.content + navigationHtml), _marker.title && _marker.content || theClass._util.geocoder.getLocation(point, function(result) {
                result && (_marker.title || (result.address = result.address ? result.address : "未知地点", infoWindow.setTitle(result.address)), _marker.content || (result.business = result.business ? result.business : "无", infoWindow.setContent("周边：" + result.business + navigationHtml)))
            }), marker.addEventListener("click", function() {
                this.openInfoWindow(infoWindow), theClass._activedPoint = this.point, theClass._baiduMap.infoWindow && !theClass._yunlaiMap_initRouted && (theClass._yunlaiMap_initRouted = !0, $(theClass._baiduMap.infoWindow.contentMain).delegate(".navigationButtons a", "click", function() {
                    var toPoint = theClass._baiduMap.infoWindow.marker.point, routeType = $(this).data("route-type");
                    theClass.drawRoute(null, toPoint, routeType)
                }))
            }), theClass._baiduMap.addOverlay(marker), theClass.markers.push(marker), theClass._baiduMap.centerAndZoom(point, 12), window.clearTimeout(window._yunlaiMap_addMarker_timeout), window._yunlaiMap_addMarker_timeout = setTimeout(function() {
                theClass._baiduMap.setZoom(10), theClass._baiduMap.setCenter(point)
            }, 200), marker
        }, YunlaiMap.prototype.addMarkers = function(_markers) {
            for (var theClass = this, i = 0; i < _markers.length; i++)
                theClass.addMarker(_markers[i])
        }, YunlaiMap.prototype.clearMarkers = function() {
            for (var i = 0; i < this.markers.length; i++)
                this._baiduMap.removeOverlay(this.markers[i])
        }, YunlaiMap.prototype.drawRoute = function(fromPoint, toPoint, routeType) {
            var theClass = this;
            if (routeType = routeType ? routeType : 1, toPoint)
                if (fromPoint)
                    switch (routeType) {
                        case 1:
                            theClass.drawTransitRoute(fromPoint, toPoint);
                            break;
                        case 2:
                            theClass.drawDrivingRoute(fromPoint, toPoint);
                            break;
                        case 3:
                            theClass.drawWalkingRoute(fromPoint, toPoint)
                    }
                else
                    theClass._updateNavigationInfo(0), theClass._util.geolocation.getCurrentPosition(function(result) {
                        result && result.point ? theClass.drawRoute(result.point, toPoint, routeType) : theClass._updateNavigationInfo(1)
                    }, {enableHighAccuracy: !0,timeout: 12e3,maximumAge: 6e4})
        }, YunlaiMap.prototype.drawTransitRoute = function(fromPoint, toPoint) {
            var theClass = this;
            toPoint && (fromPoint ? (theClass._updateNavigationInfo(2), theClass._transitRoute || (theClass._transitRoute = new BMap.TransitRoute(theClass._baiduMap, {renderOptions: {map: theClass._baiduMap,panel: "routeResult_1",autoViewport: !0},onSearchComplete: function(result) {
                    result._plans && result._plans.length > 0 ? theClass._updateNavigationInfo(5) : theClass._updateNavigationInfo(6, "取经之路路途遥远，咱们还是坐灰机吧！^_^")
                }})), theClass.clearRoutes(), theClass._transitRoute.search(fromPoint, toPoint)) : theClass.drawRoute(fromPoint, toPoint, 1))
        }, YunlaiMap.prototype.drawDrivingRoute = function(fromPoint, toPoint) {
            var theClass = this;
            toPoint && (fromPoint ? (theClass._updateNavigationInfo(3), theClass._drivingRoute || (theClass._drivingRoute = new BMap.DrivingRoute(theClass._baiduMap, {renderOptions: {map: theClass._baiduMap,panel: "routeResult_1",autoViewport: !0},onSearchComplete: function(result) {
                    result._plans && result._plans.length > 0 ? theClass._updateNavigationInfo(5) : theClass._updateNavigationInfo(6, "取经之路路途遥远，咱们还是坐灰机吧！^_^")
                }})), theClass.clearRoutes(), theClass._drivingRoute.search(fromPoint, toPoint)) : theClass.drawRoute(fromPoint, toPoint, 2))
        }, YunlaiMap.prototype.drawWalkingRoute = function(fromPoint, toPoint) {
            var theClass = this;
            toPoint && (fromPoint ? (theClass._updateNavigationInfo(4), theClass._walkingRoute || (theClass._walkingRoute = new BMap.WalkingRoute(theClass._baiduMap, {renderOptions: {map: theClass._baiduMap,panel: "routeResult_1",autoViewport: !0},onSearchComplete: function(result) {
                    result._plans && result._plans.length > 0 ? theClass._updateNavigationInfo(5) : theClass._updateNavigationInfo(6, "取经之路路途遥远，咱们还是坐灰机吧！^_^")
                }})), theClass.clearRoutes(), theClass._walkingRoute.search(fromPoint, toPoint)) : theClass.drawRoute(fromPoint, toPoint, 3))
        }, YunlaiMap.prototype.clearRoutes = function() {
            this._transitRoute && this._transitRoute.clearResults(), this._drivingRoute && this._drivingRoute.clearResults(), this._walkingRoute && this._walkingRoute.clearResults(), this._$navigationControl.hide(), this._$mapRoutePanel.removeClass("z-show").find(".routeResult").html('<p class="noRouteInfo">暂无路线信息！</p>')
        }, YunlaiMap.prototype.clearOverlays = function() {
            this._baiduMap.clearOverlays(), this.clearRoutes()
        }, YunlaiMap.prototype.changeMapType = function(mapType) {
            this._baiduMap.setMapType(this._util.mapTypes[mapType])
        }, $.fn.yunlaiMap = function(options) {
            var command = "init";
            switch (arguments.length > 0 && "string" == typeof arguments[0] && (command = arguments[0]), command) {
                case "init":
                    this.each(function(i, item) {
                        var $item = $(item), pluginObj = new YunlaiMap($item, options);
                        $item.data("plugin_yunlaiMap", pluginObj)
                    });
                    break;
                case "getPluginObject":
                    return this.data("plugin_yunlaiMap");
                default:
                    var pluginObj = this.data("plugin_yunlaiMap"), method = pluginObj[command];
                    if (method) {
                        var parameters = [];
                        arguments.length > 1 && (parameters = arguments[1]), method.apply(pluginObj, parameters)
                    }
            }
            return this
        }
    }(), module.exports = $
});
