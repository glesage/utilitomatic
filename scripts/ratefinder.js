/**
 * Dependencies
 */
var system = require('system');
var fs = require('fs');
var DOMElement = new require('../classes/dom-element');

/**
 * Script initialization
 */
var Script = new require('../classes/script');
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

var rateAmountRegex = /[$]?0.\d+\s*(\/)\s*(kWh|kwh|KWH|Kwh)/ig;
var rateTimeRegex = /\d?\d\s?(m(o)?|(onths)?)/ig
var scriptsRegex = /<(no)?script(.|\n)+?<\/(no)?script>/ig;

function getRateInfo(elements) {

    var types = { "r": rateAmountRegex, "d": rateTimeRegex };
    try {
        var tree = new DOMElement('root');
        var test = [];
        for (var i = 0; i < elements.children.length; i++) {
            if (!elements.children[i]) continue;
            var childElement = DOMElement.buildTree(elements.children[i], tree, types);
            if (childElement) tree.children.push(childElement);
        }
        fs.write('debug/out.txt', tree.toString(), 'w');
    } catch (e) {
        fs.write('debug/error.txt', e, 'w');
    }
}

function digDeeper() {
    Script.log('digDeeper');
}

function findRates() {
    var body = script.page.evaluate(function() {
        return document.body;
    });

    var cleanBody = body.innerHTML.replace(scriptsRegex, "");
    fs.write('debug/content.txt', cleanBody, 'w');

    // If rates are found on the page, attempt to store them for comparison
    if (rateAmountRegex.test(cleanBody) && rateTimeRegex.test(cleanBody)) {
        getRateInfo(script.page.evaluate(function() {
            return document.documentElement;
        }));
    }
    // Otherwise, attempt to go deeper into the site structure
    else digDeeper();

    phantom.exit();
}
