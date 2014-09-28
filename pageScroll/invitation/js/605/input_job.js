jQuery(function() {
    var default_sub = $("#form_submit_btn").html();
    $("#submit-job input").focus(function() {
        $("#form_submit_btn").removeAttr("disabled");
    });
    $("#form_submit_btn").click(function() {
        var obj = $(this);
        
        var success_msg = $.trim(obj.parents('#submit-job').find('input[name="success_msg"]').val());
        var activity_id = parseInt($('#activity_id').html(), 10);
        if (success_msg == '') {
            success_msg = '您的信息已提交成功！';
        }
        
        var form_name = obj.parents('#submit-job').find('input[name="name"]');
        var name = $.trim(form_name.val());
        var name_tip = $.trim(form_name.attr('placeholder'));
        
        var form_tel = obj.parents('#submit-job').find('input[name="mobile"]');
        var tel = $.trim(form_tel.val());
        var tel_tip = $.trim(form_tel.attr('placeholder'));
        
        var form_job = obj.parents('#submit-job').find('input[name="job"]');
        var job = $.trim(form_job.val());
        
        var select_job = $.trim(obj.parents('#submit-job').find('select[name="job"]').val());
        //验证名称
        if (name == '') {
            form_verity('请输入' + name_tip);
            return;
        }
        if (!name.match(/^[\u4e00-\u9fa5|a-z|A-Z|\s]{1,20}$/)) {
            form_verity('输入的姓名含有特殊字符');
            return;
        }
        if (tel == '') {
            form_verity('请输入' + tel_tip);
            return;
        }
        if (tel.length != 11 || !tel.match(/^1[0-9][0-9]\d{8}$/)) {
            form_verity('请输入正确的' + tel_tip);
            return;
        }
        
        if (job == '' && select_job == '') {
            form_verity('请输入您感兴趣的工作！');
            return;
        }
        
        if (activity_id > 0 && tel != '') {
            if (job == '') {
                job = select_job;
            }
            $.ajax({
                type: "POST",
                url: "/job/submit/" + activity_id,
                data: "name=" + name + "&mobile=" + tel + "&job= " + job,
                dataType: "json",
                success: function(result) {
                    if (result.success) {
                        //								obj.attr('disabled','disabled');
                        obj.removeClass('btn-warning');
                        obj.addClass('btn-success');
                        if (result.data == 1) {
                            obj.html('重复提交');
                            form_verity('您的信息已提交，无需重复提交！');
                        } else { //提示语修改
                            form_verity(success_msg);
                            obj.html('提交成功');
                        }
                    } else {
                        form_verity(result.message);
                    }
                }
            });
        }
        
        $.ajax({
            type: "get",
            url: "/analyseplugin/plugin?activity_id= " + activity_id + "&plugtype=form",
            dataType: "json",
            success: function(msg) {
                if (msg.result == 1) {
                //alert('操作成功！');
                } else {
                //alert("操作失败，" + msg.msg);
                }
            }
        });
    });
    /**
	 * 表单验证提示信息
	 */
    function form_verity(content) {
        $('.form_verity>span').text('');
        $('.form_verity>span').text(content);
        $('.form_verity').show();
        setTimeout(function(msg) {
            $('.form_verity').hide();
        }, '3000');
    }
});

