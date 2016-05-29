/**
 * Dependencies
 */
var fs = require('fs');
var _ = require('lodash');

/**
 * Parameters passed as arguments to script
 */
var system = require('system');
var website = system.args[1].replace(/"/g, "");
var debug = system.args[2];

/**
 * Page creation & configuration
 */
var page = new WebPage();
page.customHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
    "Accept-Language": "en"
};

var rateRegex = /[$]?0.\d+\s*(\/)\s*(kWh|kwh|KWH|Kwh)/ig;
var scriptsRegex = /<(no)?script(.|\n)+?<\/(no)?script>/ig;

/**
 * PhantomJS handlers
 */
page.onLoadFinished = function() {
    if (debug) {
        page.render('debug/website.png');
        fs.write('debug/website.html', page.content, 'w');
    }

    findRates();
};

function findRates() {
    var body = page.evaluate(function() {
        return document.querySelector("body");
    });

    var cleanBody = body.innerHTML.replace(scriptsRegex, "");
    if (rateRegex.test(cleanBody)) {
        var matches = cleanBody.match(rateRegex);
        console.log(matches);
    }

    phantom.exit();
}

page.open(website);
