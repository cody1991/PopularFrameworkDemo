jQuery(function(){
	var submitNowYear;
	var default_sub = $("#form_submit_btn").html();
	$("#look-house-input input").focus(function(){
		$("#form_submit_btn").removeAttr("disabled");
	});
	$("#form_submit_btn").on('swipeclick', function(){
			if(submitNowYear == '' || submitNowYear ==undefined){
				var _now = new Date();
				submitNowYear = _now.getFullYear();
			}
			var _month=parseInt($('select[name="month"]').val(),10)-1;
			var _day=parseInt($('select[name="day"]').val(),10);
			var _date=new Date(submitNowYear,_month,_day,0,0,0);
			var lookTime=''+(parseInt(Date.parse(_date))/1000);
			var success_msg = $.trim($('#look-house-input').find('input[name="success_msg"]').val());
			var activity_id = parseInt($('#activity_id').html(),10);
			if (success_msg == '') {
				success_msg = '您的信息已提交成功！';
			} 
			var obj = $(this);
			
			var name = $.trim(obj.parents('#look-house-input').find('input[name="name"]').val());
			var name_text = $.trim(obj.parents('#look-house-input').find('input[name="name"]').prev().html());
			var tel = $.trim(obj.parents('#look-house-input').find('input[name="mobile"]').val());
			var tel_text = $.trim(obj.parents('#look-house-input').find('input[name="mobile"]').prev().html());
			//验证名称
			if(name==''){
				dialogShow('','请输入'+name_text);
				return;
			}
			if(tel == ''){
				dialogShow('','请输入'+tel_text);
				return;
			}
			if(tel.length > 15 || !tel.match(/^\d+$/)){
				dialogShow('','请输入正确格式的'+tel_text);
				return;
			}
			
			if(lookTime == ''){
				dialogShow('','请选择您想看房的时间！');
				return;
			}

			if ( activity_id>0 && tel!='') {
				$.ajax({
					   type: "POST",
					   url: "/realty/submit/"+activity_id,
					   data: "name="+name+"&tel="+tel+"&look_time="+lookTime,
					   dataType: "json",
					   success: function(result){
						   if(result.success){
								obj.attr('disabled','disabled');
								obj.removeClass('btn-warning');
								obj.addClass('btn-success');
								if (result.data==1) {
									obj.html('重复提交');
									dialogShow('','您的信息已提交，无需重复提交！');
								} else {//提示语修改
									dialogShow('',success_msg);
									obj.html('提交成功');
								}
							}else{
								alert(result.message);
							}
					   }
					});
			}
			
			
			$.ajax({
				   type: "get",
				   url: "/analyseplugin/plugin?activity_id= " + activity_id + "&plugtype=form",
				   dataType: "json",
				   success: function(msg){
					   if(msg.result==1){
						   //alert('操作成功！');
						}else{
							//alert("操作失败，" + msg.msg);
						}
				   }
				});
	});
	
	$('select[name="month"]').change(function(e){
		var dayHtml='';
		var month = parseInt($(this).val(),10)-1;
		var today = new Date();
		
		if(month >= (today.getMonth()) )
		{
			submitNowYear = today.getFullYear();
		}else{
			submitNowYear = today.getFullYear()+1;
		}
		
		var _day = new Date(submitNowYear,month+1,0);
		for(var j=1;j<=_day.getDate();j++){
			dayHtml+='<option value="'+j+'" >'+j+'日</option>';
		}
		$('select[name="day"]').empty().html(dayHtml);
	});
	
	$('select[name="day"]').change(function(e){
		var chooseMonth = parseInt($('select[name="month"]').val(),10)-1;
		var today = new Date();
		if(chooseMonth<today.getMonth() || (chooseMonth == today.getMonth() && parseInt($(this).val(),10) < today.getDate())){
			submitNowYear = today.getFullYear()+1;
		}
	});
	
	$('div[data-status]').on('click',function(){
		var top = $(this).css('top');
		if($(this).hasClass('swipe-click')){
			$(this).find('img').toggle();			
		}
	});
	
});