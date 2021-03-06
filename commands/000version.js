'use strict';

commands.create({

  index: 0,
  command: "version",
  switch: "V",
  option: "version",
  description: "display version numbers",
  exclusive: true,

  shouldHelp() {
    return commands.has(['help', undefined]) || 
    (commands.has([undefined]) && (commands.switches(['h']) 
      || commands.options(['help'])));
  },

  shouldQueue() {
    return commands.has(['version']) ||
    commands.switches(['V']) || 
    commands.options(['version']);
  },

  queue(isFromWatch) {

    return new Promise((resolve, reject) => {
      log("Versions:");
      log();
      log("  Adapt Framework ", "v"+adapt.version);
      log("  Rub             ", "v"+rub.version);
      log("  Node            ", process.version);
      log();
      resolve({stop:commands.has(['version'])||commands.switches(['V'])});
    });

  }

});