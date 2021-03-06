'use strict';

class Grunt {

  static run(name, tasks, options) {

    options = options || {};
    options['gruntfile'] = path.join(pwd, patch.getGruntFile());
    options['base'] = pwd;
    if (adapt && adapt.grunt && adapt.grunt.options) {
      _.extend(options, adapt.grunt.options);
    }

    var opts = "";
    if (options && Object.keys(options).length) {
      for (var k in options) {
        opts+=` --${k}="${options[k]}"`
      }
    }
    var command = "grunt "+tasks.join(" ")+opts;

    return new Promise((resolve, reject)=>{

      let exec = require('child_process').exec;
      let child = exec(command, {
        cwd: options['base']
      }, (error, stdout, stderr)=>{

        if (error && error.code) {
          return reject({
            name,
            tasks,
            options,
            error,
            stdout,
            stderr
          });
        }

        resolve({
          name,
          tasks,
          options,
          error,
          stdout,
          stderr
        });

      });

    });

  }

  static parseOutput(output) {

    output = output.replace(/Running \".*\" \(.*\) task\n/g, "");
    output = output.replace(/Running \".*\" task\n/g, "");
    output = output.replace(/Task complete\. .*\n/g, "");
    output = output.replace(/Total compressed\: .*\n/g, "");
    output = output.replace(/block\: .*\n/g, "");
    output = output.replace(/\nDone.\n/g, "");
    output = output.replace(/Copied.*\n/g, "");
    output = output.replace(/Created.*\n/g, "");
    output = output.replace(/>> SyntaxError/g, "SyntaxError");
    //output = output.replace(/>> .*\n/g, "");
    output = output.replace(/>> No issues found, your JSON is a-ok!/g,"");
    output = output.replace(/>> [0-9]* files lint free.\n/g, "");
    output = output.replace(/>> .* KiB - .*% = .* KiB\n/g,"");
    output = output.replace(/>> [0-9]* file.* created.*\n/g,"");

    output = output.replace(/Aborted due to warnings\.\n/g, "");
    output = output.replace(/Use --force to continue\.\n/g, "");
    output = output.replace(/No newer files to process\./g, "");
    output = output.replace(/>> /g, "");
    while (output.indexOf("\n\n") > -1) {
      output = output.replace(/\n\n/g, "\n");
    }
    if (!output || output == "\n") return;
    if (output.substr(-1) === "\n") output = output.substr(0, output.length-1);
    output = output.split("\n").filter(function(item) {
      return item.trim();
    }).join("\n");
    return output;

  }

  static output(data) {
    logger.pad(4);
    let output = grunt.parseOutput(data.stdout);
    if (!output) return;
    log(data.name+output);
    logger.pad(2);
  }

  static error(data) {
    logger.pad(4);
    let output = grunt.parseOutput(data.stdout);
    if (!output) return;
    notice(data.name+output);
    logger.pad(2);
  }

}

module.exports = Grunt;