 // 行为数据统计
$("div[data-statis='info_nomore']").bind('click touchstart', function() {
    var activity_id = $('#activity_id').html();
    $.getJSON('/analyseplugin/plugin', {'activity_id': activity_id,'plugtype': 'info_nomore'}, function(response) {
        if (response.success) {
        // 统计成功, do none thing
        }
    });
});
