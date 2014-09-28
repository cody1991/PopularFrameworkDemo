/* 
 *  图片蒙板组件
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-15
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){
	
	//引用相关模块
	var $ = require('lib/zepto/zepto'),	
		$ = require('lib/zepto/touch'),
		$ = require('lib/zepto/data');

	var app = require('modules/app/main'); 
	var widget = require('units/widget');

	var mask = function(opts){
		this.click = ("ontouchstart" in window) ? 'tap' : 'click';
		this.setInter = null;
		this.setInterOne = null;
		this.setInterTwo = null;
		this.setInterThree = null;

		this.touchNum = 0;
		this.touchFinish = false;

		for (i in opts) {
			this[i] = opts[i];
		}
	}

	mask.prototype = $.extend({},widget,{

		init : function(){
			var that = this;
			//禁止app翻页
			
				//app.disableFlipPage();
			
			this.circle1.on(this.click,function(){
				that.touchNum += 1;
				$(this).hide();

				that.maskAnimationTwo(that,4,3,12,60,function(){
					that.maskAnimationBack(that)
				})
			});

			this.circle2.on(this.click,function(){
				that.touchNum += 1;
				$(this).hide();

				that.maskAnimationOne(that,4,3,12,60,function(){
					that.maskAnimationBack(that)
				})
			});

			this.circle3.on(this.click,function(){
				that.touchNum += 1;
				$(this).hide();

				that.maskAnimationThree(that,4,3,12,60,function(){
					that.maskAnimationBack(that)
				})
			});
		},

		maskAnimationBack : function(that){
			if (that.touchNum >=3 && !that.touchFinish) {
				that.touchFinish = true;
				if(that.touchFinish){
				   //启用app翻页
				   app.enableFlipPage();
				}
				that.maskAnimation(that,4,5,20,80,function(){
					that.mask.find('.touch-1').hide();
					that.mask.find('.touch-2').hide();
					that.mask.find('.touch-3').hide();
					that.mask.find('.touch-4').css("-webkit-mask",'none!importnat');
				});
			}
		},	

		maskAnimationOne:function(that,x,y,end,time,callback){
			clearInterval(that.setInterOne);
			var _x_a = _y_a = _i_a = 0;
			that.setInterOne = setInterval(function(){
				if(_x_a >= x){
					_x_a=0;
					_y_a = _y_a >= y ? 0 : _y_a += 1;
				}
				
				that.mask.find('.touch-1').css("-webkit-mask-position", (-_x_a*640)+"px "+(-_y_a*$(window).height())+"px");
				_x_a+=1;
				_i_a++;
				if(_i_a>=end){
					clearInterval(that.setInterOne);
					callback();
				}
			},time);
		},
		
		maskAnimationTwo:function(that,x,y,end,time,callback){
			clearInterval(that.setInterTwo);
			var _x_b = _y_b = _i_b = 0;
			that.setInterTwo = setInterval(function(){
				if(_x_b >= x){
					_x_b=0;
					_y_b = _y_b >= y ? 0 : _y_b += 1;
				}
				
				that.mask.find('.touch-2').css("-webkit-mask-position", (-_x_b*640)+"px "+(-_y_b*$(window).height())+"px");
				_x_b+=1;
				_i_b++;
				if(_i_b>=end){
					clearInterval(that.setInterTwo);
					callback();
				}
			},time);
		},

		maskAnimationThree:function(that,x,y,end,time,callback){
			clearInterval(that.setInterThree);
			var _x_c = _y_c = _i_c = 0;
			that.setInterThree = setInterval(function(){
				if(_x_c >= x){
					_x_c=0;
					_y_c = _y_c >= y ? 0 : _y_c += 1;
				}
				
				that.mask.find('.touch-3').css("-webkit-mask-position", (-_x_c*640)-20+"px "+(-_y_c*$(window).height())+"px");
				_x_c+=1;
				_i_c++;
				if(_i_c>=end){
					clearInterval(that.setInterThree);
					callback();
				}
			},time);
		},

		maskAnimation:function(that,x,y,end,time,callback){
			clearInterval(that.setInter);
			var _x = _y = _i = 0;
			that.setInter = setInterval(function(){
				if(_x >= x){
					_x=0;
					_y = _y >= y ? 0 : _y += 1;
				}

				that.mask.find('.touch-4').css("-webkit-mask-position", (-_x*640)+"px "+(-_y*$(window).height())+"px");
				_x+=1;
				_i++;
				if(_i>=end){
					clearInterval(that.setInter);
					callback();
				}
			},time);
		}
	})

	//对外提供接口
	module.exports = mask;
});