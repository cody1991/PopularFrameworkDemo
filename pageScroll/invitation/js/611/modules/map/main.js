/* 
 *  页面程序入口
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),			//Zepto模块
		$ = require('units/yunlaiMap');			//云来地图模块
	var app = require('modules/app/main');		//App模块

	//获取页面模块jQuery对象
	var $mapPages = $('.page-map');

	//对外提供接口
	module.exports = {
		//初始化
		init : function () {
			//初始化地图模块
			$mapPages.each(function (i, item) {
				console.log('map init');
				//获取当前page页
				$page = $(item);
			
				//初始化地图组件
				var $map = $page.find('.u-yunlaiMap');
				var map = $map.yunlaiMap().yunlaiMap('getPluginObject');
				//注册显示隐藏事件
				map.on('show', function () {
					app.disableFlipPage();
				});
				map.on('hide', function () {
					app.enableFlipPage();
				});

				//点击显示地图
				$page.find('.m-distributedPoints').delegate('a', $.isPC ? 'click' : 'tap', function (e) {
					var $this =$(this);
					try{
						//显示地图
						map.show();
						//清除所有覆盖物（标记点、路线）
						map.clearOverlays();
						//获取数据集合
						var markers = $this.data('map-markers');
						if(markers){
							var markersArr = eval(markers);
							//循环添加标记点
							for(var i = 0; i < markersArr.length; i++){
								var marker = markersArr[i];
								marker.title = marker.name;
								marker.content = '电话：<a href="tel:'+ marker.tel +'">'+ marker.tel +'</a><br/>'+marker.desc+'<br/>地址：'+ marker.addr;
								delete marker.name;
								delete marker.tel;
								delete marker.addr;
								delete marker.desc;
								marker.content = marker.content.replace(/(\<br\s*\/\>\s*)+/ig, '<br/>');
								map.addMarker(marker);
							}
						}
					}catch(e){
						console.log(e);
					}
				});

				//注册激活时的事件
				var distributedPointsInitFlag = true;
				$page.on('active', function (e) {
					console.log('map active');
					var $page = $(this);
					//矫正位置
					if(distributedPointsInitFlag){
						distributedPointsInitFlag = false;
						$page.find('.m-distributedPoints li').each(function(i, item){
							item.style.top = (item.offsetTop - item.offsetHeight + 6) + 'px';
							item.style.left = (item.offsetLeft - (item.offsetWidth / 2)) + 'px';
							$(item).find('a').css('left', (item.offsetWidth / 2) - 31.5);
						});	
					}
				}).on('current', function (e) {
					console.log('map current');
				});
			});
		}
	}
});