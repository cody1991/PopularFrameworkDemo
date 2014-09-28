/* 
 *  对象工具模块
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-04-26
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/
 
define(function(require, exports, module){ 

	//对象工具类
	var ObjectUtil = function () {
		// body...
	};

	//根据类创建一个伪空对象
	ObjectUtil.prototype.createEmptyObject = function(classFunction) {
		//定义空对象和空函数
		var emptyObject = {},
			emptyFunction = function(){ };
		//判断是否为function
		if(typeof(classFunction) == 'function'){
			//克隆空方法
			for(var key in classFunction.prototype){
				if(typeof(classFunction.prototype[key]) == 'function'){
					emptyObject[key] = emptyFunction;
				}
			}
		}

		//返回空对象
		return emptyObject;
	};

	//初始化ObjectUtil对象
	var objectUtil = new ObjectUtil();

	//对外输出接口
	module.exports = objectUtil;
});
