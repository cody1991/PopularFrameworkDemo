define(function(require, exports, module) {
    var ObjectUtil = function() {
    };
    ObjectUtil.prototype.createEmptyObject = function(classFunction) {
        var emptyObject = {}, emptyFunction = function() {
        };
        if ("function" == typeof classFunction)
            for (var key in classFunction.prototype)
                "function" == typeof classFunction.prototype[key] && (emptyObject[key] = emptyFunction);
        return emptyObject
    };
    var objectUtil = new ObjectUtil;
    module.exports = objectUtil
});
