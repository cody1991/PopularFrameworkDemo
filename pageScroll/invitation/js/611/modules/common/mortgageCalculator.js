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
	var $ = require('lib/zepto/zepto'),
		$ = require('lib/zepto/touch'),
		$ = require('units/maskLayer');
	var app = require('modules/app/main');
	var tip = require('units/tip');
	var IScroll = require('lib/iscroll/iscroll');
	var loanCalculator = require('system/math/loanCalculator');		//房贷计算器功能模块

	//房贷计算器UI类
	var MortgageCalculator = function () {
		//定义属性
		this.$mortgageCalculator = $('.m-mortgageCalculator');
		this.$formCalculator = this.$mortgageCalculator.find('#formCalculator');
		this.mortgageCalculatorLayer;

		this.$calculatorResultLayer = this.$mortgageCalculator.find('.m-calculatorResultLayer');
		this.calculatorResultLayer;

		this.loanType = 'commercialLoans';		//贷款类别

		this._isInit = true;	//是否初始化

		this._switchIscrolls = [];	//_switchIscrolls，用于修复bug

		//初始化主体遮罩层
		this.$mortgageCalculator.maskLayer({
			clickHideMode: 0,
			onShow: function (e) {
				app.disableFlipPage();
			},
			onHide: function (e) {
				app.enableFlipPage();
			}
		}).height(window.innerHeight);
		this.mortgageCalculatorLayer = this.$mortgageCalculator.maskLayer('getPluginObject');
	};

	//修复switch2中的IScroll隐藏/显示后的问题
	MortgageCalculator.prototype._fixSwitchIScroll = function () {
		for(var i = 0; i < this._switchIscrolls.length; i++){
			this._switchIscrolls[i].refresh();
		}
	};

	//初始化
	MortgageCalculator.prototype._init = function() {
		if(this._isInit){
			this._isInit = false;
			//获取相关对象
			var theClass = this;
			var $form = this.$formCalculator;
			theClass.mortgageCalculatorLayer.one('show', function (e) {
				//初始化控件功能
				(function () {
					//控件：switch1
					$form.find('.switch1').each(function (i, item) {
						var $item = $(item);
						//切换效果
						$item.find('input').on('change', function (e) {
							$(this).parent().addClass('z-current').siblings().removeClass('z-current');
						}).filter(':checked').change();
					});

					//控件：tab
					$form.find('.tab').each(function (i, item) {
						var $item = $(item);
						var $headerInputList = $item.find('header input');
						var $contentBoxList = $item.find('section .panel');
						//切换效果
						$headerInputList.on('change', function (e) {
							var $this = $(this);
							//tab选项卡切换
							$this.parent().addClass('z-current').siblings().removeClass('z-current');
							//tab选项卡内容切换
							var contentID = $this.parent().data('target');
							$contentBoxList.hide();
							$contentBoxList.filter('#'+contentID).show();
							//修复switch2中的IScroll
							theClass._fixSwitchIScroll();
						}).filter(':checked').change();
					});

					//控件：switch2
					$form.find('.switch2').each(function (i, item) {
						var $item = $(item);
						var $inputs = $item.find('input');
						var $liItems = $item.find('li');

						//禁止label事件默认行为
						$item.delegate('label', 'click', function (e) {
							e.preventDefault();
						});

						//注册change事件
						$inputs.on('change', function (e) {
							$(this).parent().addClass('z-current').siblings().removeClass('z-current');
						}).filter(':checked').change();

						//默认选中
						if($inputs.filter(':checked').length == 0){
							$inputs.first().prop('checked', true)
						};

						//切换效果
						(function () {
							var subWidth = $item.width() * 0.75;
							$item.find('label').width(subWidth);
							$item.find('ul').width($liItems.width(subWidth).length * subWidth);
							//实例化iscroll
							var iscroll = new IScroll(item.children[0], {
								scrollX: true,
								scrollY: false,
								momentum: false,
								snap: true,
								snapSpeed: subWidth,
								keyBindings: true
							});
							theClass._switchIscrolls.push(iscroll);
							//注册scrollEnd事件
							iscroll.on('scrollEnd', function (e) {
								$inputs.eq(iscroll.currentPage.pageX).prop('checked', true).trigger('change');
							});
							var $checkedInput = $inputs.filter(':checked');
							if($checkedInput.length > 0){
								iscroll.scrollToElement($checkedInput.parent()[0], 0);
								//修复 scrollToElement 后调用 iscroll.refresh() 会复位的问题
								iscroll.currentPage.pageX = $checkedInput.parent().index();
							}
						})();
					});

					//修复 Android 4.4以上的问题
					var $body = $('body').height(window.innerHeight);
					var isIPhone = navigator.userAgent.indexOf('iPhone') >= 0;
					var isAndroid = navigator.userAgent.indexOf('Android') >= 0;
					var osVersion = 0;
					if(isIPhone){
						osVersion = (osVersion = (/iPhone\s*OS\s*(\d+[\_|.\d+]+)/ig).exec(navigator.userAgent)) ? osVersion[1].replace(/\_/ig,'.') : '0';
					}else if(isAndroid){
						osVersion= (osVersion = (/Android\s*(\d+[\.\d+]+)/ig).exec(navigator.userAgent)) ? osVersion[1] : '0';
					}
					var reHeight = window.innerHeight;
					var lastHeight = window.innerHeight;
					var resizeTimeout;
					$(window).resize(function () {
						if(window.innerHeight < lastHeight){
							clearTimeout(resizeTimeout);
							resizeTimeout = setTimeout(function () {
								/*if(!isIPhone && (isAndroid && osVersion < '4.4')){
									$body.css('-webkit-transform','translateY(-30%);');
								}*/
							}, 100);
						}else if(window.innerHeight == reHeight){
							/*if(!isIPhone && (isAndroid && osVersion < '4.4')){
								$body.css('-webkit-transform','translateY(0%);');
							}*/
							if(isAndroid && osVersion >= '4.4'){
								$body.height(window.innerHeight + 1);
							}
							//避免与其它使用touch控制的控件相冲突
							$('input:focus').blur();
						}
						lastHeight = window.innerHeight;
					});

					//控件：interestRateEditor
					$form.find('.interestRateEditor').each(function (i, item) {
						var $item = $(item);
						//点击编辑
						$item.delegate('.linkEdit', 'click', function (e) {
							$body.height(window.innerHeight);
							$item.find('input').removeAttr('disabled').focus();
						});
						//完成编辑
						$item.delegate('input', 'blur', function (e) {
							var $this = $(this);
							if(isNaN($this.val())){
								tip.warning('利率格式有误，请重新填写！');
								$this.val('').focus();
								return false;
							}else{
								$this.attr('disabled', 'disabled');
							}
						});
					});
				})();

				//初始化业务功能
				(function () {
					//初始化结果遮罩层
					theClass.$calculatorResultLayer.maskLayer({ closeButton: false });
					theClass.calculatorResultLayer = theClass.$calculatorResultLayer.maskLayer('getPluginObject');

					//贷款类型切换
					var $lendingRates = $form.find('input[name="lendingRates"]');
					var $commercialInterestRates = $form.find('input[name="commercialInterestRates"]');
					var $fundLoanInterestRates = $form.find('input[name="fundLoanInterestRates"]');
					var baseCommercialLendingRates = parseFloat($commercialInterestRates.data('base'));
					var baseFundLoanInterestRates = parseFloat($fundLoanInterestRates.data('base'));
					$form.delegate('input[name="loanType"]', 'change', function (e) {
						var $this = $(this);
						$form.removeClass('z-commercialLoans z-fundLoans z-portfolioLoans');
						$form.addClass('z-' + $this.val());
						theClass.loanType = $this.val();
						switch($this.val()){
							case 'commercialLoans':
								$lendingRates.val(baseCommercialLendingRates);
							break;
							case 'fundLoans':
								$lendingRates.val(baseFundLoanInterestRates);
							break;
							case 'portfolioLoans':
								$commercialInterestRates.val(baseCommercialLendingRates);
								$fundLoanInterestRates.val(baseFundLoanInterestRates);
							break;
						}
						//修复switch2中的IScroll
						theClass._fixSwitchIScroll();
					});

					//利率类型切换
					$form.delegate('input[name="interestRateType"]', 'change', function (e) {
						if(theClass.loanType != 'fundLoans'){
							//重新计算商业贷款利率
							var interestRateType = parseFloat($(this).val());
							var interestRate = (baseCommercialLendingRates * interestRateType).toFixed(2);
							$lendingRates.val(interestRate);
							$commercialInterestRates.val(interestRate);
						}
					});

					//验证数字
					$form.delegate('input[type="tel"]', 'change', function (e) {
						var $this = $(this);
						if(isNaN($this.val())){
							tip.warning('请输入正确的数字！');
							return $this.val('').focus();
						}
					});

					//表单提交事件
					$form.on('submit', function (e) {
						e.preventDefault();
						//计算
						theClass._calculator();
					});
				})();
			});
		}
	};

	//计算
	MortgageCalculator.prototype._calculator = function() {
		var $form = this.$formCalculator;
		var loanType = this.$formCalculator.find('input[name="loanType"]:checked').val();
		var repayment = this.$formCalculator.find('input[name="repayment"]:checked').val();
		
		//商业贷款或公积金贷款
		if(loanType != 'portfolioLoans'){
			//获取相关控件对象
			var $calculatorType = $form.find('input[name="calculatorType"]:checked'),
				$area = $form.find('input[name="area"]'),
				$unitPrice = $form.find('input[name="unitPrice"]'),
				$ltv = $form.find('input[name="ltv"]:checked'),
				$total = $form.find('input[name="total"]'),
				$lendingRates = $form.find('input[name="lendingRates"]'),
				$mortgageYears = $form.find('input[name="mortgageYears"]:checked');
			//定义参数变量
			var housingFundTotal = 0, downPaymentTotal = 0;
			var je = 0, lv = 0, qx = 0, lvlx = 1;
			//计算贷款金额
			if($calculatorType.val() == 1){
				//数据验证
				if($.trim($area.val()).length == 0){
					tip.warning('请输入面积！');
					return $area.focus();
				}
				if($.trim($unitPrice.val()).length == 0){
					tip.warning('请输入单价！');
					return $unitPrice.focus();
				}
				//计算
				var area = parseFloat($area.val()),
					unitPrice = parseFloat($unitPrice.val()),
					ltv = parseInt($ltv.val()) / 10;
				housingFundTotal = (area * unitPrice);
				je = housingFundTotal * ltv;
				downPaymentTotal = housingFundTotal - je;
			}else{
				//数据验证
				if($.trim($total.val()).length == 0){
					tip.warning('请输入总额！');
					return $total.focus();
				}
				//计算
				je = 10000 * parseFloat($total.val());
				housingFundTotal = 0;
			}
			//数据验证
			if($.trim($lendingRates.val()).length == 0){
				tip.warning('请输入利率！');
				return $lendingRates.focus();
			}
			//计算
			lv = parseFloat($lendingRates.val());
			qx = parseInt($mortgageYears.val());
			//计算结果
			var jsResult = repayment == 'debx' ? loanCalculator.debx(je, lv, qx, lvlx) : loanCalculator.debj(je, lv, qx, lvlx);
			//包装结果数据
			var result = {
				housingFundTotal : housingFundTotal,
				loansTotal : je,
				repaymentTotal : jsResult.hkze.toFixed(2),
				interestTotal : jsResult.zlx.toFixed(2),
				downPaymentTotal : downPaymentTotal,
				monthTotal : repayment == 'debx' ? jsResult.yhk.toFixed(2) : jsResult.syhk.toFixed(2),
				months : qx
			};
			//显示结果
			this._showResult(result);
		}else{
			//获取相关控件对象
			var $commercialTotal = $form.find('input[name="commercialTotal"]'),
				$commercialInterestRates = $form.find('input[name="commercialInterestRates"]'),
				$fundLoanTotal = $form.find('input[name="fundLoanTotal"]'),
				$fundLoanInterestRates = $form.find('input[name="fundLoanInterestRates"]'),
				$mortgageYears = $form.find('input[name="mortgageYears"]:checked');

			//数据验证
			if($.trim($commercialTotal.val()).length == 0){
				tip.warning('请输入商业贷款金额！');
				return $commercialTotal.focus();
			}
			if($.trim($fundLoanTotal.val()).length == 0){
				tip.warning('请输入公积金贷款金额！');
				return $fundLoanTotal.focus();
			}
			if($.trim($commercialInterestRates.val()).length == 0){
				tip.warning('请输入商业贷款利率！');
				$commercialInterestRates.closest('.interestRateEditor').find('.linkEdit').click();
				return false;
			}
			if($.trim($fundLoanInterestRates.val()).length == 0){
				tip.warning('请输入公积金贷款利率！');
				$fundLoanInterestRates.closest('.interestRateEditor').find('.linkEdit').click();
				return false;
			}

			//定义参数变量
			var je = 0, lv = 0, qx = parseInt($mortgageYears.val()), lvlx = 1;
			//计算商业贷款结果
			var commercialResult = (function () {
				//计算贷款金额
				je = 10000 * parseFloat($commercialTotal.val());
				lv = parseFloat($commercialInterestRates.val());
				//计算并返回结果
				var jsResult = repayment == 'debx' ? loanCalculator.debx(je, lv, qx, lvlx) : loanCalculator.debj(je, lv, qx, lvlx);
				jsResult.je = je;
				return jsResult;
			})();

			//计算公积金贷款结果
			var fundLoanResult = (function () {
				//计算贷款金额
				je = 10000 * parseFloat($fundLoanTotal.val());
				lv = parseFloat($fundLoanInterestRates.val());
				//计算并返回结果
				var jsResult = repayment == 'debx' ? loanCalculator.debx(je, lv, qx, lvlx) : loanCalculator.debj(je, lv, qx, lvlx);
				jsResult.je = je;
				return jsResult;
			})();

			//整合商业贷款和公积金贷款结果
			var result = {
				housingFundTotal : 0,
				loansTotal : (commercialResult.je + fundLoanResult.je).toFixed(),
				repaymentTotal : (commercialResult.hkze + fundLoanResult.hkze).toFixed(2),
				interestTotal : (commercialResult.zlx + fundLoanResult.zlx).toFixed(2),
				downPaymentTotal : 0,
				monthTotal : repayment == 'debx' ? (commercialResult.yhk + fundLoanResult.yhk).toFixed(2) : (commercialResult.syhk + fundLoanResult.syhk).toFixed(2),
				months : qx
			};

			//显示结果
			this._showResult(result);
		}
	};

	//显示计算结果
	MortgageCalculator.prototype._showResult = function(result) {
		//初始化值
		var result = $.extend({
			housingFundTotal : 0,
			loansTotal : 0,
			repaymentTotal : 0,
			interestTotal : 0,
			downPaymentTotal : 0,
			monthTotal : 0,
			months : 0
		}, result);

		//转换数据格式并输出到页面
		for(var key in result){
			var value = result[key];
			if(value && key != 'months'){
				value = (value / 10000).toFixed(2);
			}
			var number1 = '';
			var valueArr = value.toString().split('.');
			number1 = valueArr[0];
			if(number1.length > 3){
				var r=number1.length % 3;
	   			number1 = r > 0 ? number1.slice(0,r)+","+number1.slice(r,number1.length).match(/\d{3}/g).join(","):number1.slice(r,number1.length).match(/\d{3}/g).join(",");
	   			value = number1;
	   			if(valueArr.length > 1){
	   				value += '.' + valueArr[1];
	   			}
			}
			if((key == 'housingFundTotal' || key == 'downPaymentTotal') && value == 0){
				$('#'+ key).closest('dl').hide();
			}else{
				$('#'+ key).closest('dl').show();
			}
			document.getElementById(key).innerText = value;
		}
		this.calculatorResultLayer.show();
	};

	//设置字段值
	MortgageCalculator.prototype.setFields = function(fields) {
		if(fields){
			//循环设置字段值
			for(var key in fields){
				var $field = this.$formCalculator.find('input[name="'+ key +'"]');
				switch($field.prop('nodeType')){
					case 'radio':
						$field.filter('[value="'+ fields[key] +'"]').prop('checked', true);
					break;
					case 'checkbox':
						$field.filter('[value="'+ fields[key] +'"]').prop('checked', true);
					break;
					case 'select':
						$field.children('[value="'+ fields[key] +'"]').prop('selected', true);
					break;
					default:
						$field.val(fields[key]);
					break;
				}
			}
		}
	};

	//显示
	MortgageCalculator.prototype.show = function() {
		//初始化
		this._init();
		this.mortgageCalculatorLayer.show();
	};

	//隐藏
	MortgageCalculator.prototype.hide = function() {
		this.mortgageCalculatorLayer.hide();
	};

	//提供模块接口
	module.exports = new MortgageCalculator();
});