/* 
 *  贷款计算器功能模块
 * ----------------------------------
 *  作者：Charles
 *  时间：2014-05-05
 *  准则：CMD 规范
 *  联系：16295853（qq）
 ************************************************************/
 
define(function(require, exports, module){

	//贷款计算器类
	var LoanCalculator = function () {

	};

	//等额本息贷款(贷款金额, 利率, 期限, 利率类型, 是否计算输出详细信息)，来源：http://app.rong360.com/fangdaical.html
	LoanCalculator.prototype.debx = function(je, lv, qx, lvlx) {
		//数据转换
		qx = parseInt(qx);
		je = parseFloat(je);
		lv = parseFloat(lv);
		lvlx = parseInt(lvlx);
		//计算常规信息
		var ylv = lvlx == 1 ? lv / 12 * 0.01 : lv * 0.01;
		var t = Math.pow(1 + ylv, qx);
		var yhk = je * ylv * (t / (t - 1));
		var hkze = yhk * qx;
		var zlx = hkze - je;
		var fh = new Object();
		fh.zlx = zlx;
		fh.hkze = hkze;
		fh.yhk = yhk;
		//计算详细信息
	    var ye = je;
	    var sz = [];
	    for (i = 1; i <= qx; i++) {
	        var ylx = ye * ylv;
	        var ybj = yhk - ylx;
	        ye -= ybj;
	        var xj = new Object();
	        xj.bh = i;
	        xj.ylx = ylx;
	        xj.ybj = ybj;
	        xj.ye = ye;
	        sz[i - 1] = xj
	    }
	    fh.xx = sz
	    //返回计算结果
		return fh
	};

	//等额本金(贷款金额, 利率, 期限, 利率类型, 是否计算输出详细信息)，来源：http://app.rong360.com/fangdaical.html
	LoanCalculator.prototype.debj = function(je, lv, qx, lvlx) {
		//数据转换
		qx = parseInt(qx);
		je = parseFloat(je);
		lv = parseFloat(lv);
		lvlx = parseInt(lvlx);
		//计算常规信息
		var ylv = lvlx == 1 ? lv / 12 * 0.01 : lv * 0.01;
		var hkze = 0;
		var ybj = je / qx;
		var fh = new Object();
		fh.ybj = ybj;
		//计算详细信息
		var ye = je;
		var sz = [];
		for (i = 1; i <= qx; i++) {
		    yhk = je / qx + (je - je * (i - 1) / qx) * ylv;
		    if (i == 1) {
		        fh.syhk = yhk
		    }
		    if (i == 2) {
		        fh.mydj = fh.syhk - yhk
		    }
		    hkze = hkze + yhk;
		    ylx = yhk - ybj;
		    ye = ye - ybj;
		    var xj = new Object();
		    xj.bh = i;
		    xj.ylx = ylx;
		    xj.yhk = yhk;
		    xj.ye = ye;
		    sz[i - 1] = xj
		}
		fh.xx = sz
		fh.zlx = hkze - je;
		fh.hkze = hkze;
		//返回计算结果
		return fh
	};

	//输出模块
	module.exports = new LoanCalculator();	
});