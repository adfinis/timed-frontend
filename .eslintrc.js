"use-strict";

module.exports = {
  extends: ["@adfinis-sygroup/eslint-config/ember-app"],
  rules: {
    "ember/no-mixins": "warn",
    "ember/no-actions-hash": "warn",
    "ember/no-classic-classes": "warn",
    "ember/no-classic-components": "warn",
    "ember/no-computed-properties-in-native-classes": "warn",
    "ember/no-get": "warn",
    "ember/require-computed-property-dependencies": "warn",
    "qunit/no-assert-equal": "warn",
  },
};
