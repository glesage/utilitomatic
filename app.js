var crawler = require('./crawler');
var debug = 0;

var search = 'chicago electricity 60647';
crawler('googleSearch', search, debug).then(function(res) {
    if (!res || res.length < 1) {
        return console.log('No sites found');
    }

    var crawls = [];
    res.forEach(function(url) {
        crawls.push(crawler('ratefinder', url, debug));
    });
    return Promise.all(crawls);

}).then(console.log).catch(console.log);
