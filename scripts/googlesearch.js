/**
 * Dependencies
 */
var fs = require('fs');
var _ = require('lodash');

/**
 * Parameters passed as arguments to script
 */
var system = require('system');
var search = system.args[1].replace(/"/g, "");
var debug = system.args[2];

/**
 * Page creation & configuration
 */
var page = new WebPage();
page.customHeaders = {
    "User-Agent": "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30",
    "Accept-Language": "en"
};

/**
 * Global vars
 */
var googleurl = 'https://www.google.com/?hl=en';
var searchSubmited = null;

/**
 * PhantomJS handlers
 */
page.onLoadFinished = function() {
    if (debug) {
        page.render('debug/export.png');
        fs.write('debug/google.html', page.content, 'w');
    }

    if (!searchSubmited) injectJQuery();
    else scrapeLinks();
};

function scrapeLinks() {
    var returnLinks = page.evaluate(function() {
        var links = document.querySelectorAll("h3.r a");
        return Array.prototype.map.call(links, function(anchor) {
            return anchor.getAttribute("href");
        });
    });
    returnLinks = _.filter(returnLinks, function(l) {
        return l.indexOf('youtube') === -1;
    });
    console.log(JSON.stringify(returnLinks));
    phantom.exit();
}

function submitSearch() {
    page.evaluate(function(search) {
        $('input[name=q]').val(search);
        $('form').trigger('submit');
    }, search);

    searchSubmited = 1;
}

function injectJQuery() {
    page.includeJs('https://code.jquery.com/jquery-2.2.4.min.js', function() {
        submitSearch();
    });
}

page.open(googleurl);
