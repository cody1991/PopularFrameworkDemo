define(function(require, exports, module) {
    var $ = require("lib/zepto/zepto");
    $ = require("./cascadingTeletext");
    var $teletextPages = $(".page-teletext");
    module.exports = {init: function() {
            $teletextPages.each(function(i, item) {
                console.log("teletext init"), $page = $(item);
                var $cascadingTeletext = $page.find(".m-cascadingTeletext").cascadingTeletext();
                $page.on("active", function() {
                    console.log("teletext active"), $cascadingTeletext.removeClass("z-viewArea").find("li.z-current").removeClass("z-current")
                }).on("current", function() {
                    console.log("teletext current"), $cascadingTeletext.addClass("z-viewArea"), setTimeout(function() {
                        $cascadingTeletext.find("li:first").addClass("z-current")
                    }, 1800)
                })
            })
        }}
});
