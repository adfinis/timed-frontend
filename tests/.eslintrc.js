"use strict";

module.exports = {
  env: {
    embertest: true,
    node: true
  },
  globals: {
    server: true,
    taskSelect: true,
    userSelect: true,
    setBreakpoint: true,
    selectChoose: true,
    selectSearch: true,
    removeMultipleOption: true,
    clearSelected: true
  },
  rules: {
    "no-magic-numbers": "off",
    "require-jsdoc": "off"
  }
};
