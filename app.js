var fs = require('fs');

module.exports = {
    findJSScripts: function (inputFile, outputFile, stringToReplace) {
        if(!inputFile) {
            throw 'Error: No input file specified, should be the first parameter'
        }

        fs.readFile(inputFile, 'utf8', function (err, data) {
            if(err) {
                throw 'Error: There was an error reading file ' + inputFile + '\n' + err;
            }
            if(!data) {

                throw 'Error: Input file has no contents';
            }

            var scripts = getScriptsString(data);

            if(outputFile) {
                writeToFile(outputFile, scripts, stringToReplace);
            }

            else {
                console.log(scripts);
            }
        });
    }
};


function getScriptsString(data) {
    var scripts = "";
    var scriptTagsRegex = /<script[^>]*src="?([^> "]*)"?[^>]*>/g;

    var nextScriptTag = scriptTagsRegex.exec(data);
    while (nextScriptTag) {
        scripts += '"' + nextScriptTag[1] + '"';
        nextScriptTag = scriptTagsRegex.exec(data);
        if(nextScriptTag) {
            scripts += ',\n';
        }
    }

    return scripts;
}

function writeToFile(file, scripts, stringToReplace) {
    if(stringToReplace) {
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                throw 'Error: cannot open output file ' + file + '\n' + err;
            }

            var result = data.replace(new RegExp(stringToReplace, 'g'), scripts);

            fs.writeFile(file, result, 'utf8', function (err) {
                if (err) {
                    throw 'Error: cannot write to output file ' + file + '\n' + err;
                }
            });
        });
    } else {
        throw 'Error: If an output file is provided as the second parameter, then a string to replace must be provided ' +
        'as the third parameter';
    }
}

