const fs = require('fs');
const path = require('path');

const camelCase = name =>
  name
    .substr(0,
      name.lastIndexOf('.') > 0 ?
        name.lastIndexOf('.') :
        name.length)
    .split('-')
    .map((word, index) =>
      index ?
        word[0].toUpperCase() + word.slice(1) :
        word)
    .join('');

// Requires all the modules in `dirname` path and
// exports them with camelCase style of their filename
module.exports = dirname =>
  fs.readdirSync(dirname).filter(fileName => fileName.toLowerCase() !== 'index.js').reduce((exports, requireName) =>
    (exports[camelCase(requireName)] = require(path.join(dirname, requireName)),
      exports), {});

