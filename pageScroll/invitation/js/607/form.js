$(function() {
    var default_sub = $("#form_submit_btn").html();
    $("#form_name,#form_tel").focus(function() {
        $("#form_submit_btn").removeAttr("disabled");
    });
    $("#form_submit_btn").click(function() {
        var success_msg = $.trim($(this).attr('data-seccess-msg'));
        if (success_msg == '') {
            success_msg = '您的信息已提交成功！';
        }
        var obj = $(this);
        var activity_id = parseInt($(this).attr('data-activity'));
        var name = $.trim($("#form_name").val());
        var name_tip = $("#form_name").attr('placeholder');
        var tel = $.trim($("#form_tel").val());
        var tel_tip = $("#form_tel").attr('placeholder');
        var sex = $.trim($("input[name=sex]:checked").val()); //判定性别

        //验证名称
        if (name == '') {
            dialogShow('', '请输入' + name_tip + '！');
            return;
        }

        // if (name_tip.indexOf('电话')>-1 || name_tip.indexOf('手机')>-1) {
        // 	var patrn=/(^[0-9]{3,3}\-[0-9]{3,3}\-[0-9]{4,4}$)|(^[0-9]{3,4}\-[0-9]{7,8}$)|(^[0-9]{7,10}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)|(13\d{9}$)|(15[0135-9]\d{8}$)|(18[0326789]\d{8}$)/;
        // 	if ( !name.match(patrn)) {
        // 		dialogShow('','请输入正确格式的'+name_tip+'! ');
        // 		return;
        // 	}
        // }
        
        if (tel == '') {
            dialogShow('', '请输入' + tel_tip + '！');
            return;
        }
        if (tel_tip.indexOf('电话') > -1 || tel_tip.indexOf('手机') > -1 || tel_tip.indexOf('号码') > -1) {
            var patrn = /^1[0-9]{10}$/;
            if (!tel.match(patrn)) {
                dialogShow('', '请输入正确格式的' + tel_tip + '! ');
                return;
            }
        }
        
        if (activity_id > 0 && tel != '') {
            $.ajax({
                type: "POST",
                url: "/form/submit/" + activity_id,
                data: "name=" + name + "&tel=" + tel + "&activity_id= " + activity_id + "&sex=" + sex,
                dataType: "json",
                success: function(result) {
                    if (result.success) {
                        obj.attr('disabled', 'disabled');
                        obj.removeClass('btn-warning');
                        obj.addClass('btn-success');
                        if (result.data == 1) {
                            obj.html('重复提交');
                            dialogShow('', '您的信息已提交，无需重复提交！');
                        } else { //提示语修改
                            dialogShow('', success_msg);
                            obj.html('提交成功');
                        }
                    } else {
                        alert(result.message);
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
});

