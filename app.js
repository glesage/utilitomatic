var crawler = require('./crawler');

var search = 'chicago electricity 60647';
crawler('googleSearch', search).then(function(res) {
    console.log(res);
}).catch(console.log);
