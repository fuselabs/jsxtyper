var jsxtypercore = require('../jsxtypercore'),
    path = require('path');

module.exports = function (grunt) {
    grunt.registerMultiTask('jsxtyper', 'Generate TypeScript interfaces from jsx files.', function () {
        this.files.forEach(function (file) {

            // Read and concat all source jsx files.
            var jsxFileNames = [];
            var jsxText = file.src.map(function (filepath) {
                jsxFileNames.push(path.basename(filepath));
                return grunt.file.read(filepath);
            }).join('\n');
            grunt.log.writeln("Read " + jsxFileNames.join(", "));

            // Generate TypeScript.
            jsxtypercore.generateTypeScript(jsxText, function (err, tsText) {
                if (err) {
                    grunt.fail.warn(err);
                }
                else {
                    grunt.log.writeln("Writing " + file.dest);
                    grunt.file.write(file.dest, tsText);
                }
            });
        });
    });
};
