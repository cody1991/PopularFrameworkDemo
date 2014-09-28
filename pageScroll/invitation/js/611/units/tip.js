/* 
 *  提示组件模块：tip
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-04-26
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/

define(function(require, exports, module){

	//引用相关模块
	var $ = require('lib/zepto/zepto');
	$ = require('lib/zepto/animationShow');

	function Tip() {
		this._$tipTemplate = $('<div class="u-tip"><i></i><p>{content}</p></div>');
		this._$body = $('body');
	}

	//显示提示
	Tip.prototype.show = function(msg, timeout, type) {
		msg = msg ? msg : '这是一个提示信息！';
		timeout = timeout ? timeout : 2000;
		type = type ? type : 'info';

		//克隆一个消息框
		var $tip = this._$tipTemplate.clone().addClass('z-' + type);
		//填充提示信息
		$tip.children('p').text(msg);
		//显示提示框并校正位置
		this._$body.append($tip);
		$tip.css('margin-left', $tip.width()/-2);
		//延迟关闭
		setTimeout(function () {
			$tip.remove();
		}, timeout);
	};

	//显示提示信息
	Tip.prototype.info = function(msg, timeout) {
		this.show(msg, timeout, 'info');
	};

	//显示成功信息
	Tip.prototype.success = function(msg, timeout) {
		this.show(msg, timeout, 'success');
	};

	//显示错误信息
	Tip.prototype.error = function(msg, timeout) {
		this.show(msg, timeout, 'error');
	};

	//显示警告信息
	Tip.prototype.warning = function(msg, timeout) {
		this.show(msg, timeout, 'warning');
	};

	//实例化Tip对象
	var tip = new Tip();

	//输出模块接口
	module.exports = tip;	
});