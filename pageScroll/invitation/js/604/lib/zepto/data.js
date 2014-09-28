define(function(require, exports, module) {
    var Zepto = require("./zepto");
    module.exports = Zepto, function($) {
        function getData(node, name) {
            var id = node[exp], store = id && data[id];
            if (void 0 === name)
                return store || setData(node);
            if (store) {
                if (name in store)
                    return store[name];
                var camelName = camelize(name);
                if (camelName in store)
                    return store[camelName]
            }
            return dataAttr.call($(node), name)
        }
        function setData(node, name, value) {
            var id = node[exp] || (node[exp] = ++$.uuid), store = data[id] || (data[id] = attributeData(node));
            return void 0 !== name && (store[camelize(name)] = value), store
        }
        function attributeData(node) {
            var store = {};
            return $.each(node.attributes || emptyArray, function(i, attr) {
                0 == attr.name.indexOf("data-") && (store[camelize(attr.name.replace("data-", ""))] = $.zepto.deserializeValue(attr.value))
            }), store
        }
        var data = {}, dataAttr = $.fn.data, camelize = $.camelCase, exp = $.expando = "Zepto" + +new Date, emptyArray = [];
        $.fn.data = function(name, value) {
            return void 0 === value ? $.isPlainObject(name) ? this.each(function(i, node) {
                $.each(name, function(key, value) {
                    setData(node, key, value)
                })
            }) : 0 == this.length ? void 0 : getData(this[0], name) : this.each(function() {
                setData(this, name, value)
            })
        }, $.fn.removeData = function(names) {
            return "string" == typeof names && (names = names.split(/\s+/)), this.each(function() {
                var id = this[exp], store = id && data[id];
                store && $.each(names || store, function(key) {
                    delete store[names ? camelize(this) : key]
                })
            })
        }, ["remove", "empty"].forEach(function(methodName) {
            var origFn = $.fn[methodName];
            $.fn[methodName] = function() {
                var elements = this.find("*");
                return "remove" === methodName && (elements = elements.add(this)), elements.removeData(), origFn.call(this)
            }
        })
    }(Zepto)
});
