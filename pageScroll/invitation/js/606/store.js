$(document).ready(function(){
//	//点击看大图
//	$('.per-image-thumb').on('swipeclick',function(){
//		$('#st-container').css('pointer-events', 'none');
//		var _orgImg = $(this);
//		var _imgBox = $('#bigimg-box');
//		var _newImg = $('#bigimg-box').find('img');
//		_imgBox.data('plugin','store').find('img').attr('src',_orgImg.attr('src'));
//		
//		var _cH=$(window).height();
//		var _cW=$(window).width();
//		var _img = new Image();
//		_img.src = _orgImg.attr('src');
//		_imgBox.width(_cW).height(_cH);
//		//var _imgScalH = _img.height;
//		//if(_img.width != _cW){
//			_imgScalH = _img.height*(_cW/_img.width);
//		//}
//		//_newImg.height(_imgScalH).width(_cW);
//		if(_imgScalH < _cH){
//			_newImg.css('margin-top',(_cH-_imgScalH)/2);
//			_newImg.css({width:'100%', height:'auto'});
//		} else {
//			_newImg.css({width:'auto', height:'100%'});
//		}
//		_imgBox.show();
//	});
	
	if (!$('#map').hasClass('map-is-mana')) {
		$('#map').width(document.documentElement.clientWidth).height(document.documentElement.clientHeight*0.5);
		if ($('.store-image-box').find('li').length <= 0) {
			$('#map').css('margin-top', ($(window).height()-$('#map').height())/2);
		} else if ($('.store-image-box').find('li').length == 1) {
			$('.store-image-box').find('li').css('width','100%');
			$('.store-image-box').find('img').css('width','100%');
		}
	}
	
	
	if($('#map').length>0){
		var map = new BMap.Map("map");                      // 创建Map实例
		map.enableScrollWheelZoom();          //启用滚轮放大缩小
		map.enableInertialDragging();         //启用地图拖曳
		
		var marks = eval('(' + $('#marker_array').val() + ')');
		var addresses = eval('(' + $('#address_array').val() + ')');

		var point = new BMap.Point(marks[0].longitude,marks[0].latitude);
		var marker = new BMap.Marker(point);  // 创建标注
		map.addOverlay(marker);              // 将标注添加到地图中
		
		map.centerAndZoom(point,15);
		var label = new BMap.Label('',{offset:new BMap.Size(0,-20)});
		label.setContent("<div style='border:0px solid #ffffff;font-size:10px;'>"+addresses[0].address+"</div>");
		marker.setLabel(label);
		
		$('#map').on('setCenter',function(){
			map.centerAndZoom(point,15);
		});
	}
	
	$('.map-dh-btn').on('swipeclick', function(){
		window.open($(this).attr('data-href'));
	});
	
	$(function(){
		myIView = new IView('.view-img', {
			scrollEle : $('.sl-slides-wrapper'),
			swipeLeft : function (x, time) {
				slitslider.next();
			},
			swipeRight : function (x, time) {
				slitslider.previous();
			},
		});
	});
});