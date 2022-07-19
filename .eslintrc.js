"use-strict";

module.exports = {
  extends: ["@adfinis-sygroup/eslint-config/ember-app"],
  rules: {
    "ember/no-mixins": "warn",
    "ember/no-actions-hash": "warn",
    "ember/no-classic-classes": "warn",
    "ember/no-classic-components": "warn",
    "ember/no-component-lifecycle-hooks": "warn",
    "ember/no-computed-properties-in-native-classes": "warn",
    "ember/no-controller-access-in-routes": "warn", // this needs to be removed in favor of a reasonable solution
    "ember/no-get": "warn",
    "ember/require-computed-property-dependencies": "warn",
    "ember/require-tagless-components": "warn",
    "qunit/no-assert-equal": "warn",
  },
};
