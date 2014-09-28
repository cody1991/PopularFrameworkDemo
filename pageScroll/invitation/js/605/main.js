 // JavaScript Document
/* 控制页面模块 m-list02 左右高度相等 */
$(function() {
    /*envelope effect效果样式*/
    var fn_h = function() {
        if (document.compatMode == "BackCompat")
            var Node = document.body;
        else
            var Node = document.documentElement;
        return Math.max(Node.scrollHeight, Node.clientHeight);
    }
    var page_h = fn_h();
    var bd = $(document.body);
    var envelop = $(".fn-envelop");
    var index = $(".p-index");
    var initP;
    var initPx;
    var lastP;
    var lastPx;
    bd.height(page_h);
    envelop.on('click', en_open);
    envelop.on('touchmove', en_open);
    index.on('touchstart', function() {
        var touch = event.targetTouches[0];
        // 把元素放在手指所在的位置
        initP = touch.pageY;
        initPx = touch.pageX;
    })
    index.on('touchmove', function(e) {
        var touch = event.targetTouches[0];
        // 把元素放在手指所在的位置
        lastP = touch.pageY;
        lastPx = touch.pageX;
        var sTop = bd.scrollTop();
        var xChange = Math.abs(lastPx - initPx);
        var yChange = lastP - initP;
        //alert(xChange+'-'+yChange);
        if (sTop <= 0 && yChange >= 30 && yChange > xChange) {
            en_close(e);
        }
    })
    
    function en_open(e) {
        e.preventDefault();
        envelop.addClass("open");
        setTimeout(function() {
            envelop.addClass('finish');
            $(".p-index").addClass("show");
        }, 1000)
    }
    
    function en_close(e) {
        envelop.removeClass("open");
        setTimeout(function() {
            envelop.removeClass('finish');
            $(".p-index").removeClass("show");
        }, 1000)
    }
})

/* 图片lazy延迟加载 */
$(function() {
    $("img.lazy-image").lazyload({
        failure_limit: 10,
        threshold: 200
    });
})

$(function() {
    /*招聘list02列表 左边头像垂直居中*/
    $(".m-list02").find("p").each(function() {
        var eleH = $(this).next("dl").innerHeight();
        $(this).css({'height': eleH});
        $(this).children().css({'margin-top': eleH / 2});
    });
    
    $('.view-big-image').click(function(e) {
        $('#over-box').height($(window).height()).show();
        var _newImg = $('#over-box').find('img');
        _newImg.attr('src', $(this).find('img').attr('src'));
        var _img = new Image();
        _img.src = $(this).find('img').attr('src');
        if (_img.width >= $(window).width()) {
            var _scl = $(window).width() / _img.width;
            _newImg.width($(window).width()).height(_img.height * _scl).css('margin-top', ($(window).height() - _img.height * _scl) / 2);
        } else {
            _newImg.width(_img.width).height(_img.height).css('margin-top', ($(window).height() - _img.height) / 2);
        }
    });
    
    $('#over-box').on('click', function(e) {
        $(this).hide();
    });

});



















