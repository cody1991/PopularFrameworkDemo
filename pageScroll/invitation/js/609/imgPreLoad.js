/**
 * 预加载图片，把图片资源加载存放到浏览器缓存中，使用本插件需要开启浏览器缓存
 * @param urls 需要预加载图片地址数组
 * @param optiosn 回调函数，有个参数，表示当前加载图片的数量
 * 
 * 创建实例：new imgPreInit(urls,{process:function(i){},complete:function(){}});
 */
;(function(window){
	var imgPreInit = function(urls,options){
		var that = this;
		that.params = {     		  //变量
			urls		:   [],		  //需要加载的url地址
			processs	:	null,	  //过程回调函数
			complete	:   null,	  //完成回调函数
				
			all			:	0,        //所有图片数
			load		:	0,		  //已加载完成图片数
		};   
		that.params.urls = urls;
		var i;
		for(i in options){
			that.params[i] = options[i];
		}
		that._init();
	};
	imgPreInit.prototype = {
		handleEvent: function(e){    //事件入口
			var that = this;
			switch (e.type){
				case 'load': that._done(e);break;
			}
		},
		_init: function(){
			var that = this;
			if(typeof(that.params.urls) != 'object'){return;}
			that.params.all = that.params.urls.length;
			if(that.params.all <= 0){return;}
			var i,
				obj;
			for(i=0; i<that.params.all; i++){
				obj = new Image();
				that._bind('load', obj, false);
				obj.src = that.params.urls[i];
			}
		},
		_done: function(e){
			var that = this;
			var obj = e.currentTarget;
			that._unbind('load', obj, false);
			that.params.load++;
			if(that.params.process){
				that.params.process.call(this,that.params.load);
			}
			if(that.params.load == that.params.all && that.params.complete){
				that.params.complete.call(this);
			}
		},
		_bind: function (type, el, bubble) {		
			el.addEventListener(type, this, !!bubble);
		},
		_unbind: function (type, el, bubble) {
			el.removeEventListener(type, this, !!bubble);
		},
	};
	window.imgPreInit = imgPreInit;
})(window);
