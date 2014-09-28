/* 
 *  云来地图插件
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范、Zepto插件
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),
		$ = require('lib/zepto/selector'),
		$ = require('lib/zepto/touch'),
		$ = require('lib/zepto/data');

	//引用 
	require('http://api.map.baidu.com/getscript?v=1.4&ak=h6rMzpaZgIOMvdzzGEzcGgBk&services=true&t=20140320104737');
	//require('http://api.map.baidu.com/getscript?v=1.5&ak=h6rMzpaZgIOMvdzzGEzcGgBk&services=true&t=20140320104737');
	//require('http://api.map.baidu.com/getscript?v=2.0&ak=h6rMzpaZgIOMvdzzGEzcGgBk&services=true&t=20140703155230');

	//注册YunlaiMap插件
	(function () {
		//百度地图容器id
		var mapID = 0;
		//定义YunlaiMap插件对象
		var YunlaiMap = function ($item, options) {
			var theClass = this;
			//定义属性
			this._$yunlaiMap = $item.addClass('u-yunlaiMap');			//目标容器
			this._mapID = 'map_'+(++mapID);
			this._$mapBox = $('<div id="'+ this._mapID +'" class="baiduMap"></div>');
			this._$mapToolBar = $('<div class="mapToolBar">'+
										'<a href="javascript:void(0);" class="closeMap">关闭</a>'+
										'<span class="navigationControl">'+
											'<a href="javascript:void(0);" class="z-current" data-route-type="1">公交</a><a href="javascript:void(0);" data-route-type="2">自驾</a><a href="javascript:void(0);" data-route-type="3">步行</a>'+
										'</span>'+
										'<span class="navigationTip">正在获取您所在的位置...</span>'+
									'</div>');
			this._$navigationTip = this._$mapToolBar.find('.navigationTip');
			this._$navigationControl = this._$mapToolBar.find('.navigationControl');
			this._$mapRoutePanel = $('<div class="mapRoutePanel">'+
										'<div id="routeResult_'+ this._mapID +'" class="routeResult"><p class="noRouteInfo">暂无路线信息！</p></div>'+
										'<a href="javascript:void(0);" class="toggle"></a>'+
									'</div>');
			this._baiduMap = null;
			this.markers = [];		//地图点集合
			this._activedPoint = new BMap.Point(116.404, 39.915);		//当前激活的点，默认为北京天安门

			//设置
			this.settings = $.extend({
				markers : [],		//标记点集合
				mapType : 0			//地图类型（0:常规地图 / 1:卫星地图 / 2:无路网卫星地图 / 3:3D地图）
			}, options);

			//事件集合
			this._events = {
				show : [],
				hide : []
			};

			//将地图工具栏和百度地图盒子添加到地图组件
			this._$yunlaiMap.append(this._$mapRoutePanel);
			this._$yunlaiMap.append(this._$mapToolBar);
			this._$yunlaiMap.append(this._$mapBox);
			if(this._$yunlaiMap.is('.z-hide')){
				this._$yunlaiMap.hide();
			}

			//创建地图对象
			this._baiduMap = new BMap.Map(theClass._mapID, {
				mapType : theClass._util.mapTypes[theClass.settings.mapType]
			});

			//设置地图相关属性
			this._baiduMap.enableScrollWheelZoom();			  			//启用滚轮放大缩小
			this._baiduMap.enableInertialDragging();						//启用地图拖曳
			this._baiduMap.centerAndZoom(theClass._activedPoint, 12);

			//添加地图类型控件
			var mapTypeControl = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
			mapTypeControl.setOffset(new BMap.Size(145, 246));
			this._baiduMap.addControl(mapTypeControl);

			//注册关闭地图按钮事件
			this._$yunlaiMap.delegate('.closeMap', 'click', function (e) {
				e.preventDefault();
				theClass.hide();
			});

			//注册地图绘制控制按钮事件
			this._$navigationControl.delegate('a', 'click', function (e) {
				var $this = $(this);
				//获取路线类型
				var routeType = $this.data('route-type');
				theClass.drawRoute(null, theClass._activedPoint, routeType);
				//切换选中样式
				theClass._setNavigationMode(routeType);
			});

			//注册路线结果面板事件
			this._$mapRoutePanel.delegate('.toggle', 'click', function (e) {
				theClass._$mapRoutePanel.toggleClass('z-show');
			});

			//阻止mouse和touch相关事件冒泡，防止与地图操作相冲突
			this._$yunlaiMap.on('mousedown mousemove mouseup touchstart touchmove touchend', function(e){
				//阻止事件冒泡
				e.stopPropagation();
			});
		};

		//工具库
		YunlaiMap.prototype._util = {
			geocoder : new BMap.Geocoder(),			//地址解析器
			geolocation : new BMap.Geolocation(),	//地理定位对象
			mapTypes : [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP, BMAP_SATELLITE_MAP, BMAP_PERSPECTIVE_MAP]		//地图类型（0:默认（常规地图） / 1:卫星地图 / 2:无路网卫星地图 / 3:3D地图）
		};

		//添加事件
		YunlaiMap.prototype.on = function(eventName, callback) {
			if(this._events[eventName]){
				this._events[eventName].push(callback);
			}
		};

		//触发事件
		YunlaiMap.prototype.trigger = function(eventName) {
			if(this._events[eventName]){
				var callbacks = this._events[eventName];
				for(var i = 0; i<callbacks.length; i++){
					callbacks[i]();
				}
			}
		};

		//显示地图
		YunlaiMap.prototype.show = function() {
			var theClass = this;
			this._$yunlaiMap.addClass('z-hide');
			this._$yunlaiMap.show();
			setTimeout(function () {
				theClass._$yunlaiMap.removeClass('z-hide');
				theClass.trigger('show');
			}, 0);
			//隐藏导航相关控件
			this._$navigationTip.hide();
			this._$navigationControl.hide();
			this._$mapRoutePanel.hide();
		};

		//隐藏地图
		YunlaiMap.prototype.hide = function() {
			var theClass = this;
			this._$yunlaiMap.addClass('z-hide');
			this.trigger('hide');
			setTimeout(function (e) {
				theClass._$yunlaiMap.hide();
			}, 520);
		};

		//显示导航提示
		YunlaiMap.prototype._updateNavigationInfo = function(setup, tip) {
			switch(setup){
				case 0:
					this._showNavigationTip(tip ? tip : '正在获取您所在的位置...', 'loading');
					this._$mapRoutePanel.removeClass('z-show').find('.routeResult').html('<p class="noRouteInfo">暂无路线信息！</p>');
					console.log(tip ? tip : '正在获取您所在的位置...');
				break;
				case 1:
					this._showNavigationTip(tip ? tip : '获取位置失败！', 'error', 5000);
					console.log(tip ? tip : '获取位置失败！');
				break;
				case 2:
					this._showNavigationTip(tip ? tip : '正在绘制公交路线！', 'loading');
					//切换选中样式
					this._setNavigationMode(1);
					console.log(tip ? tip : '正在绘制公交路线！');
				break;
				case 3:
					this._showNavigationTip(tip ? tip : '正在绘制驾车路线！', 'loading');
					//切换选中样式
					this._setNavigationMode(2);
					console.log(tip ? tip : '正在绘制驾车路线！');
				break;
				case 4:
					this._showNavigationTip(tip ? tip : '正在绘制步行路线！', 'loading');
					//切换选中样式
					this._setNavigationMode(3);
					console.log(tip ? tip : '正在绘制步行路线！');
				break;
				case 5:
					this._showNavigationTip(tip ? tip : '路线绘制成功！', 'success', 1000);
					console.log(tip ? tip : '路线绘制成功！');
					var theClass = this;
					setTimeout(function () {
						//隐藏提示
						theClass._$navigationTip.html('').hide();
						//显示导航控件和面板
						theClass._$navigationControl.show();
						theClass._$mapRoutePanel.show().addClass('z-show');
					}, 1000);
				break;
				case 6:
					this._showNavigationTip(tip ? tip : '路线绘制失败！', 'error',  5000);
					this._$mapRoutePanel.removeClass('z-show');
					console.log(tip ? tip : '路线绘制失败！');
				break;
			}
		};

		//显示导航信息
		YunlaiMap.prototype._showNavigationTip = function(tip, icon, timeout) {
			tip = tip ? tip : '';
			if(icon){
				tip = '<i class="icon-'+ icon +'"></i>' + tip;
			}
			this._$navigationTip.html(tip).show();
			this._$navigationControl.hide();
			if(timeout){
				var theClass = this;
				setTimeout(function () {
					theClass._$navigationTip.html('').hide();
				}, timeout)
			}
		};

		//设置导航模式
		YunlaiMap.prototype._setNavigationMode = function(routeType) {
			var $links = this._$navigationControl.find('a');
			$links.filter('.z-current').removeClass('z-current');
			$links.filter('[data-route-type="'+routeType+'"]').addClass('z-current');
		};

		//添加标记点
		YunlaiMap.prototype.addMarker = function(_marker) {
			var theClass = this;
			//创建点对象
			var point = new BMap.Point(_marker.lng, _marker.lat);
			//创建标注对象
			var marker = new BMap.Marker(point);	//{ icon : new BMap.Icon('/template/22/source/styles/img/yunlaiMap-marker.png', new BMap.Size(41, 80)) }

			//创建信息窗口对象
			var infoWindow = new BMap.InfoWindow();
			var navigationHtml = '<div class="navigationButtons"> <a href="#" data-route-type="1">公交</a><a href="#" data-route-type="2">自驾</a><a href="#" data-route-type="3">步行</a> </div>';
			//设置信息窗口对象标题和内容
			if(_marker.title){
				infoWindow.setTitle(_marker.title);
			}
			if(_marker.content){
				infoWindow.setContent(_marker.content + navigationHtml);
			}
			if(!_marker.title || !_marker.content){
				//如果没有标题或内容，则反地址自动获取
				theClass._util.geocoder.getLocation(point, function (result) {
					if(result){
						if(!_marker.title){
							result.address = result.address ? result.address : '未知地点';
							infoWindow.setTitle(result.address);
						}
						if(!_marker.content){
							result.business = result.business ? result.business : '无';
							infoWindow.setContent('周边：'+result.business + navigationHtml);
						}
					}
				});
			}
			//点击标注时显示信息窗口
			marker.addEventListener( 'click', function (e) {
				//显示信息窗口
				this.openInfoWindow(infoWindow);
				//设置当前激活的点
				theClass._activedPoint = this.point;
				//注册路线绘制按钮点击事件
				if(theClass._baiduMap.infoWindow && !theClass._yunlaiMap_initRouted){
					theClass._yunlaiMap_initRouted = true;
					$(theClass._baiduMap.infoWindow.contentMain).delegate('.navigationButtons a', 'click', function (e) {
						//获取目标Point和路线类型
						var toPoint = theClass._baiduMap.infoWindow.marker.point;
						var routeType = $(this).data('route-type');
						//画路线
						theClass.drawRoute(null, toPoint, routeType);
					});
				}
			});

			//将标注添加到地图中
			theClass._baiduMap.addOverlay(marker);
			theClass.markers.push(marker);

			//将当前位置显示到中间
			theClass._baiduMap.centerAndZoom(point, 12);

			window.clearTimeout(window._yunlaiMap_addMarker_timeout);
			window._yunlaiMap_addMarker_timeout = setTimeout(function () {
				//设置地图显示位置
				theClass._baiduMap.setZoom(10);
				theClass._baiduMap.setCenter(point);
				//如果只有一个点，则触发click事件展开信息窗口
				//alert(theClass.markers.length);
				if(theClass.markers.length == 1){
					marker.dispatchEvent('click');
				}
			}, 200);

			//返回标注点
			return marker;
		};

		//批量添加标记点
		YunlaiMap.prototype.addMarkers = function(_markers) {
			var theClass = this;
			for(var i = 0; i < _markers.length; i++){
				theClass.addMarker(_markers[i]);
			}
		};

		//清除标记点
		YunlaiMap.prototype.clearMarkers = function() {
			for(var i = 0; i < this.markers.length; i++){
				this._baiduMap.removeOverlay( this.markers[i] );
			}
		};

		//绘制路线
		YunlaiMap.prototype.drawRoute = function (fromPoint, toPoint, routeType) {
			var theClass = this;
			routeType = routeType ? routeType : 1;
			if(!toPoint){
				return;
			}
			if(!fromPoint){
				//获取当前位置
				theClass._updateNavigationInfo(0);
				theClass._util.geolocation.getCurrentPosition(function (result) {
					if(result && result.point){
						theClass.drawRoute(result.point, toPoint, routeType);
					}else{
						theClass._updateNavigationInfo(1);
					}
				}, {enableHighAccuracy: true, timeout: 12000, maximumAge: 60000});
			}else{
				//根据路径类型绘制不同路线
				switch(routeType){
					case 1:
						//绘制公交路线
						theClass.drawTransitRoute(fromPoint, toPoint);
					break;
					case 2:
						//绘制自驾路线
						theClass.drawDrivingRoute(fromPoint, toPoint);
					break;
					case 3:
						//绘制绘制步行路线
						theClass.drawWalkingRoute(fromPoint, toPoint);
					break;
				}
			}
		};

		//绘制公交路线
		YunlaiMap.prototype.drawTransitRoute = function (fromPoint, toPoint) {
			var theClass = this;
			if(!toPoint){
				return;
			}
			if(!fromPoint){
				theClass.drawRoute(fromPoint, toPoint, 1);
			}else{
				theClass._updateNavigationInfo(2);
				//创建自驾路线绘制实例
				if(!theClass._transitRoute){
					theClass._transitRoute = new BMap.TransitRoute(theClass._baiduMap, {
						renderOptions: {map: theClass._baiduMap, panel: 'routeResult_' + theClass._mapID, autoViewport: true },
						onSearchComplete :function (result) {
							if(result._plans && result._plans.length > 0){
								theClass._updateNavigationInfo(5);
							}else{
								theClass._updateNavigationInfo(6, '取经之路路途遥远，咱们还是坐灰机吧！^_^');
							}
						}
					});	
				}
				//清除路线
				theClass.clearRoutes();
				//绘制自驾路线
				theClass._transitRoute.search(fromPoint, toPoint);
			}
		};

		//绘制驾车路线
		YunlaiMap.prototype.drawDrivingRoute = function (fromPoint, toPoint) {
			var theClass = this;
			if(!toPoint){
				return;
			}
			if(!fromPoint){
				theClass.drawRoute(fromPoint, toPoint, 2);
			}else{
				theClass._updateNavigationInfo(3);
				//创建自驾路线绘制实例
				if(!theClass._drivingRoute){
					theClass._drivingRoute = new BMap.DrivingRoute(theClass._baiduMap, {
						renderOptions: {map: theClass._baiduMap, panel: 'routeResult_' + theClass._mapID, autoViewport: true },
						onSearchComplete :function (result) {
							if(result._plans && result._plans.length > 0){
								theClass._updateNavigationInfo(5);
							}else{
								theClass._updateNavigationInfo(6, '取经之路路途遥远，咱们还是坐灰机吧！^_^');
							}
						}
					});
				}
				//清除路线
				theClass.clearRoutes();
				//绘制自驾路线
				theClass._drivingRoute.search(fromPoint, toPoint);
			}
		};

		//绘制步行路线
		YunlaiMap.prototype.drawWalkingRoute = function (fromPoint, toPoint) {
			var theClass = this;
			if(!toPoint){
				return;
			}
			if(!fromPoint){
				theClass.drawRoute(fromPoint, toPoint, 3);
			}else{
				theClass._updateNavigationInfo(4);
				//创建步行路线绘制实例
				if(!theClass._walkingRoute){
					theClass._walkingRoute = new BMap.WalkingRoute(theClass._baiduMap, {
						renderOptions: {map: theClass._baiduMap, panel: 'routeResult_' + theClass._mapID, autoViewport: true },
						onSearchComplete :function (result) {
							if(result._plans && result._plans.length > 0){
								theClass._updateNavigationInfo(5);
							}else{
								theClass._updateNavigationInfo(6, '取经之路路途遥远，咱们还是坐灰机吧！^_^');
							}
						}
					});
				}
				//清除路线
				theClass.clearRoutes();
				//绘制步行路线
				theClass._walkingRoute.search(fromPoint, toPoint);
			}
		};

		//清除所有导航路线
		YunlaiMap.prototype.clearRoutes = function() {
			//清除导路线
			if(this._transitRoute){
				this._transitRoute.clearResults();
			}
			if(this._drivingRoute){
				this._drivingRoute.clearResults();
			}
			if(this._walkingRoute){
				this._walkingRoute.clearResults();
			}
			//清除路线信息
			this._$navigationControl.hide();
			this._$mapRoutePanel.removeClass('z-show').find('.routeResult').html('<p class="noRouteInfo">暂无路线信息！</p>');
		};

		//清除所有覆盖物
		YunlaiMap.prototype.clearOverlays = function() {
			//清除覆盖物
			this._baiduMap.clearOverlays();
			//清除路线结果
			this.clearRoutes();
			this.markers.length = 0;
		};

		//显示卫星地图
		YunlaiMap.prototype.changeMapType = function (mapType) {
			//更新为卫星地图
			this._baiduMap.setMapType(this._util.mapTypes[mapType]);
		};

		//m册YunlaiMap插件接口
		$.fn.yunlaiMap = function (options) {
			//获取指令
			var command = 'init';
			if(arguments.length > 0){
				if (typeof arguments[0] == 'string'){
					command = arguments[0];
				}
			}

			//判断指令
			switch(command){
				//对象初始化
				case 'init':
					//循环操作
					this.each(function (i, item) {
						var $item = $(item);
						//实例化YunlaiMap对象
						var pluginObj = new YunlaiMap($item, options);
						//将当前插件对象保存到data中
						$item.data('plugin_yunlaiMap', pluginObj);
					});
				break;
				//获取插件对象
				case 'getPluginObject':
					//将当前插件对象保存到data中
					return this.data('plugin_yunlaiMap');
				break;
				//调用插件对象方法
				default:
					var pluginObj = this.data('plugin_yunlaiMap');
					var method = pluginObj[command];
					if(method){
						var parameters = [];
						if(arguments.length > 1){
							parameters = arguments[1];
						}
						method.apply(pluginObj, parameters);
					}
				break;
			}

			//保持操作链
			return this;
		};
	})();

	module.exports = $;
});