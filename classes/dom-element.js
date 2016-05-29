var fs = require('fs');

/**
 * Prototype
 */
function DOMElement(tag, type, value) {
    if (!tag) return new Error('tag is a required argument');

    this.tag = tag;

    this.parent = null;
    this.children = [];

    if (type) this.type = type;
    if (value) this.value = value;
}
DOMElement.prototype.setChildren = function(children) {
    if (!children || children.length < 1) return;

    this.value = null;
    this.children = children;
}
module.exports = DOMElement;
DOMElement.prototype.toString = function(offset) {
    if (!offset) offset = 0;
    var offStr = "";
    for (var i = 0; i < offset; i++) {
        offStr += " ";
    }
    var output = offStr + "Tag: " + this.tag;
    if (this.type) output += "\n" + offStr + "Tag: " + this.type;
    if (this.value) output += "\n" + offStr + "Val: " + this.value;
    if (this.parent) output += "\n" + offStr + "Parent: " + this.parent.tag;
    if (this.children) output += "\n" + offStr + "Children: " + this.children.length;
    if (this.children.length > 0) {
        this.children.forEach(function(c) {
            output += "\n" + c.toString(offset + 2);
        });
    }
    return output;
}
module.exports = DOMElement;

/**
 * Converters from native Javascript HTMLDOMElement
 */
function DOMElementFromHTMLElement(element, types) {
    if (!element) return null;
    if (!element.innerHTML || !types) return new DOMElement(element.tagName);

    var value = element.innerHTML;
    for (var type in types) {
        if (!types[type]) continue;
        var matches = value.match(types[type]);
        if (!matches || matches.length === 0) continue;
        return new DOMElement(element.tagName, type, value);
    }
    return new DOMElement(element.tagName, null, value);
}
DOMElement.convertHTMLDOM = DOMElementFromHTMLElement;

function TreeFromHTMLElement(element, parent, types) {
    if (!element) return null;

    var newElement = DOMElementFromHTMLElement(element, types);
    newElement.parent = parent;
    newElement.setChildren(getChildrenFromHTMLElement(element, types));
    return newElement;
}
DOMElement.buildTree = TreeFromHTMLElement;

/**
 * Utilities
 */
function getChildrenFromHTMLElement(element, types) {
    if (!element.children || element.children.length < 1) return [];
    var children = [];

    for (var i = 0; i < element.children.length; i++) {
        var child = TreeFromHTMLElement(element.children[i], element, types);
        if (child) children.push(child);
    }
    return children;
}
