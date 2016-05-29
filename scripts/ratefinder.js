/**
 * Dependencies
 */
var system = require('system');

/**
 * Script initialization
 */
var Script = new require('./script');
var script = new Script({
    name: 'ratefinder',
    url: system.args[1],
    debug: system.args[2],
    viewportSize: { width: 1024, height: 800 }
});

script.page.onLoadFinished = function() {
    if (script.debug) script.outputDebug();
    findRates();
};

var rateRegex = /[$]?0.\d+\s*(\/)\s*(kWh|kwh|KWH|Kwh)/ig;
var scriptsRegex = /<(no)?script(.|\n)+?<\/(no)?script>/ig;

function getRateInfo(body, rates) {
    script.log('getRateInfo');
}

function digDeeper() {
    script.log('digDeeper');
}

function findRates() {
    var body = script.page.evaluate(function() {
        return document.querySelector("body");
    });

    var cleanBody = body.innerHTML.replace(scriptsRegex, "");
    fs.write('debug/content.txt', cleanBody, 'w');

    // If rates are found on the page, attempt to store them for comparison
    if (rateRegex.test(cleanBody)) {
        var rates = cleanBody.match(rateRegex);
        if (rates && rates.length > 0) getRateInfo(body);
        else script.log('Something broke when trying to find matches for rates');
    }
    // Otherwise, attempt to go deeper into the site structure
    else digDeeper();

    phantom.exit();
}
