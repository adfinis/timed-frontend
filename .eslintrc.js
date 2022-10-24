"use-strict";

module.exports = {
  extends: ["@adfinis-sygroup/eslint-config/ember-app"],
  rules: {
    "ember/no-mixins": "warn",
    "ember/no-new-mixins": "warn",
    "ember/no-classic-classes": "warn",
    "ember/no-get": "warn",
    "ember/no-observers": "warn",
    "qunit/no-assert-equal": "warn"
  }
};
