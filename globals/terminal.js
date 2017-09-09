'use strict';

class Terminal {

  static parse() {

    let argv = process.argv;
    let args = argv.slice(0);

    //drop node
    //drop index.js
    if (/node/g.test(args[0])) args = argv.slice(2);

    var rtn = {
      switches: Terminal.parseOptions(args),
      items: args
    };

    return rtn;

  }

  static parseOptions(args) {

    let options = {};
    let i = 0;

    while (args.length > 0 && i < args.length) {

      let arg = args[i];
      switch (arg[0]) {
        case "-":
          args.splice(i,1);
          var sliceAt;
          for (var c = 0, cl = args[0].length; c < cl; c++) {
            if (arg[c] !== "-") {
              sliceAt = c;
              break;
            }
          }
          var whole = arg.slice(sliceAt);
          var parts = whole.split("=");

          if (parts.length === 1) options[parts[0]] = true;
          else {
            options[parts[0]] = whole.substr(parts[0].length+1);
          }

          break;
        default:
          i++;
      }

    }

    return options;

  }

}

module.exports = Terminal;