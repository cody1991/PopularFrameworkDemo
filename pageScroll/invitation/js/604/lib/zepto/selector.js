define(function(require, exports, module) {
    var Zepto = require("./zepto");
    module.exports = Zepto, function($) {
        function visible(elem) {
            return elem = $(elem), !(!elem.width() && !elem.height()) && "none" !== elem.css("display")
        }
        function process(sel, fn) {
            sel = sel.replace(/=#\]/g, '="#"]');
            var filter, arg, match = filterRe.exec(sel);
            if (match && match[2] in filters && (filter = filters[match[2]], arg = match[3], sel = match[1], arg)) {
                var num = Number(arg);
                arg = isNaN(num) ? arg.replace(/^["']|["']$/g, "") : num
            }
            return fn(sel, filter, arg)
        }
        var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches, filters = $.expr[":"] = {visible: function() {
                return visible(this) ? this : void 0
            },hidden: function() {
                return visible(this) ? void 0 : this
            },selected: function() {
                return this.selected ? this : void 0
            },checked: function() {
                return this.checked ? this : void 0
            },parent: function() {
                return this.parentNode
            },first: function(idx) {
                return 0 === idx ? this : void 0
            },last: function(idx, nodes) {
                return idx === nodes.length - 1 ? this : void 0
            },eq: function(idx, _, value) {
                return idx === value ? this : void 0
            },contains: function(idx, _, text) {
                return $(this).text().indexOf(text) > -1 ? this : void 0
            },has: function(idx, _, sel) {
                return zepto.qsa(this, sel).length ? this : void 0
            }}, filterRe = new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*"), childRe = /^\s*>/, classTag = "Zepto" + +new Date;
        zepto.qsa = function(node, selector) {
            return process(selector, function(sel, filter, arg) {
                try {
                    var taggedParent;
                    !sel && filter ? sel = "*" : childRe.test(sel) && (taggedParent = $(node).addClass(classTag), sel = "." + classTag + " " + sel);
                    var nodes = oldQsa(node, sel)
                } catch (e) {
                    throw console.error("error performing selector: %o", selector), e
                }finally {
                    taggedParent && taggedParent.removeClass(classTag)
                }
                return filter ? zepto.uniq($.map(nodes, function(n, i) {
                    return filter.call(n, i, nodes, arg)
                })) : nodes
            })
        }, zepto.matches = function(node, selector) {
            return process(selector, function(sel, filter, arg) {
                return !(sel && !oldMatches(node, sel) || filter && filter.call(node, null, arg) !== node)
            })
        }
    }(Zepto)
});
