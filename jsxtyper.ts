(function () {
    var jsxtyper = require('./jsxtypercore.js'),
        fs = require('fs');

    if (process.argv.length < 3) {
        var scriptName = process.argv[1].replace(/.*[\/\\]/, '');
        console.error(`${scriptName} generates TypeScript interfaces from React .jsx files`);
        console.error(`Usage: node ${scriptName} <jsxFilePath>`);
        process.exit(1);
    }

    fs.readFile(process.argv[2], (err, data) => {
        if (err) {
            console.error(`file could not be read: ${err.message}`);
            process.exit(1);
        }

        jsxtyper.generateTypeScript(data, (err: Error, tsText: string) => {
            if (err) {
                console.error(err.message);
            }
            else {
                console.log(tsText);
            }
        });
    });
})();
