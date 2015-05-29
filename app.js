var fs = require('fs');

module.exports = {
    findJSScripts: function (inputFile, outputFile, callback) {
        if(!inputFile) {
            callback('Error: No input file specified, should be the first parameter');
        }
        if(!outputFile) {
            callback('Error: No output file specified');
        }

        console.log("Parsing " + inputFile + '...');
        fs.readFile(inputFile, 'utf8', function (err, data) {
            if(err) {
                callback('Error: There was an error reading file ' + inputFile + '\n' + err);
            }
            if(!data) {
                callback('Error: Input file has no contents');
            }

            var scriptsResult = getScriptsString(data);
            console.log('Found ' + scriptsResult.count + ' JS scripts');
            writeToFile(outputFile, scriptsResult.scripts, callback);
        });
    }
};


function getScriptsString(data) {
    var scripts = "";
    var scriptTagsRegex = /<script[^>]*src="?([^> "]*)"?[^>]*>/g;
    var count = 0;

    var nextScriptTag = scriptTagsRegex.exec(data);
    while (nextScriptTag) {
        count++;
        scripts += '"' + nextScriptTag[1] + '"';
        nextScriptTag = scriptTagsRegex.exec(data);
        if(nextScriptTag) {
            scripts += ',\n';
        }
    }

    return {
        scripts: scripts,
        count: count
    };
}

function writeToFile(file, scripts, callback) {
    console.log("Reading contents of " + file + '...');
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            callback('Error: cannot open output file ' + file + '\n' + err);
        }

        var result = data.replace(new RegExp('"{{scripts}}"', 'g'), scripts);
        callback();

        console.log("Writing changes to " + file + '...');
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err) {
                callback('Error: cannot write to output file ' + file + '\n' + err);
            }
        });
    });
}

