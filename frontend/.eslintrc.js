"use-strict";

module.exports = {
  extends: ["@adfinis/eslint-config/ember-app"],
  rules: {
    "ember/no-actions-hash": "warn",
    "ember/no-component-lifecycle-hooks": "warn",
    "ember/no-mixins": "warn",
    "ember/no-new-mixins": "warn",
    "ember/no-classic-classes": "warn",
    "ember/no-classic-components": "warn",
    "ember/no-get": "warn",
    "ember/no-observers": "warn",
    "qunit/no-assert-equal": "warn",
    "ember/require-tagless-components": "warn",
  },
};
