/* 
 *  图片工具模块
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-05
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/
 
define(function(require, exports, module){

	//imageUtil模块
	var imageUtil = {
		//加载图片
		loadImg : function (url, callback) {
			//实例化图片
			var img = new Image();
			//监听事件
			img.onreadystatechange = function (e) {
				if (this.readyState == "complete") {
					callback(img);
				}
			}
			img.onload = function (e) {
				if (this.complete == true) {
					callback(img);
				}
			}
			img.onerror = function (e) {
				callback(img);
			}
			//指定图片地址加载图片
			img.src = url;
		}
	};

	//输出模块
	module.exports = imageUtil;	
});