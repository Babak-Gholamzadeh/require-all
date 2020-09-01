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

const helperMethods = modules =>
  (methods =>
    Object.entries(methods).reduce((wrappedMethods, [methodName, methodValue]) =>
      (wrappedMethods[methodName] = (...args) => normalize(methodValue(...args)),
      wrappedMethods),
    {})
  )(((modulesArr, modulesObj) => ({
    map: (callback) =>
      modulesArr.reduce((acc, module) => {
        const [key] = module;
        acc[key] = callback(module, modulesObj);
        return acc;
      }, {}),
    filter: (callback) =>
      modulesArr.reduce((acc, module) => {
        const [key, value] = module;
        if (callback(module, modulesObj))
          acc[key] = value;
        return acc;
      }, {}),
    reduce: (callback, initAcc = {}) =>
      modulesArr.reduce((acc, module) =>
        callback(acc, module, modulesObj),
      initAcc),
    forEach: (callback) => {
      modulesArr.forEach(module => callback(module, modulesObj));
      return modulesObj;
    }
  }))(Object.entries(modules), modules));

const normalize = modules =>
  Object.setPrototypeOf(modules, helperMethods(modules));

// Requires all the modules from the path of `modulePath` and
// exports them with camelCase style of their filename
// also runs a modifier before exporting them as an object
const requireAll = modulePath =>
  ((dirname, basename) =>
    normalize(fs.readdirSync(dirname)
      .filter(fileName => fileName.toLowerCase() !== basename)
      .reduce((exports, requireName) =>
        (exports[camelCase(removeFileExt(requireName))] = require(path.join(dirname, requireName)),
        exports),
      {}))
  )(path.dirname(modulePath), path.basename(modulePath));

module.exports = requireAll;
