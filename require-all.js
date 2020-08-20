const fs = require('fs');
const path = require('path');

const camelCase = (name, splitChar = '-') =>
  name
    .split(splitChar)
    .map((word, index) =>
      (index ?
        word[0].toUpperCase() + word.slice(1) :
        word))
    .join('');

const removeFileExt = name =>
  name.substr(0,
    name.lastIndexOf('.') > 0 ?
      name.lastIndexOf('.') :
      name.length
  );

// Requires all the modules from the path of `modulePath` and
// exports them with camelCase style of their filename
// also runs a modifier before exporting them as an object
const requireAll = (modulePath, modifier = m => m) => {
  const [dirname, basename] = [
    path.dirname(modulePath),
    path.basename(modulePath),
  ];
  return fs.readdirSync(dirname)
    .filter(fileName => fileName.toLowerCase() !== basename)
    .map(modifier)
    .reduce((exports, requireName) =>
      (exports[camelCase(removeFileExt(requireName))] = require(path.join(dirname, requireName)),
      exports),
    {});
};

module.exports = requireAll;
