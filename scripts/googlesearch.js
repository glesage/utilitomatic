/**
 * Dependencies
 */
var system = require('system');
var _ = require('lodash');

/**
 * Script initialization
 */
var search = system.args[1].replace(/"/g, "");
var searchSubmited = null;

var Script = new require('./script');
var script = new Script({
    name: 'googlesearch',
    url: "https://www.google.com/?hl=en",
    debug: system.args[2],
    userAgent: "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
});

script.page.onLoadFinished = function() {
    if (script.debug) script.outputDebug();

    if (!searchSubmited) injectJQuery();
    else scrapeLinks();
};

function scrapeLinks() {
    var returnLinks = script.page.evaluate(function() {
        var links = document.querySelectorAll("h3.r a");
        return Array.prototype.map.call(links, function(anchor) {
            return anchor.getAttribute("href");
        });
    });
    returnLinks = _.filter(returnLinks, function(l) {
        return l.indexOf('youtube') === -1;
    });
    script.log(returnLinks);
    phantom.exit();
}

function submitSearch() {
    script.page.evaluate(function(search) {
        $('input[name=q]').val(search);
        $('form').trigger('submit');
    }, search);

    searchSubmited = 1;
}

function injectJQuery() {
    script.page.includeJs('https://code.jquery.com/jquery-2.2.4.min.js', function() {
        submitSearch();
    });
}
