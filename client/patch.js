'use strict';

const term = require('terminal-kit').terminal;
const read = require('read-promise');
const colors = ['blue', 'magenta', 'yellow', 'red', 'cyan', 'green', 'white'];

const patchedTerm = {
  clear: () => {
    term.clear();
  },
  inputField: () => {
    return {
      promise: read('')
    }
  },
  windowTitle: (title) => {
    term.windowTitle(title);
  },
  backDelete: () => {},
  term: (text) => {
    // process.stdout.write(text);
    console.log(text);
  }
};
colors.map((color) => {
  patchedTerm[color] = (text) => {
    // process.stdout.write(text);
    console.log(text);
  };
});

module.exports = patchedTerm;
