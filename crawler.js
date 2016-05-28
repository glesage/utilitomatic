/* Module dependencies */
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs-prebuilt');
var binPath = phantomjs.path;


/**
 * Wrapper for calling a PhantomJS webcrawling script
 *
 * @param {script}          Required String.    Title of script file in /scripts subfolder
 * @param {data}            Optional Object.    Arguments passed to script.  Must be JSON.stringified to be sent
 *                                              to Phantom, which must then JSON.parse it to use it as an object.
 */
module.exports = function(script, data, debug) {
    return new Promise(function(resolve, reject) {
        data = JSON.stringify(data);

        var childArgs = [
            path.join(__dirname, '/scripts/' + script + '.js'),
            data,
            debug
        ];

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
            // handle results
            if (err) return reject(err);
            if (stderr) return reject(err);

            resolve(JSON.parse(stdout));
        });
    });
};
