/**
 * Dependencies
 */
var fs = require('fs');

var defaultAgent = "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";

// Prototype
function Script(parameters) {
    if (!parameters.name) return new Error('name is a required argument');
    if (!parameters.url) return new Error('url is a required argument');

    this.name = parameters.name;
    this.url = parameters.url.replace(/"/g, "");

    this.debug = parameters.debug | null;
    this.maxDepth = parameters.maxDepth | 3;
    this.viewportSize = parameters.viewportSize;
    this.userAgent = defaultAgent;
    if (parameters.userAgent !== null) this.userAgent = parameters.userAgent;

    this.initPage();
}

Script.prototype.initPage = function() {
    this.page = new WebPage();
    this.page.customHeaders = {
        "User-Agent": this.userAgent,
        "Accept-Language": "en"
    };
    if (this.viewportSize) this.page.viewportSize = this.viewportSize;
    this.page.open(this.url);
}

Script.prototype.outputDebug = function() {
    this.page.render('debug/' + this.name + '.png');
    fs.write('debug/' + this.name + '.html', this.page.content, 'w');
};

Script.prototype.log = function(data) {
    console.log(JSON.stringify(data));
};

module.exports = Script;
