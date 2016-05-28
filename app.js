var crawler = require('./crawler');
var debug = 1;

var search = 'chicago electricity 60647';

crawler('googleSearch', search, debug).then(function(res) {
    console.log(res);
}).catch(console.log);
