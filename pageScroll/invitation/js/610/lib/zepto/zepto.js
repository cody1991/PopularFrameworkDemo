define(function(require, exports, module) {
    var Zepto = function() {
        function type(obj) {
            return null == obj ? String(obj) : class2type[toString.call(obj)] || "object"
        }
        function isFunction(value) {
            return "function" == type(value)
        }
        function isWindow(obj) {
            return null != obj && obj == obj.window
        }
        function isDocument(obj) {
            return null != obj && obj.nodeType == obj.DOCUMENT_NODE
        }
        function isObject(obj) {
            return "object" == type(obj)
        }
        function isPlainObject(obj) {
            return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
        }
        function likeArray(obj) {
            return "number" == typeof obj.length
        }
        function compact(array) {
            return filter.call(array, function(item) {
                return null != item
            })
        }
        function flatten(array) {
            return array.length > 0 ? $.fn.concat.apply([], array) : array
        }
        function dasherize(str) {
            return str.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
        }
        function classRE(name) {
            return name in classCache ? classCache[name] : classCache[name] = new RegExp("(^|\\s)" + name + "(\\s|$)")
        }
        function maybeAddPx(name, value) {
            return "number" != typeof value || cssNumber[dasherize(name)] ? value : value + "px"
        }
        function defaultDisplay(nodeName) {
            var element, display;
            return elementDisplay[nodeName] || (element = document.createElement(nodeName), document.body.appendChild(element), display = getComputedStyle(element, "").getPropertyValue("display"), element.parentNode.removeChild(element), "none" == display && (display = "block"), elementDisplay[nodeName] = display), elementDisplay[nodeName]
        }
        function children(element) {
            return "children" in element ? slice.call(element.children) : $.map(element.childNodes, function(node) {
                return 1 == node.nodeType ? node : void 0
            })
        }
        function extend(target, source, deep) {
            for (key in source)
                deep && (isPlainObject(source[key]) || isArray(source[key])) ? (isPlainObject(source[key]) && !isPlainObject(target[key]) && (target[key] = {}), isArray(source[key]) && !isArray(target[key]) && (target[key] = []), extend(target[key], source[key], deep)) : source[key] !== undefined && (target[key] = source[key])
        }
        function filtered(nodes, selector) {
            return null == selector ? $(nodes) : $(nodes).filter(selector)
        }
        function funcArg(context, arg, idx, payload) {
            return isFunction(arg) ? arg.call(context, idx, payload) : arg
        }
        function setAttribute(node, name, value) {
            null == value ? node.removeAttribute(name) : node.setAttribute(name, value)
        }
        function className(node, value) {
            var klass = node.className, svg = klass && klass.baseVal !== undefined;
            return value === undefined ? svg ? klass.baseVal : klass : void (svg ? klass.baseVal = value : node.className = value)
        }
        function deserializeValue(value) {
            var num;
            try {
                return value ? "true" == value || ("false" == value ? !1 : "null" == value ? null : /^0/.test(value) || isNaN(num = Number(value)) ? /^[\[\{]/.test(value) ? $.parseJSON(value) : value : num) : value
            } catch (e) {
                return value
            }
        }
        function traverseNode(node, fun) {
            fun(node);
            for (var key in node.childNodes)
                traverseNode(node.childNodes[key], fun)
        }
        var undefined, key, $, classList, camelize, uniq, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter, document = window.document, elementDisplay = {}, classCache = {}, cssNumber = {"column-count": 1,columns: 1,"font-weight": 1,"line-height": 1,opacity: 1,"z-index": 1,zoom: 1}, fragmentRE = /^\s*<(\w+|!)[^>]*>/, singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rootNodeRE = /^(?:body|html)$/i, capitalRE = /([A-Z])/g, methodAttributes = ["val", "css", "html", "text", "data", "width", "height", "offset"], adjacencyOperators = ["after", "prepend", "before", "append"], table = document.createElement("table"), tableRow = document.createElement("tr"), containers = {tr: document.createElement("tbody"),tbody: table,thead: table,tfoot: table,td: tableRow,th: tableRow,"*": document.createElement("div")}, readyRE = /complete|loaded|interactive/, simpleSelectorRE = /^[\w-]*$/, class2type = {}, toString = class2type.toString, zepto = {}, tempParent = document.createElement("div"), propMap = {tabindex: "tabIndex",readonly: "readOnly","for": "htmlFor","class": "className",maxlength: "maxLength",cellspacing: "cellSpacing",cellpadding: "cellPadding",rowspan: "rowSpan",colspan: "colSpan",usemap: "useMap",frameborder: "frameBorder",contenteditable: "contentEditable"}, isArray = Array.isArray || function(object) {
            return object instanceof Array
        };
        return zepto.matches = function(element, selector) {
            if (!selector || !element || 1 !== element.nodeType)
                return !1;
            var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector)
                return matchesSelector.call(element, selector);
            var match, parent = element.parentNode, temp = !parent;
            return temp && (parent = tempParent).appendChild(element), match = ~zepto.qsa(parent, selector).indexOf(element), temp && tempParent.removeChild(element), match
        }, camelize = function(str) {
            return str.replace(/-+(.)?/g, function(match, chr) {
                return chr ? chr.toUpperCase() : ""
            })
        }, uniq = function(array) {
            return filter.call(array, function(item, idx) {
                return array.indexOf(item) == idx
            })
        }, zepto.fragment = function(html, name, properties) {
            var dom, nodes, container;
            return singleTagRE.test(html) && (dom = $(document.createElement(RegExp.$1))), dom || (html.replace && (html = html.replace(tagExpanderRE, "<$1></$2>")), name === undefined && (name = fragmentRE.test(html) && RegExp.$1), name in containers || (name = "*"), container = containers[name], container.innerHTML = "" + html, dom = $.each(slice.call(container.childNodes), function() {
                container.removeChild(this)
            })), isPlainObject(properties) && (nodes = $(dom), $.each(properties, function(key, value) {
                methodAttributes.indexOf(key) > -1 ? nodes[key](value) : nodes.attr(key, value)
            })), dom
        }, zepto.Z = function(dom, selector) {
            return dom = dom || [], dom.__proto__ = $.fn, dom.selector = selector || "", dom
        }, zepto.isZ = function(object) {
            return object instanceof zepto.Z
        }, zepto.init = function(selector, context) {
            var dom;
            if (!selector)
                return zepto.Z();
            if ("string" == typeof selector)
                if (selector = selector.trim(), "<" == selector[0] && fragmentRE.test(selector))
                    dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
                else {
                    if (context !== undefined)
                        return $(context).find(selector);
                    dom = zepto.qsa(document, selector)
                }
            else {
                if (isFunction(selector))
                    return $(document).ready(selector);
                if (zepto.isZ(selector))
                    return selector;
                if (isArray(selector))
                    dom = compact(selector);
                else if (isObject(selector))
                    dom = [selector], selector = null;
                else if (fragmentRE.test(selector))
                    dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
                else {
                    if (context !== undefined)
                        return $(context).find(selector);
                    dom = zepto.qsa(document, selector)
                }
            }
            return zepto.Z(dom, selector)
        }, $ = function(selector, context) {
            return zepto.init(selector, context)
        }, $.extend = function(target) {
            var deep, args = slice.call(arguments, 1);
            return "boolean" == typeof target && (deep = target, target = args.shift()), args.forEach(function(arg) {
                extend(target, arg, deep)
            }), target
        }, zepto.qsa = function(element, selector) {
            var found, maybeID = "#" == selector[0], maybeClass = !maybeID && "." == selector[0], nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, isSimple = simpleSelectorRE.test(nameOnly);
            return isDocument(element) && isSimple && maybeID ? (found = element.getElementById(nameOnly)) ? [found] : [] : 1 !== element.nodeType && 9 !== element.nodeType ? [] : slice.call(isSimple && !maybeID ? maybeClass ? element.getElementsByClassName(nameOnly) : element.getElementsByTagName(selector) : element.querySelectorAll(selector))
        }, $.contains = function(parent, node) {
            return parent !== node && parent.contains(node)
        }, $.type = type, $.isFunction = isFunction, $.isWindow = isWindow, $.isArray = isArray, $.isPlainObject = isPlainObject, $.isEmptyObject = function(obj) {
            var name;
            for (name in obj)
                return !1;
            return !0
        }, $.inArray = function(elem, array, i) {
            return emptyArray.indexOf.call(array, elem, i)
        }, $.camelCase = camelize, $.trim = function(str) {
            return null == str ? "" : String.prototype.trim.call(str)
        }, $.uuid = 0, $.support = {}, $.expr = {}, $.map = function(elements, callback) {
            var value, i, key, values = [];
            if (likeArray(elements))
                for (i = 0; i < elements.length; i++)
                    value = callback(elements[i], i), null != value && values.push(value);
            else
                for (key in elements)
                    value = callback(elements[key], key), null != value && values.push(value);
            return flatten(values)
        }, $.each = function(elements, callback) {
            var i, key;
            if (likeArray(elements)) {
                for (i = 0; i < elements.length; i++)
                    if (callback.call(elements[i], i, elements[i]) === !1)
                        return elements
            } else
                for (key in elements)
                    if (callback.call(elements[key], key, elements[key]) === !1)
                        return elements;
            return elements
        }, $.grep = function(elements, callback) {
            return filter.call(elements, callback)
        }, window.JSON && ($.parseJSON = JSON.parse), $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
            class2type["[object " + name + "]"] = name.toLowerCase()
        }), $.fn = {forEach: emptyArray.forEach,reduce: emptyArray.reduce,push: emptyArray.push,sort: emptyArray.sort,indexOf: emptyArray.indexOf,concat: emptyArray.concat,map: function(fn) {
                return $($.map(this, function(el, i) {
                    return fn.call(el, i, el)
                }))
            },slice: function() {
                return $(slice.apply(this, arguments))
            },ready: function(callback) {
                return readyRE.test(document.readyState) && document.body ? callback($) : document.addEventListener("DOMContentLoaded", function() {
                    callback($)
                }, !1), this
            },get: function(idx) {
                return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
            },toArray: function() {
                return this.get()
            },size: function() {
                return this.length
            },remove: function() {
                return this.each(function() {
                    null != this.parentNode && this.parentNode.removeChild(this)
                })
            },each: function(callback) {
                return emptyArray.every.call(this, function(el, idx) {
                    return callback.call(el, idx, el) !== !1
                }), this
            },filter: function(selector) {
                return isFunction(selector) ? this.not(this.not(selector)) : $(filter.call(this, function(element) {
                    return zepto.matches(element, selector)
                }))
            },add: function(selector, context) {
                return $(uniq(this.concat($(selector, context))))
            },is: function(selector) {
                return this.length > 0 && zepto.matches(this[0], selector)
            },not: function(selector) {
                var nodes = [];
                if (isFunction(selector) && selector.call !== undefined)
                    this.each(function(idx) {
                        selector.call(this, idx) || nodes.push(this)
                    });
                else {
                    var excludes = "string" == typeof selector ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? slice.call(selector) : $(selector);
                    this.forEach(function(el) {
                        excludes.indexOf(el) < 0 && nodes.push(el)
                    })
                }
                return $(nodes)
            },has: function(selector) {
                return this.filter(function() {
                    return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size()
                })
            },eq: function(idx) {
                return -1 === idx ? this.slice(idx) : this.slice(idx, +idx + 1)
            },first: function() {
                var el = this[0];
                return el && !isObject(el) ? el : $(el)
            },last: function() {
                var el = this[this.length - 1];
                return el && !isObject(el) ? el : $(el)
            },find: function(selector) {
                var result, $this = this;
                return result = "object" == typeof selector ? $(selector).filter(function() {
                    var node = this;
                    return emptyArray.some.call($this, function(parent) {
                        return $.contains(parent, node)
                    })
                }) : 1 == this.length ? $(zepto.qsa(this[0], selector)) : this.map(function() {
                    return zepto.qsa(this, selector)
                })
            },closest: function(selector, context) {
                var node = this[0], collection = !1;
                for ("object" == typeof selector && (collection = $(selector)); node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)); )
                    node = node !== context && !isDocument(node) && node.parentNode;
                return $(node)
            },parents: function(selector) {
                for (var ancestors = [], nodes = this; nodes.length > 0; )
                    nodes = $.map(nodes, function(node) {
                        return (node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0 ? (ancestors.push(node), node) : void 0
                    });
                return filtered(ancestors, selector)
            },parent: function(selector) {
                return filtered(uniq(this.pluck("parentNode")), selector)
            },children: function(selector) {
                return filtered(this.map(function() {
                    return children(this)
                }), selector)
            },contents: function() {
                return this.map(function() {
                    return slice.call(this.childNodes)
                })
            },siblings: function(selector) {
                return filtered(this.map(function(i, el) {
                    return filter.call(children(el.parentNode), function(child) {
                        return child !== el
                    })
                }), selector)
            },empty: function() {
                return this.each(function() {
                    this.innerHTML = ""
                })
            },pluck: function(property) {
                return $.map(this, function(el) {
                    return el[property]
                })
            },show: function() {
                return this.each(function() {
                    "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = defaultDisplay(this.nodeName))
                })
            },replaceWith: function(newContent) {
                return this.before(newContent).remove()
            },wrap: function(structure) {
                var func = isFunction(structure);
                if (this[0] && !func)
                    var dom = $(structure).get(0), clone = dom.parentNode || this.length > 1;
                return this.each(function(index) {
                    $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(!0) : dom)
                })
            },wrapAll: function(structure) {
                if (this[0]) {
                    $(this[0]).before(structure = $(structure));
                    for (var children; (children = structure.children()).length; )
                        structure = children.first();
                    $(structure).append(this)
                }
                return this
            },wrapInner: function(structure) {
                var func = isFunction(structure);
                return this.each(function(index) {
                    var self = $(this), contents = self.contents(), dom = func ? structure.call(this, index) : structure;
                    contents.length ? contents.wrapAll(dom) : self.append(dom)
                })
            },unwrap: function() {
                return this.parent().each(function() {
                    $(this).replaceWith($(this).children())
                }), this
            },clone: function() {
                return this.map(function() {
                    return this.cloneNode(!0)
                })
            },hide: function() {
                return this.css("display", "none")
            },toggle: function(setting) {
                return this.each(function() {
                    var el = $(this);
                    (setting === undefined ? "none" == el.css("display") : setting) ? el.show() : el.hide()
                })
            },prev: function(selector) {
                return $(this.pluck("previousElementSibling")).filter(selector || "*")
            },next: function(selector) {
                return $(this.pluck("nextElementSibling")).filter(selector || "*")
            },html: function(html) {
                return 0 === arguments.length ? this.length > 0 ? this[0].innerHTML : null : this.each(function(idx) {
                    var originHtml = this.innerHTML;
                    $(this).empty().append(funcArg(this, html, idx, originHtml))
                })
            },text: function(text) {
                return 0 === arguments.length ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                    this.textContent = text === undefined ? "" : "" + text
                })
            },attr: function(name, value) {
                var result;
                return "string" == typeof name && value === undefined ? 0 == this.length || 1 !== this[0].nodeType ? undefined : "value" == name && "INPUT" == this[0].nodeName ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function(idx) {
                    if (1 === this.nodeType)
                        if (isObject(name))
                            for (key in name)
                                setAttribute(this, key, name[key]);
                        else
                            setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
                })
            },removeAttr: function(name) {
                return this.each(function() {
                    1 === this.nodeType && setAttribute(this, name)
                })
            },prop: function(name, value) {
                return name = propMap[name] || name, value === undefined ? this[0] && this[0][name] : this.each(function(idx) {
                    this[name] = funcArg(this, value, idx, this[name])
                })
            },data: function(name, value) {
                var data = this.attr("data-" + name.replace(capitalRE, "-$1").toLowerCase(), value);
                return null !== data ? deserializeValue(data) : undefined
            },val: function(value) {
                return 0 === arguments.length ? this[0] && (this[0].multiple ? $(this[0]).find("option").filter(function() {
                    return this.selected
                }).pluck("value") : this[0].value) : this.each(function(idx) {
                    this.value = funcArg(this, value, idx, this.value)
                })
            },offset: function(coordinates) {
                if (coordinates)
                    return this.each(function(index) {
                        var $this = $(this), coords = funcArg(this, coordinates, index, $this.offset()), parentOffset = $this.offsetParent().offset(), props = {top: coords.top - parentOffset.top,left: coords.left - parentOffset.left};
                        "static" == $this.css("position") && (props.position = "relative"), $this.css(props)
                    });
                if (0 == this.length)
                    return null;
                var obj = this[0].getBoundingClientRect();
                return {left: obj.left + window.pageXOffset,top: obj.top + window.pageYOffset,width: Math.round(obj.width),height: Math.round(obj.height)}
            },css: function(property, value) {
                if (arguments.length < 2) {
                    var element = this[0], computedStyle = getComputedStyle(element, "");
                    if (!element)
                        return;
                    if ("string" == typeof property)
                        return element.style[camelize(property)] || computedStyle.getPropertyValue(property);
                    if (isArray(property)) {
                        var props = {};
                        return $.each(isArray(property) ? property : [property], function(_, prop) {
                            props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop)
                        }), props
                    }
                }
                var css = "";
                if ("string" == type(property))
                    value || 0 === value ? css = dasherize(property) + ":" + maybeAddPx(property, value) : this.each(function() {
                        this.style.removeProperty(dasherize(property))
                    });
                else
                    for (key in property)
                        property[key] || 0 === property[key] ? css += dasherize(key) + ":" + maybeAddPx(key, property[key]) + ";" : this.each(function() {
                            this.style.removeProperty(dasherize(key))
                        });
                return this.each(function() {
                    this.style.cssText += ";" + css
                })
            },index: function(element) {
                return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
            },hasClass: function(name) {
                return name ? emptyArray.some.call(this, function(el) {
                    return this.test(className(el))
                }, classRE(name)) : !1
            },addClass: function(name) {
                return name ? this.each(function(idx) {
                    classList = [];
                    var cls = className(this), newName = funcArg(this, name, idx, cls);
                    newName.split(/\s+/g).forEach(function(klass) {
                        $(this).hasClass(klass) || classList.push(klass)
                    }, this), classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
                }) : this
            },removeClass: function(name) {
                return this.each(function(idx) {
                    return name === undefined ? className(this, "") : (classList = className(this), funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass) {
                        classList = classList.replace(classRE(klass), " ")
                    }), void className(this, classList.trim()))
                })
            },toggleClass: function(name, when) {
                return name ? this.each(function(idx) {
                    var $this = $(this), names = funcArg(this, name, idx, className(this));
                    names.split(/\s+/g).forEach(function(klass) {
                        (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass)
                    })
                }) : this
            },scrollTop: function(value) {
                if (this.length) {
                    var hasScrollTop = "scrollTop" in this[0];
                    return value === undefined ? hasScrollTop ? this[0].scrollTop : this[0].pageYOffset : this.each(hasScrollTop ? function() {
                        this.scrollTop = value
                    } : function() {
                        this.scrollTo(this.scrollX, value)
                    })
                }
            },scrollLeft: function(value) {
                if (this.length) {
                    var hasScrollLeft = "scrollLeft" in this[0];
                    return value === undefined ? hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset : this.each(hasScrollLeft ? function() {
                        this.scrollLeft = value
                    } : function() {
                        this.scrollTo(value, this.scrollY)
                    })
                }
            },position: function() {
                if (this.length) {
                    var elem = this[0], offsetParent = this.offsetParent(), offset = this.offset(), parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {top: 0,left: 0} : offsetParent.offset();
                    return offset.top -= parseFloat($(elem).css("margin-top")) || 0, offset.left -= parseFloat($(elem).css("margin-left")) || 0, parentOffset.top += parseFloat($(offsetParent[0]).css("border-top-width")) || 0, parentOffset.left += parseFloat($(offsetParent[0]).css("border-left-width")) || 0, {top: offset.top - parentOffset.top,left: offset.left - parentOffset.left}
                }
            },offsetParent: function() {
                return this.map(function() {
                    for (var parent = this.offsetParent || document.body; parent && !rootNodeRE.test(parent.nodeName) && "static" == $(parent).css("position"); )
                        parent = parent.offsetParent;
                    return parent
                })
            }}, $.fn.detach = $.fn.remove, ["width", "height"].forEach(function(dimension) {
            var dimensionProperty = dimension.replace(/./, function(m) {
                return m[0].toUpperCase()
            });
            $.fn[dimension] = function(value) {
                var offset, el = this[0];
                return value === undefined ? isWindow(el) ? el["inner" + dimensionProperty] : isDocument(el) ? el.documentElement["scroll" + dimensionProperty] : (offset = this.offset()) && offset[dimension] : this.each(function(idx) {
                    el = $(this), el.css(dimension, funcArg(this, value, idx, el[dimension]()))
                })
            }
        }), adjacencyOperators.forEach(function(operator, operatorIndex) {
            var inside = operatorIndex % 2;
            $.fn[operator] = function() {
                var argType, parent, nodes = $.map(arguments, function(arg) {
                    return argType = type(arg), "object" == argType || "array" == argType || null == arg ? arg : zepto.fragment(arg)
                }), copyByClone = this.length > 1;
                return nodes.length < 1 ? this : this.each(function(_, target) {
                    parent = inside ? target : target.parentNode, target = 0 == operatorIndex ? target.nextSibling : 1 == operatorIndex ? target.firstChild : 2 == operatorIndex ? target : null, nodes.forEach(function(node) {
                        if (copyByClone)
                            node = node.cloneNode(!0);
                        else if (!parent)
                            return $(node).remove();
                        traverseNode(parent.insertBefore(node, target), function(el) {
                            null == el.nodeName || "SCRIPT" !== el.nodeName.toUpperCase() || el.type && "text/javascript" !== el.type || el.src || window.eval.call(window, el.innerHTML)
                        })
                    })
                })
            }, $.fn[inside ? operator + "To" : "insert" + (operatorIndex ? "Before" : "After")] = function(html) {
                return $(html)[operator](this), this
            }
        }), zepto.Z.prototype = $.fn, zepto.uniq = uniq, zepto.deserializeValue = deserializeValue, $.zepto = zepto, $
    }();
    window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto), function($) {
        function zid(element) {
            return element._zid || (element._zid = _zid++)
        }
        function findHandlers(element, event, fn, selector) {
            if (event = parse(event), event.ns)
                var matcher = matcherFor(event.ns);
            return (handlers[zid(element)] || []).filter(function(handler) {
                return !(!handler || event.e && handler.e != event.e || event.ns && !matcher.test(handler.ns) || fn && zid(handler.fn) !== zid(fn) || selector && handler.sel != selector)
            })
        }
        function parse(event) {
            var parts = ("" + event).split(".");
            return {e: parts[0],ns: parts.slice(1).sort().join(" ")}
        }
        function matcherFor(ns) {
            return new RegExp("(?:^| )" + ns.replace(" ", " .* ?") + "(?: |$)")
        }
        function eventCapture(handler, captureSetting) {
            return handler.del && !focusinSupported && handler.e in focus || !!captureSetting
        }
        function realEvent(type) {
            return hover[type] || focusinSupported && focus[type] || type
        }
        function add(element, events, fn, data, selector, delegator, capture) {
            var id = zid(element), set = handlers[id] || (handlers[id] = []);
            events.split(/\s/).forEach(function(event) {
                if ("ready" == event)
                    return $(document).ready(fn);
                var handler = parse(event);
                handler.fn = fn, handler.sel = selector, handler.e in hover && (fn = function(e) {
                    var related = e.relatedTarget;
                    return !related || related !== this && !$.contains(this, related) ? handler.fn.apply(this, arguments) : void 0
                }), handler.del = delegator;
                var callback = delegator || fn;
                handler.proxy = function(e) {
                    if (e = compatible(e), !e.isImmediatePropagationStopped()) {
                        e.data = data;
                        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
                        return result === !1 && (e.preventDefault(), e.stopPropagation()), result
                    }
                }, handler.i = set.length, set.push(handler), "addEventListener" in element && element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
            })
        }
        function remove(element, events, fn, selector, capture) {
            var id = zid(element);
            (events || "").split(/\s/).forEach(function(event) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i], "removeEventListener" in element && element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
                })
            })
        }
        function compatible(event, source) {
            return (source || !event.isDefaultPrevented) && (source || (source = event), $.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                    return this[predicate] = returnTrue, sourceMethod && sourceMethod.apply(source, arguments)
                }, event[predicate] = returnFalse
            }), (source.defaultPrevented !== undefined ? source.defaultPrevented : "returnValue" in source ? source.returnValue === !1 : source.getPreventDefault && source.getPreventDefault()) && (event.isDefaultPrevented = returnTrue)), event
        }
        function createProxy(event) {
            var key, proxy = {originalEvent: event};
            for (key in event)
                ignoreProperties.test(key) || event[key] === undefined || (proxy[key] = event[key]);
            return compatible(proxy, event)
        }
        var undefined, _zid = 1, slice = Array.prototype.slice, isFunction = $.isFunction, isString = function(obj) {
            return "string" == typeof obj
        }, handlers = {}, specialEvents = {}, focusinSupported = "onfocusin" in window, focus = {focus: "focusin",blur: "focusout"}, hover = {mouseenter: "mouseover",mouseleave: "mouseout"};
        specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = "MouseEvents", $.event = {add: add,remove: remove}, $.proxy = function(fn, context) {
            if (isFunction(fn)) {
                var proxyFn = function() {
                    return fn.apply(context, arguments)
                };
                return proxyFn._zid = zid(fn), proxyFn
            }
            if (isString(context))
                return $.proxy(fn[context], fn);
            throw new TypeError("expected function")
        }, $.fn.bind = function(event, data, callback) {
            return this.on(event, data, callback)
        }, $.fn.unbind = function(event, callback) {
            return this.off(event, callback)
        }, $.fn.one = function(event, selector, data, callback) {
            return this.on(event, selector, data, callback, 1)
        };
        var returnTrue = function() {
            return !0
        }, returnFalse = function() {
            return !1
        }, ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/, eventMethods = {preventDefault: "isDefaultPrevented",stopImmediatePropagation: "isImmediatePropagationStopped",stopPropagation: "isPropagationStopped"};
        $.fn.delegate = function(selector, event, callback) {
            return this.on(event, selector, callback)
        }, $.fn.undelegate = function(selector, event, callback) {
            return this.off(event, selector, callback)
        }, $.fn.live = function(event, callback) {
            return $(document.body).delegate(this.selector, event, callback), this
        }, $.fn.die = function(event, callback) {
            return $(document.body).undelegate(this.selector, event, callback), this
        }, $.fn.on = function(event, selector, data, callback, one) {
            var autoRemove, delegator, $this = this;
            return event && !isString(event) ? ($.each(event, function(type, fn) {
                $this.on(type, selector, data, fn, one)
            }), $this) : (isString(selector) || isFunction(callback) || callback === !1 || (callback = data, data = selector, selector = undefined), (isFunction(data) || data === !1) && (callback = data, data = undefined), callback === !1 && (callback = returnFalse), $this.each(function(_, element) {
                one && (autoRemove = function(e) {
                    return remove(element, e.type, callback), callback.apply(this, arguments)
                }), selector && (delegator = function(e) {
                    var evt, match = $(e.target).closest(selector, element).get(0);
                    return match && match !== element ? (evt = $.extend(createProxy(e), {currentTarget: match,liveFired: element}), (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))) : void 0
                }), add(element, event, callback, data, selector, delegator || autoRemove)
            }))
        }, $.fn.off = function(event, selector, callback) {
            var $this = this;
            return event && !isString(event) ? ($.each(event, function(type, fn) {
                $this.off(type, selector, fn)
            }), $this) : (isString(selector) || isFunction(callback) || callback === !1 || (callback = selector, selector = undefined), callback === !1 && (callback = returnFalse), $this.each(function() {
                remove(this, event, callback, selector)
            }))
        }, $.fn.trigger = function(event, args) {
            return event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event), event._args = args, this.each(function() {
                "dispatchEvent" in this ? this.dispatchEvent(event) : $(this).triggerHandler(event, args)
            })
        }, $.fn.triggerHandler = function(event, args) {
            var e, result;
            return this.each(function(i, element) {
                e = createProxy(isString(event) ? $.Event(event) : event), e._args = args, e.target = element, $.each(findHandlers(element, event.type || event), function(i, handler) {
                    return result = handler.proxy(e), e.isImmediatePropagationStopped() ? !1 : void 0
                })
            }), result
        }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(event) {
            $.fn[event] = function(callback) {
                return callback ? this.bind(event, callback) : this.trigger(event)
            }
        }), ["focus", "blur"].forEach(function(name) {
            $.fn[name] = function(callback) {
                return callback ? this.bind(name, callback) : this.each(function() {
                    try {
                        this[name]()
                    } catch (e) {
                    }
                }), this
            }
        }), $.Event = function(type, props) {
            isString(type) || (props = type, type = props.type);
            var event = document.createEvent(specialEvents[type] || "Events"), bubbles = !0;
            if (props)
                for (var name in props)
                    "bubbles" == name ? bubbles = !!props[name] : event[name] = props[name];
            return event.initEvent(type, bubbles, !0), compatible(event)
        }
    }(Zepto), function($) {
        function triggerAndReturn(context, eventName, data) {
            var event = $.Event(eventName);
            return $(context).trigger(event, data), !event.isDefaultPrevented()
        }
        function triggerGlobal(settings, context, eventName, data) {
            return settings.global ? triggerAndReturn(context || document, eventName, data) : void 0
        }
        function ajaxStart(settings) {
            settings.global && 0 === $.active++ && triggerGlobal(settings, null, "ajaxStart")
        }
        function ajaxStop(settings) {
            settings.global && !--$.active && triggerGlobal(settings, null, "ajaxStop")
        }
        function ajaxBeforeSend(xhr, settings) {
            var context = settings.context;
            return settings.beforeSend.call(context, xhr, settings) === !1 || triggerGlobal(settings, context, "ajaxBeforeSend", [xhr, settings]) === !1 ? !1 : void triggerGlobal(settings, context, "ajaxSend", [xhr, settings])
        }
        function ajaxSuccess(data, xhr, settings, deferred) {
            var context = settings.context, status = "success";
            settings.success.call(context, data, status, xhr), deferred && deferred.resolveWith(context, [data, status, xhr]), triggerGlobal(settings, context, "ajaxSuccess", [xhr, settings, data]), ajaxComplete(status, xhr, settings)
        }
        function ajaxError(error, type, xhr, settings, deferred) {
            var context = settings.context;
            settings.error.call(context, xhr, type, error), deferred && deferred.rejectWith(context, [xhr, type, error]), triggerGlobal(settings, context, "ajaxError", [xhr, settings, error || type]), ajaxComplete(type, xhr, settings)
        }
        function ajaxComplete(status, xhr, settings) {
            var context = settings.context;
            settings.complete.call(context, xhr, status), triggerGlobal(settings, context, "ajaxComplete", [xhr, settings]), ajaxStop(settings)
        }
        function empty() {
        }
        function mimeToDataType(mime) {
            return mime && (mime = mime.split(";", 2)[0]), mime && (mime == htmlType ? "html" : mime == jsonType ? "json" : scriptTypeRE.test(mime) ? "script" : xmlTypeRE.test(mime) && "xml") || "text"
        }
        function appendQuery(url, query) {
            return "" == query ? url : (url + "&" + query).replace(/[&?]{1,2}/, "?")
        }
        function serializeData(options) {
            options.processData && options.data && "string" != $.type(options.data) && (options.data = $.param(options.data, options.traditional)), !options.data || options.type && "GET" != options.type.toUpperCase() || (options.url = appendQuery(options.url, options.data), options.data = void 0)
        }
        function parseArguments(url, data, success, dataType) {
            return $.isFunction(data) && (dataType = success, success = data, data = void 0), $.isFunction(success) || (dataType = success, success = void 0), {url: url,data: data,success: success,dataType: dataType}
        }
        function serialize(params, obj, traditional, scope) {
            var type, array = $.isArray(obj), hash = $.isPlainObject(obj);
            $.each(obj, function(key, value) {
                type = $.type(value), scope && (key = traditional ? scope : scope + "[" + (hash || "object" == type || "array" == type ? key : "") + "]"), !scope && array ? params.add(value.name, value.value) : "array" == type || !traditional && "object" == type ? serialize(params, value, traditional, key) : params.add(key, value)
            })
        }
        var key, name, jsonpID = 0, document = window.document, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/;
        $.active = 0, $.ajaxJSONP = function(options, deferred) {
            if (!("type" in options))
                return $.ajax(options);
            var responseData, abortTimeout, _callbackName = options.jsonpCallback, callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || "jsonp" + ++jsonpID, script = document.createElement("script"), originalCallback = window[callbackName], abort = function(errorType) {
                $(script).triggerHandler("error", errorType || "abort")
            }, xhr = {abort: abort};
            return deferred && deferred.promise(xhr), $(script).on("load error", function(e, errorType) {
                clearTimeout(abortTimeout), $(script).off().remove(), "error" != e.type && responseData ? ajaxSuccess(responseData[0], xhr, options, deferred) : ajaxError(null, errorType || "error", xhr, options, deferred), window[callbackName] = originalCallback, responseData && $.isFunction(originalCallback) && originalCallback(responseData[0]), originalCallback = responseData = void 0
            }), ajaxBeforeSend(xhr, options) === !1 ? (abort("abort"), xhr) : (window[callbackName] = function() {
                responseData = arguments
            }, script.src = options.url.replace(/\?(.+)=\?/, "?$1=" + callbackName), document.head.appendChild(script), options.timeout > 0 && (abortTimeout = setTimeout(function() {
                abort("timeout")
            }, options.timeout)), xhr)
        }, $.ajaxSettings = {type: "GET",beforeSend: empty,success: empty,error: empty,complete: empty,context: null,global: !0,xhr: function() {
                return new window.XMLHttpRequest
            },accepts: {script: "text/javascript, application/javascript, application/x-javascript",json: jsonType,xml: "application/xml, text/xml",html: htmlType,text: "text/plain"},crossDomain: !1,timeout: 0,processData: !0,cache: !0}, $.ajax = function(options) {
            var settings = $.extend({}, options || {}), deferred = $.Deferred && $.Deferred();
            for (key in $.ajaxSettings)
                void 0 === settings[key] && (settings[key] = $.ajaxSettings[key]);
            ajaxStart(settings), settings.crossDomain || (settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host), settings.url || (settings.url = window.location.toString()), serializeData(settings), settings.cache === !1 && (settings.url = appendQuery(settings.url, "_=" + Date.now()));
            var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url);
            if ("jsonp" == dataType || hasPlaceholder)
                return hasPlaceholder || (settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + "=?" : settings.jsonp === !1 ? "" : "callback=?")), $.ajaxJSONP(settings, deferred);
            var abortTimeout, mime = settings.accepts[dataType], headers = {}, setHeader = function(name, value) {
                headers[name.toLowerCase()] = [name, value]
            }, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader;
            if (deferred && deferred.promise(xhr), settings.crossDomain || setHeader("X-Requested-With", "XMLHttpRequest"), setHeader("Accept", mime || "*/*"), (mime = settings.mimeType || mime) && (mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime)), (settings.contentType || settings.contentType !== !1 && settings.data && "GET" != settings.type.toUpperCase()) && setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded"), settings.headers)
                for (name in settings.headers)
                    setHeader(name, settings.headers[name]);
            if (xhr.setRequestHeader = setHeader, xhr.onreadystatechange = function() {
                if (4 == xhr.readyState) {
                    xhr.onreadystatechange = empty, clearTimeout(abortTimeout);
                    var result, error = !1;
                    if (xhr.status >= 200 && xhr.status < 300 || 304 == xhr.status || 0 == xhr.status && "file:" == protocol) {
                        dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type")), result = xhr.responseText;
                        try {
                            "script" == dataType ? (1, eval)(result) : "xml" == dataType ? result = xhr.responseXML : "json" == dataType && (result = blankRE.test(result) ? null : $.parseJSON(result))
                        } catch (e) {
                            error = e
                        }
                        error ? ajaxError(error, "parsererror", xhr, settings, deferred) : ajaxSuccess(result, xhr, settings, deferred)
                    } else
                        ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred)
                }
            }, ajaxBeforeSend(xhr, settings) === !1)
                return xhr.abort(), ajaxError(null, "abort", xhr, settings, deferred), xhr;
            if (settings.xhrFields)
                for (name in settings.xhrFields)
                    xhr[name] = settings.xhrFields[name];
            var async = "async" in settings ? settings.async : !0;
            xhr.open(settings.type, settings.url, async, settings.username, settings.password);
            for (name in headers)
                nativeSetHeader.apply(xhr, headers[name]);
            return settings.timeout > 0 && (abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty, xhr.abort(), ajaxError(null, "timeout", xhr, settings, deferred)
            }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr
        }, $.get = function() {
            return $.ajax(parseArguments.apply(null, arguments))
        }, $.post = function() {
            var options = parseArguments.apply(null, arguments);
            return options.type = "POST", $.ajax(options)
        }, $.getJSON = function() {
            var options = parseArguments.apply(null, arguments);
            return options.dataType = "json", $.ajax(options)
        }, $.fn.load = function(url, data, success) {
            if (!this.length)
                return this;
            var selector, self = this, parts = url.split(/\s/), options = parseArguments(url, data, success), callback = options.success;
            return parts.length > 1 && (options.url = parts[0], selector = parts[1]), options.success = function(response) {
                self.html(selector ? $("<div>").html(response.replace(rscript, "")).find(selector) : response), callback && callback.apply(self, arguments)
            }, $.ajax(options), this
        };
        var escape = encodeURIComponent;
        $.param = function(obj, traditional) {
            var params = [];
            return params.add = function(k, v) {
                this.push(escape(k) + "=" + escape(v))
            }, serialize(params, obj, traditional), params.join("&").replace(/%20/g, "+")
        }
    }(Zepto), function($) {
        $.fn.serializeArray = function() {
            var el, result = [];
            return $([].slice.call(this.get(0).elements)).each(function() {
                el = $(this);
                var type = el.attr("type");
                "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != type && "reset" != type && "button" != type && ("radio" != type && "checkbox" != type || this.checked) && result.push({name: el.attr("name"),value: el.val()})
            }), result
        }, $.fn.serialize = function() {
            var result = [];
            return this.serializeArray().forEach(function(elm) {
                result.push(encodeURIComponent(elm.name) + "=" + encodeURIComponent(elm.value))
            }), result.join("&")
        }, $.fn.submit = function(callback) {
            if (callback)
                this.bind("submit", callback);
            else if (this.length) {
                var event = $.Event("submit");
                this.eq(0).trigger(event), event.isDefaultPrevented() || this.get(0).submit()
            }
            return this
        }
    }(Zepto), function($) {
        "__proto__" in {} || $.extend($.zepto, {Z: function(dom, selector) {
                return dom = dom || [], $.extend(dom, $.fn), dom.selector = selector || "", dom.__Z = !0, dom
            },isZ: function(object) {
                return "array" === $.type(object) && "__Z" in object
            }}), $.isPC = navigator.platform.indexOf("Win") >= 0 ? !0 : !1;
        try {
            getComputedStyle(void 0)
        } catch (e) {
            var nativeGetComputedStyle = getComputedStyle;
            window.getComputedStyle = function(element) {
                try {
                    return nativeGetComputedStyle(element)
                } catch (e) {
                    return null
                }
            }
        }
    }(Zepto), module.exports = Zepto
});
var Zepto = function() {
    function L(t) {
        return null == t ? String(t) : j[T.call(t)] || "object"
    }
    function Z(t) {
        return "function" == L(t)
    }
    function $(t) {
        return null != t && t == t.window
    }
    function _(t) {
        return null != t && t.nodeType == t.DOCUMENT_NODE
    }
    function D(t) {
        return "object" == L(t)
    }
    function R(t) {
        return D(t) && !$(t) && Object.getPrototypeOf(t) == Object.prototype
    }
    function M(t) {
        return "number" == typeof t.length
    }
    function k(t) {
        return s.call(t, function(t) {
            return null != t
        })
    }
    function z(t) {
        return t.length > 0 ? n.fn.concat.apply([], t) : t
    }
    function F(t) {
        return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }
    function q(t) {
        return t in f ? f[t] : f[t] = new RegExp("(^|\\s)" + t + "(\\s|$)")
    }
    function H(t, e) {
        return "number" != typeof e || c[F(t)] ? e : e + "px"
    }
    function I(t) {
        var e, n;
        return u[t] || (e = a.createElement(t), a.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), u[t] = n), u[t]
    }
    function V(t) {
        return "children" in t ? o.call(t.children) : n.map(t.childNodes, function(t) {
            return 1 == t.nodeType ? t : void 0
        })
    }
    function U(n, i, r) {
        for (e in i)
            r && (R(i[e]) || A(i[e])) ? (R(i[e]) && !R(n[e]) && (n[e] = {}), A(i[e]) && !A(n[e]) && (n[e] = []), U(n[e], i[e], r)) : i[e] !== t && (n[e] = i[e])
    }
    function B(t, e) {
        return null == e ? n(t) : n(t).filter(e)
    }
    function J(t, e, n, i) {
        return Z(e) ? e.call(t, n, i) : e
    }
    function X(t, e, n) {
        null == n ? t.removeAttribute(e) : t.setAttribute(e, n)
    }
    function W(e, n) {
        var i = e.className, r = i && i.baseVal !== t;
        return n === t ? r ? i.baseVal : i : void (r ? i.baseVal = n : e.className = n)
    }
    function Y(t) {
        var e;
        try {
            return t ? "true" == t || ("false" == t ? !1 : "null" == t ? null : /^0/.test(t) || isNaN(e = Number(t)) ? /^[\[\{]/.test(t) ? n.parseJSON(t) : t : e) : t
        } catch (i) {
            return t
        }
    }
    function G(t, e) {
        e(t);
        for (var n in t.childNodes)
            G(t.childNodes[n], e)
    }
    var t, e, n, i, C, N, r = [], o = r.slice, s = r.filter, a = window.document, u = {}, f = {}, c = {"column-count": 1,columns: 1,"font-weight": 1,"line-height": 1,opacity: 1,"z-index": 1,zoom: 1}, l = /^\s*<(\w+|!)[^>]*>/, h = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, p = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, d = /^(?:body|html)$/i, m = /([A-Z])/g, g = ["val", "css", "html", "text", "data", "width", "height", "offset"], v = ["after", "prepend", "before", "append"], y = a.createElement("table"), x = a.createElement("tr"), b = {tr: a.createElement("tbody"),tbody: y,thead: y,tfoot: y,td: x,th: x,"*": a.createElement("div")}, w = /complete|loaded|interactive/, E = /^[\w-]*$/, j = {}, T = j.toString, S = {}, O = a.createElement("div"), P = {tabindex: "tabIndex",readonly: "readOnly","for": "htmlFor","class": "className",maxlength: "maxLength",cellspacing: "cellSpacing",cellpadding: "cellPadding",rowspan: "rowSpan",colspan: "colSpan",usemap: "useMap",frameborder: "frameBorder",contenteditable: "contentEditable"}, A = Array.isArray || function(t) {
        return t instanceof Array
    };
    return S.matches = function(t, e) {
        if (!e || !t || 1 !== t.nodeType)
            return !1;
        var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector;
        if (n)
            return n.call(t, e);
        var i, r = t.parentNode, o = !r;
        return o && (r = O).appendChild(t), i = ~S.qsa(r, e).indexOf(t), o && O.removeChild(t), i
    }, C = function(t) {
        return t.replace(/-+(.)?/g, function(t, e) {
            return e ? e.toUpperCase() : ""
        })
    }, N = function(t) {
        return s.call(t, function(e, n) {
            return t.indexOf(e) == n
        })
    }, S.fragment = function(e, i, r) {
        var s, u, f;
        return h.test(e) && (s = n(a.createElement(RegExp.$1))), s || (e.replace && (e = e.replace(p, "<$1></$2>")), i === t && (i = l.test(e) && RegExp.$1), i in b || (i = "*"), f = b[i], f.innerHTML = "" + e, s = n.each(o.call(f.childNodes), function() {
            f.removeChild(this)
        })), R(r) && (u = n(s), n.each(r, function(t, e) {
            g.indexOf(t) > -1 ? u[t](e) : u.attr(t, e)
        })), s
    }, S.Z = function(t, e) {
        return t = t || [], t.__proto__ = n.fn, t.selector = e || "", t
    }, S.isZ = function(t) {
        return t instanceof S.Z
    }, S.init = function(e, i) {
        var r;
        if (!e)
            return S.Z();
        if ("string" == typeof e)
            if (e = e.trim(), "<" == e[0] && l.test(e))
                r = S.fragment(e, RegExp.$1, i), e = null;
            else {
                if (i !== t)
                    return n(i).find(e);
                r = S.qsa(a, e)
            }
        else {
            if (Z(e))
                return n(a).ready(e);
            if (S.isZ(e))
                return e;
            if (A(e))
                r = k(e);
            else if (D(e))
                r = [e], e = null;
            else if (l.test(e))
                r = S.fragment(e.trim(), RegExp.$1, i), e = null;
            else {
                if (i !== t)
                    return n(i).find(e);
                r = S.qsa(a, e)
            }
        }
        return S.Z(r, e)
    }, n = function(t, e) {
        return S.init(t, e)
    }, n.extend = function(t) {
        var e, n = o.call(arguments, 1);
        return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function(n) {
            U(t, n, e)
        }), t
    }, S.qsa = function(t, e) {
        var n, i = "#" == e[0], r = !i && "." == e[0], s = i || r ? e.slice(1) : e, a = E.test(s);
        return _(t) && a && i ? (n = t.getElementById(s)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : o.call(a && !i ? r ? t.getElementsByClassName(s) : t.getElementsByTagName(e) : t.querySelectorAll(e))
    }, n.contains = function(t, e) {
        return t !== e && t.contains(e)
    }, n.type = L, n.isFunction = Z, n.isWindow = $, n.isArray = A, n.isPlainObject = R, n.isEmptyObject = function(t) {
        var e;
        for (e in t)
            return !1;
        return !0
    }, n.inArray = function(t, e, n) {
        return r.indexOf.call(e, t, n)
    }, n.camelCase = C, n.trim = function(t) {
        return null == t ? "" : String.prototype.trim.call(t)
    }, n.uuid = 0, n.support = {}, n.expr = {}, n.map = function(t, e) {
        var n, r, o, i = [];
        if (M(t))
            for (r = 0; r < t.length; r++)
                n = e(t[r], r), null != n && i.push(n);
        else
            for (o in t)
                n = e(t[o], o), null != n && i.push(n);
        return z(i)
    }, n.each = function(t, e) {
        var n, i;
        if (M(t)) {
            for (n = 0; n < t.length; n++)
                if (e.call(t[n], n, t[n]) === !1)
                    return t
        } else
            for (i in t)
                if (e.call(t[i], i, t[i]) === !1)
                    return t;
        return t
    }, n.grep = function(t, e) {
        return s.call(t, e)
    }, window.JSON && (n.parseJSON = JSON.parse), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(t, e) {
        j["[object " + e + "]"] = e.toLowerCase()
    }), n.fn = {forEach: r.forEach,reduce: r.reduce,push: r.push,sort: r.sort,indexOf: r.indexOf,concat: r.concat,map: function(t) {
            return n(n.map(this, function(e, n) {
                return t.call(e, n, e)
            }))
        },slice: function() {
            return n(o.apply(this, arguments))
        },ready: function(t) {
            return w.test(a.readyState) && a.body ? t(n) : a.addEventListener("DOMContentLoaded", function() {
                t(n)
            }, !1), this
        },get: function(e) {
            return e === t ? o.call(this) : this[e >= 0 ? e : e + this.length]
        },toArray: function() {
            return this.get()
        },size: function() {
            return this.length
        },remove: function() {
            return this.each(function() {
                null != this.parentNode && this.parentNode.removeChild(this)
            })
        },each: function(t) {
            return r.every.call(this, function(e, n) {
                return t.call(e, n, e) !== !1
            }), this
        },filter: function(t) {
            return Z(t) ? this.not(this.not(t)) : n(s.call(this, function(e) {
                return S.matches(e, t)
            }))
        },add: function(t, e) {
            return n(N(this.concat(n(t, e))))
        },is: function(t) {
            return this.length > 0 && S.matches(this[0], t)
        },not: function(e) {
            var i = [];
            if (Z(e) && e.call !== t)
                this.each(function(t) {
                    e.call(this, t) || i.push(this)
                });
            else {
                var r = "string" == typeof e ? this.filter(e) : M(e) && Z(e.item) ? o.call(e) : n(e);
                this.forEach(function(t) {
                    r.indexOf(t) < 0 && i.push(t)
                })
            }
            return n(i)
        },has: function(t) {
            return this.filter(function() {
                return D(t) ? n.contains(this, t) : n(this).find(t).size()
            })
        },eq: function(t) {
            return -1 === t ? this.slice(t) : this.slice(t, +t + 1)
        },first: function() {
            var t = this[0];
            return t && !D(t) ? t : n(t)
        },last: function() {
            var t = this[this.length - 1];
            return t && !D(t) ? t : n(t)
        },find: function(t) {
            var e, i = this;
            return e = "object" == typeof t ? n(t).filter(function() {
                var t = this;
                return r.some.call(i, function(e) {
                    return n.contains(e, t)
                })
            }) : 1 == this.length ? n(S.qsa(this[0], t)) : this.map(function() {
                return S.qsa(this, t)
            })
        },closest: function(t, e) {
            var i = this[0], r = !1;
            for ("object" == typeof t && (r = n(t)); i && !(r ? r.indexOf(i) >= 0 : S.matches(i, t)); )
                i = i !== e && !_(i) && i.parentNode;
            return n(i)
        },parents: function(t) {
            for (var e = [], i = this; i.length > 0; )
                i = n.map(i, function(t) {
                    return (t = t.parentNode) && !_(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0
                });
            return B(e, t)
        },parent: function(t) {
            return B(N(this.pluck("parentNode")), t)
        },children: function(t) {
            return B(this.map(function() {
                return V(this)
            }), t)
        },contents: function() {
            return this.map(function() {
                return o.call(this.childNodes)
            })
        },siblings: function(t) {
            return B(this.map(function(t, e) {
                return s.call(V(e.parentNode), function(t) {
                    return t !== e
                })
            }), t)
        },empty: function() {
            return this.each(function() {
                this.innerHTML = ""
            })
        },pluck: function(t) {
            return n.map(this, function(e) {
                return e[t]
            })
        },show: function() {
            return this.each(function() {
                "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = I(this.nodeName))
            })
        },replaceWith: function(t) {
            return this.before(t).remove()
        },wrap: function(t) {
            var e = Z(t);
            if (this[0] && !e)
                var i = n(t).get(0), r = i.parentNode || this.length > 1;
            return this.each(function(o) {
                n(this).wrapAll(e ? t.call(this, o) : r ? i.cloneNode(!0) : i)
            })
        },wrapAll: function(t) {
            if (this[0]) {
                n(this[0]).before(t = n(t));
                for (var e; (e = t.children()).length; )
                    t = e.first();
                n(t).append(this)
            }
            return this
        },wrapInner: function(t) {
            var e = Z(t);
            return this.each(function(i) {
                var r = n(this), o = r.contents(), s = e ? t.call(this, i) : t;
                o.length ? o.wrapAll(s) : r.append(s)
            })
        },unwrap: function() {
            return this.parent().each(function() {
                n(this).replaceWith(n(this).children())
            }), this
        },clone: function() {
            return this.map(function() {
                return this.cloneNode(!0)
            })
        },hide: function() {
            return this.css("display", "none")
        },toggle: function(e) {
            return this.each(function() {
                var i = n(this);
                (e === t ? "none" == i.css("display") : e) ? i.show() : i.hide()
            })
        },prev: function(t) {
            return n(this.pluck("previousElementSibling")).filter(t || "*")
        },next: function(t) {
            return n(this.pluck("nextElementSibling")).filter(t || "*")
        },html: function(t) {
            return 0 === arguments.length ? this.length > 0 ? this[0].innerHTML : null : this.each(function(e) {
                var i = this.innerHTML;
                n(this).empty().append(J(this, t, e, i))
            })
        },text: function(e) {
            return 0 === arguments.length ? this.length > 0 ? this[0].textContent : null : this.each(function() {
                this.textContent = e === t ? "" : "" + e
            })
        },attr: function(n, i) {
            var r;
            return "string" == typeof n && i === t ? 0 == this.length || 1 !== this[0].nodeType ? t : "value" == n && "INPUT" == this[0].nodeName ? this.val() : !(r = this[0].getAttribute(n)) && n in this[0] ? this[0][n] : r : this.each(function(t) {
                if (1 === this.nodeType)
                    if (D(n))
                        for (e in n)
                            X(this, e, n[e]);
                    else
                        X(this, n, J(this, i, t, this.getAttribute(n)))
            })
        },removeAttr: function(t) {
            return this.each(function() {
                1 === this.nodeType && X(this, t)
            })
        },prop: function(e, n) {
            return e = P[e] || e, n === t ? this[0] && this[0][e] : this.each(function(t) {
                this[e] = J(this, n, t, this[e])
            })
        },data: function(e, n) {
            var i = this.attr("data-" + e.replace(m, "-$1").toLowerCase(), n);
            return null !== i ? Y(i) : t
        },val: function(t) {
            return 0 === arguments.length ? this[0] && (this[0].multiple ? n(this[0]).find("option").filter(function() {
                return this.selected
            }).pluck("value") : this[0].value) : this.each(function(e) {
                this.value = J(this, t, e, this.value)
            })
        },offset: function(t) {
            if (t)
                return this.each(function(e) {
                    var i = n(this), r = J(this, t, e, i.offset()), o = i.offsetParent().offset(), s = {top: r.top - o.top,left: r.left - o.left};
                    "static" == i.css("position") && (s.position = "relative"), i.css(s)
                });
            if (0 == this.length)
                return null;
            var e = this[0].getBoundingClientRect();
            return {left: e.left + window.pageXOffset,top: e.top + window.pageYOffset,width: Math.round(e.width),height: Math.round(e.height)}
        },css: function(t, i) {
            if (arguments.length < 2) {
                var r = this[0], o = getComputedStyle(r, "");
                if (!r)
                    return;
                if ("string" == typeof t)
                    return r.style[C(t)] || o.getPropertyValue(t);
                if (A(t)) {
                    var s = {};
                    return n.each(A(t) ? t : [t], function(t, e) {
                        s[e] = r.style[C(e)] || o.getPropertyValue(e)
                    }), s
                }
            }
            var a = "";
            if ("string" == L(t))
                i || 0 === i ? a = F(t) + ":" + H(t, i) : this.each(function() {
                    this.style.removeProperty(F(t))
                });
            else
                for (e in t)
                    t[e] || 0 === t[e] ? a += F(e) + ":" + H(e, t[e]) + ";" : this.each(function() {
                        this.style.removeProperty(F(e))
                    });
            return this.each(function() {
                this.style.cssText += ";" + a
            })
        },index: function(t) {
            return t ? this.indexOf(n(t)[0]) : this.parent().children().indexOf(this[0])
        },hasClass: function(t) {
            return t ? r.some.call(this, function(t) {
                return this.test(W(t))
            }, q(t)) : !1
        },addClass: function(t) {
            return t ? this.each(function(e) {
                i = [];
                var r = W(this), o = J(this, t, e, r);
                o.split(/\s+/g).forEach(function(t) {
                    n(this).hasClass(t) || i.push(t)
                }, this), i.length && W(this, r + (r ? " " : "") + i.join(" "))
            }) : this
        },removeClass: function(e) {
            return this.each(function(n) {
                return e === t ? W(this, "") : (i = W(this), J(this, e, n, i).split(/\s+/g).forEach(function(t) {
                    i = i.replace(q(t), " ")
                }), void W(this, i.trim()))
            })
        },toggleClass: function(e, i) {
            return e ? this.each(function(r) {
                var o = n(this), s = J(this, e, r, W(this));
                s.split(/\s+/g).forEach(function(e) {
                    (i === t ? !o.hasClass(e) : i) ? o.addClass(e) : o.removeClass(e)
                })
            }) : this
        },scrollTop: function(e) {
            if (this.length) {
                var n = "scrollTop" in this[0];
                return e === t ? n ? this[0].scrollTop : this[0].pageYOffset : this.each(n ? function() {
                    this.scrollTop = e
                } : function() {
                    this.scrollTo(this.scrollX, e)
                })
            }
        },scrollLeft: function(e) {
            if (this.length) {
                var n = "scrollLeft" in this[0];
                return e === t ? n ? this[0].scrollLeft : this[0].pageXOffset : this.each(n ? function() {
                    this.scrollLeft = e
                } : function() {
                    this.scrollTo(e, this.scrollY)
                })
            }
        },position: function() {
            if (this.length) {
                var t = this[0], e = this.offsetParent(), i = this.offset(), r = d.test(e[0].nodeName) ? {top: 0,left: 0} : e.offset();
                return i.top -= parseFloat(n(t).css("margin-top")) || 0, i.left -= parseFloat(n(t).css("margin-left")) || 0, r.top += parseFloat(n(e[0]).css("border-top-width")) || 0, r.left += parseFloat(n(e[0]).css("border-left-width")) || 0, {top: i.top - r.top,left: i.left - r.left}
            }
        },offsetParent: function() {
            return this.map(function() {
                for (var t = this.offsetParent || a.body; t && !d.test(t.nodeName) && "static" == n(t).css("position"); )
                    t = t.offsetParent;
                return t
            })
        }}, n.fn.detach = n.fn.remove, ["width", "height"].forEach(function(e) {
        var i = e.replace(/./, function(t) {
            return t[0].toUpperCase()
        });
        n.fn[e] = function(r) {
            var o, s = this[0];
            return r === t ? $(s) ? s["inner" + i] : _(s) ? s.documentElement["scroll" + i] : (o = this.offset()) && o[e] : this.each(function(t) {
                s = n(this), s.css(e, J(this, r, t, s[e]()))
            })
        }
    }), v.forEach(function(t, e) {
        var i = e % 2;
        n.fn[t] = function() {
            var t, o, r = n.map(arguments, function(e) {
                return t = L(e), "object" == t || "array" == t || null == e ? e : S.fragment(e)
            }), s = this.length > 1;
            return r.length < 1 ? this : this.each(function(t, a) {
                o = i ? a : a.parentNode, a = 0 == e ? a.nextSibling : 1 == e ? a.firstChild : 2 == e ? a : null, r.forEach(function(t) {
                    if (s)
                        t = t.cloneNode(!0);
                    else if (!o)
                        return n(t).remove();
                    G(o.insertBefore(t, a), function(t) {
                        null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src || window.eval.call(window, t.innerHTML)
                    })
                })
            })
        }, n.fn[i ? t + "To" : "insert" + (e ? "Before" : "After")] = function(e) {
            return n(e)[t](this), this
        }
    }), S.Z.prototype = n.fn, S.uniq = N, S.deserializeValue = Y, n.zepto = S, n
}();
window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto), function(t) {
    function l(t) {
        return t._zid || (t._zid = e++)
    }
    function h(t, e, n, i) {
        if (e = p(e), e.ns)
            var r = d(e.ns);
        return (s[l(t)] || []).filter(function(t) {
            return !(!t || e.e && t.e != e.e || e.ns && !r.test(t.ns) || n && l(t.fn) !== l(n) || i && t.sel != i)
        })
    }
    function p(t) {
        var e = ("" + t).split(".");
        return {e: e[0],ns: e.slice(1).sort().join(" ")}
    }
    function d(t) {
        return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)")
    }
    function m(t, e) {
        return t.del && !u && t.e in f || !!e
    }
    function g(t) {
        return c[t] || u && f[t] || t
    }
    function v(e, i, r, o, a, u, f) {
        var h = l(e), d = s[h] || (s[h] = []);
        i.split(/\s/).forEach(function(i) {
            if ("ready" == i)
                return t(document).ready(r);
            var s = p(i);
            s.fn = r, s.sel = a, s.e in c && (r = function(e) {
                var n = e.relatedTarget;
                return !n || n !== this && !t.contains(this, n) ? s.fn.apply(this, arguments) : void 0
            }), s.del = u;
            var l = u || r;
            s.proxy = function(t) {
                if (t = j(t), !t.isImmediatePropagationStopped()) {
                    t.data = o;
                    var i = l.apply(e, t._args == n ? [t] : [t].concat(t._args));
                    return i === !1 && (t.preventDefault(), t.stopPropagation()), i
                }
            }, s.i = d.length, d.push(s), "addEventListener" in e && e.addEventListener(g(s.e), s.proxy, m(s, f))
        })
    }
    function y(t, e, n, i, r) {
        var o = l(t);
        (e || "").split(/\s/).forEach(function(e) {
            h(t, e, n, i).forEach(function(e) {
                delete s[o][e.i], "removeEventListener" in t && t.removeEventListener(g(e.e), e.proxy, m(e, r))
            })
        })
    }
    function j(e, i) {
        return (i || !e.isDefaultPrevented) && (i || (i = e), t.each(E, function(t, n) {
            var r = i[t];
            e[t] = function() {
                return this[n] = x, r && r.apply(i, arguments)
            }, e[n] = b
        }), (i.defaultPrevented !== n ? i.defaultPrevented : "returnValue" in i ? i.returnValue === !1 : i.getPreventDefault && i.getPreventDefault()) && (e.isDefaultPrevented = x)), e
    }
    function T(t) {
        var e, i = {originalEvent: t};
        for (e in t)
            w.test(e) || t[e] === n || (i[e] = t[e]);
        return j(i, t)
    }
    var n, e = 1, i = Array.prototype.slice, r = t.isFunction, o = function(t) {
        return "string" == typeof t
    }, s = {}, a = {}, u = "onfocusin" in window, f = {focus: "focusin",blur: "focusout"}, c = {mouseenter: "mouseover",mouseleave: "mouseout"};
    a.click = a.mousedown = a.mouseup = a.mousemove = "MouseEvents", t.event = {add: v,remove: y}, t.proxy = function(e, n) {
        if (r(e)) {
            var i = function() {
                return e.apply(n, arguments)
            };
            return i._zid = l(e), i
        }
        if (o(n))
            return t.proxy(e[n], e);
        throw new TypeError("expected function")
    }, t.fn.bind = function(t, e, n) {
        return this.on(t, e, n)
    }, t.fn.unbind = function(t, e) {
        return this.off(t, e)
    }, t.fn.one = function(t, e, n, i) {
        return this.on(t, e, n, i, 1)
    };
    var x = function() {
        return !0
    }, b = function() {
        return !1
    }, w = /^([A-Z]|returnValue$|layer[XY]$)/, E = {preventDefault: "isDefaultPrevented",stopImmediatePropagation: "isImmediatePropagationStopped",stopPropagation: "isPropagationStopped"};
    t.fn.delegate = function(t, e, n) {
        return this.on(e, t, n)
    }, t.fn.undelegate = function(t, e, n) {
        return this.off(e, t, n)
    }, t.fn.live = function(e, n) {
        return t(document.body).delegate(this.selector, e, n), this
    }, t.fn.die = function(e, n) {
        return t(document.body).undelegate(this.selector, e, n), this
    }, t.fn.on = function(e, s, a, u, f) {
        var c, l, h = this;
        return e && !o(e) ? (t.each(e, function(t, e) {
            h.on(t, s, a, e, f)
        }), h) : (o(s) || r(u) || u === !1 || (u = a, a = s, s = n), (r(a) || a === !1) && (u = a, a = n), u === !1 && (u = b), h.each(function(n, r) {
            f && (c = function(t) {
                return y(r, t.type, u), u.apply(this, arguments)
            }), s && (l = function(e) {
                var n, o = t(e.target).closest(s, r).get(0);
                return o && o !== r ? (n = t.extend(T(e), {currentTarget: o,liveFired: r}), (c || u).apply(o, [n].concat(i.call(arguments, 1)))) : void 0
            }), v(r, e, u, a, s, l || c)
        }))
    }, t.fn.off = function(e, i, s) {
        var a = this;
        return e && !o(e) ? (t.each(e, function(t, e) {
            a.off(t, i, e)
        }), a) : (o(i) || r(s) || s === !1 || (s = i, i = n), s === !1 && (s = b), a.each(function() {
            y(this, e, s, i)
        }))
    }, t.fn.trigger = function(e, n) {
        return e = o(e) || t.isPlainObject(e) ? t.Event(e) : j(e), e._args = n, this.each(function() {
            "dispatchEvent" in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n)
        })
    }, t.fn.triggerHandler = function(e, n) {
        var i, r;
        return this.each(function(s, a) {
            i = T(o(e) ? t.Event(e) : e), i._args = n, i.target = a, t.each(h(a, e.type || e), function(t, e) {
                return r = e.proxy(i), i.isImmediatePropagationStopped() ? !1 : void 0
            })
        }), r
    }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e) {
        t.fn[e] = function(t) {
            return t ? this.bind(e, t) : this.trigger(e)
        }
    }), ["focus", "blur"].forEach(function(e) {
        t.fn[e] = function(t) {
            return t ? this.bind(e, t) : this.each(function() {
                try {
                    this[e]()
                } catch (t) {
                }
            }), this
        }
    }), t.Event = function(t, e) {
        o(t) || (e = t, t = e.type);
        var n = document.createEvent(a[t] || "Events"), i = !0;
        if (e)
            for (var r in e)
                "bubbles" == r ? i = !!e[r] : n[r] = e[r];
        return n.initEvent(t, i, !0), j(n)
    }
}(Zepto), function(t) {
    function l(e, n, i) {
        var r = t.Event(n);
        return t(e).trigger(r, i), !r.isDefaultPrevented()
    }
    function h(t, e, i, r) {
        return t.global ? l(e || n, i, r) : void 0
    }
    function p(e) {
        e.global && 0 === t.active++ && h(e, null, "ajaxStart")
    }
    function d(e) {
        e.global && !--t.active && h(e, null, "ajaxStop")
    }
    function m(t, e) {
        var n = e.context;
        return e.beforeSend.call(n, t, e) === !1 || h(e, n, "ajaxBeforeSend", [t, e]) === !1 ? !1 : void h(e, n, "ajaxSend", [t, e])
    }
    function g(t, e, n, i) {
        var r = n.context, o = "success";
        n.success.call(r, t, o, e), i && i.resolveWith(r, [t, o, e]), h(n, r, "ajaxSuccess", [e, n, t]), y(o, e, n)
    }
    function v(t, e, n, i, r) {
        var o = i.context;
        i.error.call(o, n, e, t), r && r.rejectWith(o, [n, e, t]), h(i, o, "ajaxError", [n, i, t || e]), y(e, n, i)
    }
    function y(t, e, n) {
        var i = n.context;
        n.complete.call(i, e, t), h(n, i, "ajaxComplete", [e, n]), d(n)
    }
    function x() {
    }
    function b(t) {
        return t && (t = t.split(";", 2)[0]), t && (t == f ? "html" : t == u ? "json" : s.test(t) ? "script" : a.test(t) && "xml") || "text"
    }
    function w(t, e) {
        return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?")
    }
    function E(e) {
        e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = w(e.url, e.data), e.data = void 0)
    }
    function j(e, n, i, r) {
        return t.isFunction(n) && (r = i, i = n, n = void 0), t.isFunction(i) || (r = i, i = void 0), {url: e,data: n,success: i,dataType: r}
    }
    function S(e, n, i, r) {
        var o, s = t.isArray(n), a = t.isPlainObject(n);
        t.each(n, function(n, u) {
            o = t.type(u), r && (n = i ? r : r + "[" + (a || "object" == o || "array" == o ? n : "") + "]"), !r && s ? e.add(u.name, u.value) : "array" == o || !i && "object" == o ? S(e, u, i, n) : e.add(n, u)
        })
    }
    var i, r, e = 0, n = window.document, o = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, s = /^(?:text|application)\/javascript/i, a = /^(?:text|application)\/xml/i, u = "application/json", f = "text/html", c = /^\s*$/;
    t.active = 0, t.ajaxJSONP = function(i, r) {
        if (!("type" in i))
            return t.ajax(i);
        var f, h, o = i.jsonpCallback, s = (t.isFunction(o) ? o() : o) || "jsonp" + ++e, a = n.createElement("script"), u = window[s], c = function(e) {
            t(a).triggerHandler("error", e || "abort")
        }, l = {abort: c};
        return r && r.promise(l), t(a).on("load error", function(e, n) {
            clearTimeout(h), t(a).off().remove(), "error" != e.type && f ? g(f[0], l, i, r) : v(null, n || "error", l, i, r), window[s] = u, f && t.isFunction(u) && u(f[0]), u = f = void 0
        }), m(l, i) === !1 ? (c("abort"), l) : (window[s] = function() {
            f = arguments
        }, a.src = i.url.replace(/\?(.+)=\?/, "?$1=" + s), n.head.appendChild(a), i.timeout > 0 && (h = setTimeout(function() {
            c("timeout")
        }, i.timeout)), l)
    }, t.ajaxSettings = {type: "GET",beforeSend: x,success: x,error: x,complete: x,context: null,global: !0,xhr: function() {
            return new window.XMLHttpRequest
        },accepts: {script: "text/javascript, application/javascript, application/x-javascript",json: u,xml: "application/xml, text/xml",html: f,text: "text/plain"},crossDomain: !1,timeout: 0,processData: !0,cache: !0}, t.ajax = function(e) {
        var n = t.extend({}, e || {}), o = t.Deferred && t.Deferred();
        for (i in t.ajaxSettings)
            void 0 === n[i] && (n[i] = t.ajaxSettings[i]);
        p(n), n.crossDomain || (n.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(n.url) && RegExp.$2 != window.location.host), n.url || (n.url = window.location.toString()), E(n), n.cache === !1 && (n.url = w(n.url, "_=" + Date.now()));
        var s = n.dataType, a = /\?.+=\?/.test(n.url);
        if ("jsonp" == s || a)
            return a || (n.url = w(n.url, n.jsonp ? n.jsonp + "=?" : n.jsonp === !1 ? "" : "callback=?")), t.ajaxJSONP(n, o);
        var j, u = n.accepts[s], f = {}, l = function(t, e) {
            f[t.toLowerCase()] = [t, e]
        }, h = /^([\w-]+:)\/\//.test(n.url) ? RegExp.$1 : window.location.protocol, d = n.xhr(), y = d.setRequestHeader;
        if (o && o.promise(d), n.crossDomain || l("X-Requested-With", "XMLHttpRequest"), l("Accept", u || "*/*"), (u = n.mimeType || u) && (u.indexOf(",") > -1 && (u = u.split(",", 2)[0]), d.overrideMimeType && d.overrideMimeType(u)), (n.contentType || n.contentType !== !1 && n.data && "GET" != n.type.toUpperCase()) && l("Content-Type", n.contentType || "application/x-www-form-urlencoded"), n.headers)
            for (r in n.headers)
                l(r, n.headers[r]);
        if (d.setRequestHeader = l, d.onreadystatechange = function() {
            if (4 == d.readyState) {
                d.onreadystatechange = x, clearTimeout(j);
                var e, i = !1;
                if (d.status >= 200 && d.status < 300 || 304 == d.status || 0 == d.status && "file:" == h) {
                    s = s || b(n.mimeType || d.getResponseHeader("content-type")), e = d.responseText;
                    try {
                        "script" == s ? (1, eval)(e) : "xml" == s ? e = d.responseXML : "json" == s && (e = c.test(e) ? null : t.parseJSON(e))
                    } catch (r) {
                        i = r
                    }
                    i ? v(i, "parsererror", d, n, o) : g(e, d, n, o)
                } else
                    v(d.statusText || null, d.status ? "error" : "abort", d, n, o)
            }
        }, m(d, n) === !1)
            return d.abort(), v(null, "abort", d, n, o), d;
        if (n.xhrFields)
            for (r in n.xhrFields)
                d[r] = n.xhrFields[r];
        var T = "async" in n ? n.async : !0;
        d.open(n.type, n.url, T, n.username, n.password);
        for (r in f)
            y.apply(d, f[r]);
        return n.timeout > 0 && (j = setTimeout(function() {
            d.onreadystatechange = x, d.abort(), v(null, "timeout", d, n, o)
        }, n.timeout)), d.send(n.data ? n.data : null), d
    }, t.get = function() {
        return t.ajax(j.apply(null, arguments))
    }, t.post = function() {
        var e = j.apply(null, arguments);
        return e.type = "POST", t.ajax(e)
    }, t.getJSON = function() {
        var e = j.apply(null, arguments);
        return e.dataType = "json", t.ajax(e)
    }, t.fn.load = function(e, n, i) {
        if (!this.length)
            return this;
        var a, r = this, s = e.split(/\s/), u = j(e, n, i), f = u.success;
        return s.length > 1 && (u.url = s[0], a = s[1]), u.success = function(e) {
            r.html(a ? t("<div>").html(e.replace(o, "")).find(a) : e), f && f.apply(r, arguments)
        }, t.ajax(u), this
    };
    var T = encodeURIComponent;
    t.param = function(t, e) {
        var n = [];
        return n.add = function(t, e) {
            this.push(T(t) + "=" + T(e))
        }, S(n, t, e), n.join("&").replace(/%20/g, "+")
    }
}(Zepto), function(t) {
    t.fn.serializeArray = function() {
        var n, e = [];
        return t([].slice.call(this.get(0).elements)).each(function() {
            n = t(this);
            var i = n.attr("type");
            "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != i && "reset" != i && "button" != i && ("radio" != i && "checkbox" != i || this.checked) && e.push({name: n.attr("name"),value: n.val()})
        }), e
    }, t.fn.serialize = function() {
        var t = [];
        return this.serializeArray().forEach(function(e) {
            t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value))
        }), t.join("&")
    }, t.fn.submit = function(e) {
        if (e)
            this.bind("submit", e);
        else if (this.length) {
            var n = t.Event("submit");
            this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit()
        }
        return this
    }
}(Zepto), function(t) {
    "__proto__" in {} || t.extend(t.zepto, {Z: function(e, n) {
            return e = e || [], t.extend(e, t.fn), e.selector = n || "", e.__Z = !0, e
        },isZ: function(e) {
            return "array" === t.type(e) && "__Z" in e
        }});
    try {
        getComputedStyle(void 0)
    } catch (e) {
        var n = getComputedStyle;
        window.getComputedStyle = function(t) {
            try {
                return n(t)
            } catch (e) {
                return null
            }
        }
    }
}(Zepto);
